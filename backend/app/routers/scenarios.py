"""
API endpoints for scenarios.

Endpoints:
- GET /api/scenarios/{scenario_id} - Scenario detail
- GET /api/scenarios/compare - Compare two scenarios
"""
from fastapi import APIRouter, HTTPException, Query
from typing import List, Dict
from app.models import ScenarioDetail, ScenarioComparison, WorkerResult, WorkerHazard, EnergyBreakdown
from app.services import queries, analytics

router = APIRouter(prefix="/api/scenarios", tags=["scenarios"])


def build_scenario_detail(scenario_id: str) -> Dict:
    """
    Helper function to build complete scenario detail.

    Args:
        scenario_id: Scenario ID

    Returns:
        Complete scenario detail dictionary
    """
    # Get scenario info
    scenario = queries.get_scenario_by_id(scenario_id)
    if not scenario:
        raise HTTPException(status_code=404, detail=f"Scenario {scenario_id} not found")

    # Get hazard responses
    hazard_responses = queries.get_hazard_responses_by_scenario(scenario_id)

    # Get energy types
    energy_types = queries.get_all_energy_types()

    # Group hazards by worker
    workers_dict = {}
    for response in hazard_responses:
        worker_id = response['worker_id']
        worker_name = response['worker_name']

        if worker_id not in workers_dict:
            workers_dict[worker_id] = {
                'workerId': worker_id,
                'name': worker_name,
                'hazards': []
            }

        workers_dict[worker_id]['hazards'].append({
            'energyId': response['energy_id'],
            'identifiedCorrectly': bool(response['identified_correctly']),
            'markedHighEnergy': bool(response['marked_high_energy']),
            'correctHighEnergy': bool(response['correct_high_energy']),
            'markedDirectControl': bool(response['marked_direct_control']),
            'correctDirectControl': bool(response['correct_direct_control']),
        })

    # Calculate worker scores
    workers = []
    for worker_data in workers_dict.values():
        # Convert hazards back to raw format for calculation
        raw_hazards = []
        for h in worker_data['hazards']:
            raw_hazards.append({
                'identified_correctly': 1 if h['identifiedCorrectly'] else 0,
                'marked_high_energy': 1 if h['markedHighEnergy'] else 0,
                'correct_high_energy': 1 if h['correctHighEnergy'] else 0,
                'marked_direct_control': 1 if h['markedDirectControl'] else 0,
                'correct_direct_control': 1 if h['correctDirectControl'] else 0,
            })

        score = analytics.calculate_worker_score(raw_hazards)

        workers.append({
            'workerId': worker_data['workerId'],
            'name': worker_data['name'],
            'score': score,
            'hazards': worker_data['hazards']
        })

    # Calculate energy breakdown
    energy_scores = analytics.calculate_energy_breakdown(hazard_responses)
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

    return {
        'id': scenario['id'],
        'projectId': scenario['project_id'],
        'name': scenario['name'],
        'date': scenario['date'],
        'workers': workers,
        'energyBreakdown': energy_breakdown,
    }


@router.get("/compare", response_model=ScenarioComparison)
def compare_scenarios(
    scenario_a: str = Query(..., description="First scenario ID"),
    scenario_b: str = Query(..., description="Second scenario ID")
):
    """
    Compare two scenarios side-by-side.

    Args:
        scenario_a: First scenario ID (e.g. "g1")
        scenario_b: Second scenario ID (e.g. "g2")

    Returns:
        Comparison data for both scenarios
    """
    # Build details for both scenarios
    scA = build_scenario_detail(scenario_a)
    scB = build_scenario_detail(scenario_b)

    # Get project info for both
    projA = queries.get_project_by_id(scA['projectId'])
    projB = queries.get_project_by_id(scB['projectId'])

    if not projA or not projB:
        raise HTTPException(status_code=404, detail="Project not found")

    # Calculate average scores
    avgA = round(sum(w['score'] for w in scA['workers']) / len(scA['workers'])) if scA['workers'] else 0
    avgB = round(sum(w['score'] for w in scB['workers']) / len(scB['workers'])) if scB['workers'] else 0

    return {
        'scA': scA,
        'scB': scB,
        'projA': projA,
        'projB': projB,
        'bdA': scA['energyBreakdown'],
        'bdB': scB['energyBreakdown'],
        'avgA': avgA,
        'avgB': avgB,
    }


@router.get("/{scenario_id}", response_model=ScenarioDetail)
def get_scenario_detail(scenario_id: str):
    """
    Get detailed scenario data including all worker results.

    Args:
        scenario_id: Scenario ID (e.g. "g1")

    Returns:
        Complete scenario detail
    """
    return build_scenario_detail(scenario_id)
