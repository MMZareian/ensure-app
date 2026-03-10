"""
Database query functions.

This module contains all SQL queries needed by the API endpoints.
"""
from typing import List, Dict, Any
from app.database import get_database


def get_all_energy_types() -> List[Dict[str, Any]]:
    """
    Get all energy types.

    Returns:
        List of energy types with id, label, icon, color
    """
    db = get_database()
    query = """
        SELECT id, label, icon, color
        FROM energy_types
        ORDER BY id
    """
    return db.execute_query(query)


def get_all_projects() -> List[Dict[str, Any]]:
    """
    Get all projects.

    Returns:
        List of projects with id, name, region, company_name, industry
    """
    db = get_database()
    query = """
        SELECT id, name, region, company_name, industry
        FROM projects
        ORDER BY id
    """
    return db.execute_query(query)


def get_project_by_id(project_id: str) -> Dict[str, Any] | None:
    """
    Get a single project by ID.

    Args:
        project_id: Project ID (e.g. "p1")

    Returns:
        Project dictionary or None if not found
    """
    db = get_database()
    query = """
        SELECT id, name, region, company_name, industry
        FROM projects
        WHERE id = ?
    """
    return db.execute_one(query, (project_id,))


def get_hazard_responses_by_project(project_id: str) -> List[Dict[str, Any]]:
    """
    Get all hazard responses for a project.

    Args:
        project_id: Project ID (e.g. "p1")

    Returns:
        List of hazard responses
    """
    db = get_database()
    query = """
        SELECT
            scenario_id,
            project_id,
            worker_id,
            worker_name,
            energy_id,
            identified_correctly,
            marked_high_energy,
            correct_high_energy,
            marked_direct_control,
            correct_direct_control
        FROM hazard_responses
        WHERE project_id = ?
        ORDER BY scenario_id, worker_id, energy_id
    """
    return db.execute_query(query, (project_id,))


def get_scenarios_by_project(project_id: str) -> List[Dict[str, Any]]:
    """
    Get all scenarios for a project.

    Args:
        project_id: Project ID (e.g. "p1")

    Returns:
        List of scenarios
    """
    db = get_database()
    query = """
        SELECT
            scenario_id as id,
            project_id,
            scenario_name as name,
            scenario_date as date,
            scenario_order,
            expected_worker_count
        FROM scenarios
        WHERE project_id = ?
        ORDER BY scenario_order
    """
    return db.execute_query(query, (project_id,))


def get_scenario_by_id(scenario_id: str) -> Dict[str, Any] | None:
    """
    Get a single scenario by ID.

    Args:
        scenario_id: Scenario ID (e.g. "g1")

    Returns:
        Scenario dictionary or None if not found
    """
    db = get_database()
    query = """
        SELECT
            scenario_id as id,
            project_id,
            scenario_name as name,
            scenario_date as date,
            scenario_order,
            expected_worker_count
        FROM scenarios
        WHERE scenario_id = ?
    """
    return db.execute_one(query, (scenario_id,))


def get_hazard_responses_by_scenario(scenario_id: str) -> List[Dict[str, Any]]:
    """
    Get all hazard responses for a scenario.

    Args:
        scenario_id: Scenario ID (e.g. "g1")

    Returns:
        List of hazard responses
    """
    db = get_database()
    query = """
        SELECT
            scenario_id,
            project_id,
            worker_id,
            worker_name,
            energy_id,
            identified_correctly,
            marked_high_energy,
            correct_high_energy,
            marked_direct_control,
            correct_direct_control
        FROM hazard_responses
        WHERE scenario_id = ?
        ORDER BY worker_id, energy_id
    """
    return db.execute_query(query, (scenario_id,))


def get_workers_by_project(project_id: str) -> List[Dict[str, Any]]:
    """
    Get all unique workers for a project.

    Args:
        project_id: Project ID (e.g. "p1")

    Returns:
        List of workers
    """
    db = get_database()
    query = """
        SELECT DISTINCT
            worker_id,
            worker_name as name,
            role,
            experience_band
        FROM workers
        WHERE project_id = ?
        ORDER BY worker_id
    """
    return db.execute_query(query, (project_id,))


def get_industry_benchmark() -> List[Dict[str, Any]]:
    """
    Get industry benchmark data.

    Returns:
        List of energy types with benchmark scores
    """
    db = get_database()
    query = """
        SELECT
            energy_id,
            ident_score,
            high_score,
            control_score
        FROM industry_benchmark
        ORDER BY energy_id
    """
    return db.execute_query(query)


def get_all_scenarios() -> List[Dict[str, Any]]:
    """
    Get all scenarios across all projects.

    Returns:
        List of all scenarios
    """
    db = get_database()
    query = """
        SELECT
            scenario_id as id,
            project_id,
            scenario_name as name,
            scenario_date as date,
            scenario_order,
            expected_worker_count
        FROM scenarios
        ORDER BY scenario_order
    """
    return db.execute_query(query)
