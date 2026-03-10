"""
API endpoints for project comparison (Comparison tab).

Endpoints:
- GET /api/comparison/radar - Radar chart data
- GET /api/comparison/table - Table data
- GET /api/industry/benchmark - Industry benchmark data
"""
from fastapi import APIRouter, Query
from typing import List
from app.models import EnergyBreakdown, IndustryBenchmark
from app.services import queries, analytics

router = APIRouter(tags=["comparison"])

# Color mapping for projects (matches prototype)
PROJECT_COLORS = [
    {"border": "#0ea5e9", "bg": "rgba(14,165,233,0.10)"},
    {"border": "#f59e0b", "bg": "rgba(245,158,11,0.10)"},
    {"border": "#8b5cf6", "bg": "rgba(139,92,246,0.10)"},
    {"border": "#10b981", "bg": "rgba(16,185,129,0.10)"},
    {"border": "#ef4444", "bg": "rgba(239,68,68,0.10)"},
    {"border": "#ec4899", "bg": "rgba(236,72,153,0.10)"},
    {"border": "#64748b", "bg": "rgba(100,116,139,0.10)"},
]


@router.get("/api/comparison/projects")
def get_comparison_data(
    project_ids: str = Query(..., description="Comma-separated project IDs (e.g. 'p1,p2,p3')"),
    mode: str = Query("ident", description="Mode: ident, high, or control"),
    include_industry: bool = Query(False, description="Include industry benchmark")
):
    """
    Get project comparison data for radar chart.

    Args:
        project_ids: Comma-separated project IDs
        mode: Which metric to compare (ident, high, control)
        include_industry: Whether to include industry benchmark

    Returns:
        Radar chart datasets
    """
    # Parse project IDs
    project_id_list = [pid.strip() for pid in project_ids.split(",")]

    # Get energy types
    energy_types = queries.get_all_energy_types()

    # Determine score key based on mode
    score_key = {
        'ident': 'identScore',
        'high': 'highScore',
        'control': 'controlScore'
    }.get(mode, 'identScore')

    # Build datasets
    datasets = []
    for i, project_id in enumerate(project_id_list):
        # Get project info
        project = queries.get_project_by_id(project_id)
        if not project:
            continue

        # Get hazard responses
        hazard_responses = queries.get_hazard_responses_by_project(project_id)

        # Calculate energy breakdown
        energy_scores = analytics.calculate_energy_breakdown(hazard_responses)

        # Build data array in energy type order
        data = []
        for et in energy_types:
            scores = energy_scores.get(et['id'], {'identScore': 0, 'highScore': 0, 'controlScore': 0})
            data.append(scores[score_key])

        # Get color
        color = PROJECT_COLORS[i % len(PROJECT_COLORS)]

        datasets.append({
            'label': project['name'],
            'data': data,
            'borderColor': color['border'],
            'backgroundColor': color['bg'],
            'borderWidth': 2,
            'pointBackgroundColor': color['border']
        })

    # Add industry benchmark if requested
    if include_industry:
        benchmark_data = queries.get_industry_benchmark()
        benchmark_dict = {b['energy_id']: b for b in benchmark_data}

        data = []
        for et in energy_types:
            bench = benchmark_dict.get(et['id'])
            if bench:
                score = {
                    'ident': bench['ident_score'],
                    'high': bench['high_score'],
                    'control': bench['control_score']
                }.get(mode, 0)
                data.append(score)
            else:
                data.append(0)

        color = PROJECT_COLORS[6]
        datasets.append({
            'label': 'Industry Avg',
            'data': data,
            'borderColor': color['border'],
            'backgroundColor': color['bg'],
            'borderWidth': 2,
            'borderDash': [5, 3],
            'pointBackgroundColor': color['border']
        })

    return {
        'labels': [et['label'] for et in energy_types],
        'datasets': datasets
    }


@router.get("/api/comparison/table")
def get_comparison_table(
    project_ids: str = Query(..., description="Comma-separated project IDs"),
    include_industry: bool = Query(False, description="Include industry benchmark")
):
    """
    Get full comparison table data.

    Args:
        project_ids: Comma-separated project IDs
        include_industry: Whether to include industry benchmark

    Returns:
        Table rows with all metrics for each project
    """
    # Parse project IDs
    project_id_list = [pid.strip() for pid in project_ids.split(",")]

    # Get energy types
    energy_types = queries.get_all_energy_types()

    # Build result for each project
    projects_data = []
    for project_id in project_id_list:
        project = queries.get_project_by_id(project_id)
        if not project:
            continue

        hazard_responses = queries.get_hazard_responses_by_project(project_id)
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

        projects_data.append({
            'name': project['name'],
            'energyBreakdown': energy_breakdown
        })

    # Add industry benchmark if requested
    if include_industry:
        benchmark_data = queries.get_industry_benchmark()
        benchmark_dict = {b['energy_id']: b for b in benchmark_data}

        energy_breakdown = []
        for et in energy_types:
            bench = benchmark_dict.get(et['id'], {})
            energy_breakdown.append({
                'id': et['id'],
                'label': et['label'],
                'icon': et['icon'],
                'color': et['color'],
                'identScore': bench.get('ident_score', 0),
                'highScore': bench.get('high_score', 0),
                'controlScore': bench.get('control_score', 0),
            })

        projects_data.append({
            'name': 'Industry Avg',
            'energyBreakdown': energy_breakdown
        })

    return projects_data


@router.get("/api/industry/benchmark", response_model=IndustryBenchmark)
def get_industry_benchmark():
    """
    Get industry benchmark data.

    Returns:
        Industry benchmark with all energy type scores
    """
    energy_types = queries.get_all_energy_types()
    benchmark_data = queries.get_industry_benchmark()
    benchmark_dict = {b['energy_id']: b for b in benchmark_data}

    energy_breakdown = []
    for et in energy_types:
        bench = benchmark_dict.get(et['id'], {})
        energy_breakdown.append({
            'id': et['id'],
            'label': et['label'],
            'icon': et['icon'],
            'color': et['color'],
            'identScore': bench.get('ident_score', 0),
            'highScore': bench.get('high_score', 0),
            'controlScore': bench.get('control_score', 0),
        })

    return {'energyBreakdown': energy_breakdown}
