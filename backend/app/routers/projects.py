"""
API endpoints for projects.

Endpoints:
- GET /api/projects - List all projects
- GET /api/projects/{project_id}/overview - Project overview for Overview tab
- GET /api/projects/{project_id}/scenarios - List scenarios for project
"""
from fastapi import APIRouter, HTTPException
from typing import List
from app.models import Project, ProjectOverview, ScenarioSummary, EnergyBreakdown
from app.services import queries, analytics

router = APIRouter(prefix="/api/projects", tags=["projects"])


@router.get("", response_model=List[Project])
def get_projects(company_id: str = None):
    """
    Get all projects, optionally filtered by company.

    Args:
        company_id: Optional company ID to filter projects

    Returns:
        List of projects (filtered by company if specified)
    """
    projects_data = queries.get_all_projects(company_id)
    return projects_data


@router.get("/{project_id}/overview", response_model=ProjectOverview)
def get_project_overview(project_id: str):
    """
    Get complete project overview for the Overview tab.

    This includes:
    - Basic project info
    - Total scenarios and worker sessions
    - High energy and direct control accuracy averages
    - RAG score
    - Energy breakdown by type

    Args:
        project_id: Project ID (e.g. "p1")

    Returns:
        Complete project overview
    """
    # Get project info
    project = queries.get_project_by_id(project_id)
    if not project:
        raise HTTPException(status_code=404, detail=f"Project {project_id} not found")

    # Get all hazard responses for this project
    hazard_responses = queries.get_hazard_responses_by_project(project_id)

    # Calculate energy breakdown
    energy_scores = analytics.calculate_energy_breakdown(hazard_responses)

    # Get energy types to build complete breakdown
    energy_types = queries.get_all_energy_types()
    energy_breakdown = []
    for et in energy_types:
        scores = energy_scores.get(et['id'], {'identScore': 0, 'highScore': 0, 'controlScore': 0})
        energy_breakdown.append({
            'id': et['id'],
            'label': et['label'],
            'icon': et['icon'],
            'color': et['color'],
            'identScore': scores['identScore'],
            'highScore': scores['highScore'],
            'controlScore': scores['controlScore'],
        })

    # Calculate overall averages
    if energy_breakdown:
        highAccAll = round(sum(e['highScore'] for e in energy_breakdown) / len(energy_breakdown))
        ctrlAccAll = round(sum(e['controlScore'] for e in energy_breakdown) / len(energy_breakdown))
    else:
        highAccAll = 0
        ctrlAccAll = 0

    ragScore = round((highAccAll + ctrlAccAll) / 2)

    # Count scenarios and total sessions
    scenarios = queries.get_scenarios_by_project(project_id)
    totalScenarios = len(scenarios)

    # Count unique worker-scenario combinations
    unique_sessions = set((h['scenario_id'], h['worker_id']) for h in hazard_responses)
    totalSessions = len(unique_sessions)

    return {
        'project': project,
        'totalScenarios': totalScenarios,
        'totalSessions': totalSessions,
        'highAccAll': highAccAll,
        'ctrlAccAll': ctrlAccAll,
        'ragScore': ragScore,
        'energyBreakdown': energy_breakdown,
    }


@router.get("/{project_id}/scenarios", response_model=List[ScenarioSummary])
def get_project_scenarios(project_id: str):
    """
    Get all scenarios for a project with summary statistics.

    Args:
        project_id: Project ID (e.g. "p1")

    Returns:
        List of scenarios with summary stats
    """
    # Get scenarios for project
    scenarios = queries.get_scenarios_by_project(project_id)

    if not scenarios:
        return []

    # Get energy types
    energy_types = queries.get_all_energy_types()

    result = []
    for scenario in scenarios:
        # Get hazard responses for this scenario
        hazard_responses = queries.get_hazard_responses_by_scenario(scenario['id'])

        # Calculate energy breakdown
        energy_scores = analytics.calculate_energy_breakdown(hazard_responses)

        # Build energy breakdown with full type info
        energy_breakdown = []
        for et in energy_types:
            scores = energy_scores.get(et['id'], {'identScore': 0, 'highScore': 0, 'controlScore': 0})
            energy_breakdown.append({
                'id': et['id'],
                'label': et['label'],
                'icon': et['icon'],
                'color': et['color'],
                'identScore': scores['identScore'],
                'highScore': scores['highScore'],
                'controlScore': scores['controlScore'],
            })

        # Count unique workers and calculate average score
        worker_scores = {}
        for response in hazard_responses:
            worker_id = response['worker_id']
            if worker_id not in worker_scores:
                worker_scores[worker_id] = []
            worker_scores[worker_id].append(response)

        # Calculate average identification score across all workers
        if worker_scores:
            avg_score = round(
                sum(analytics.calculate_worker_score(hazards) for hazards in worker_scores.values())
                / len(worker_scores)
            )
        else:
            avg_score = 0

        result.append({
            'id': scenario['id'],
            'projectId': scenario['project_id'],
            'name': scenario['name'],
            'date': scenario['date'],
            'workerCount': len(worker_scores),
            'avgScore': avg_score,
            'energyBreakdown': energy_breakdown,
        })

    return result
