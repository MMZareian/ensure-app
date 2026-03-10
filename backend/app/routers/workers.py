"""
API endpoints for workers (Workers tab).

Endpoints:
- GET /api/workers/summary - Worker summary table
- GET /api/workers/trends - Worker trends for a project
"""
from fastapi import APIRouter, Query
from typing import List, Optional
from app.models import WorkerSummary, WorkerTrend
from app.services import queries, analytics

router = APIRouter(prefix="/api/workers", tags=["workers"])


@router.get("/summary", response_model=List[WorkerSummary])
def get_worker_summary(
    project_id: str = Query(..., description="Project ID"),
    scenario_id: str = Query("all", description="Scenario ID or 'all'")
):
    """
    Get worker summary table.

    Args:
        project_id: Project ID (e.g. "p1")
        scenario_id: Specific scenario ID or "all" for all scenarios

    Returns:
        List of worker summaries with average scores
    """
    # Get scenarios to filter
    if scenario_id == "all":
        scenarios = queries.get_scenarios_by_project(project_id)
        scenario_ids = [s['id'] for s in scenarios]
    else:
        scenario_ids = [scenario_id]

    # Get all hazard responses for these scenarios
    all_responses = []
    for sid in scenario_ids:
        responses = queries.get_hazard_responses_by_scenario(sid)
        all_responses.extend(responses)

    if not all_responses:
        return []

    # Group by worker
    worker_data = {}
    for response in all_responses:
        worker_name = response['worker_name']
        scenario_id_current = response['scenario_id']

        if worker_name not in worker_data:
            worker_data[worker_name] = {
                'scenarios': set(),
                'hazards': []
            }

        worker_data[worker_name]['scenarios'].add(scenario_id_current)
        worker_data[worker_name]['hazards'].append(response)

    # Calculate averages for each worker
    result = []
    for worker_name, data in worker_data.items():
        hazards = data['hazards']

        avg_ident = analytics.calculate_worker_score(hazards)
        avg_high = analytics.calculate_worker_high_score(hazards)
        avg_control = analytics.calculate_worker_control_score(hazards)

        result.append({
            'name': worker_name,
            'scenarioCount': len(data['scenarios']) if scenario_id == "all" else None,
            'avgIdent': avg_ident,
            'avgHigh': avg_high,
            'avgControl': avg_control
        })

    # Sort by name
    result.sort(key=lambda x: x['name'])

    return result


@router.get("/trends", response_model=List[WorkerTrend])
def get_worker_trends(project_id: str = Query(..., description="Project ID")):
    """
    Get worker performance trends across scenarios in a project.

    This is used for the expandable worker cards in the Workers tab.

    Args:
        project_id: Project ID (e.g. "p1")

    Returns:
        List of worker trends with scenario-by-scenario performance
    """
    # Get all scenarios for project (ordered by date)
    scenarios = queries.get_scenarios_by_project(project_id)

    if len(scenarios) < 2:
        # Need at least 2 scenarios for trends
        return []

    # Get all workers for project
    all_workers = queries.get_workers_by_project(project_id)
    worker_names = [w['name'] for w in all_workers]

    # Build trend data for each worker
    result = []
    for i, worker_name in enumerate(worker_names):
        points = []

        for scenario in scenarios:
            # Get hazard responses for this worker in this scenario
            scenario_responses = queries.get_hazard_responses_by_scenario(scenario['id'])
            worker_responses = [r for r in scenario_responses if r['worker_name'] == worker_name]

            if not worker_responses:
                # Worker didn't participate in this scenario
                continue

            # Calculate scores
            ident = analytics.calculate_worker_score(worker_responses)
            high = analytics.calculate_worker_high_score(worker_responses)
            control = analytics.calculate_worker_control_score(worker_responses)

            # Truncate scenario name if too long
            scenario_name = scenario['name']
            if len(scenario_name) > 22:
                scenario_name = scenario_name[:21] + '…'

            points.append({
                'scenarioName': scenario_name,
                'ident': ident,
                'high': high,
                'control': control
            })

        # Only include workers who participated in at least one scenario
        if points:
            result.append({
                'name': worker_name,
                'colorIndex': i,
                'points': points
            })

    return result
