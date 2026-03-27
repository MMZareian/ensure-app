"""
Database query functions.

This module contains all SQL queries needed by the API endpoints.
"""
from typing import List, Dict, Any, Optional
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


def get_all_projects(company_id: str = None) -> List[Dict[str, Any]]:
    """
    Get all projects, optionally filtered by company.

    Args:
        company_id: Optional company ID to filter by

    Returns:
        List of projects with id, name, region, company_name, industry, company_id
    """
    db = get_database()
    if company_id:
        query = """
            SELECT id, name, region, company_name, industry, company_id
            FROM projects
            WHERE company_id = ?
            ORDER BY id
        """
        return db.execute_query(query, (company_id,))
    else:
        query = """
            SELECT id, name, region, company_name, industry, company_id
            FROM projects
            ORDER BY id
        """
        return db.execute_query(query)


def get_project_by_id(project_id: str) -> Optional[Dict[str, Any]]:
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


def get_scenario_by_id(scenario_id: str) -> Optional[Dict[str, Any]]:
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
    Get industry benchmark data calculated as average of scenario averages.

    This ensures each scenario has equal weight regardless of number of workers.
    Calculation: For each energy type, calculate average per scenario,
                 then average those scenario averages.

    Returns:
        List of energy types with benchmark scores
    """
    db = get_database()
    query = """
        WITH scenario_averages AS (
            SELECT
                hr.energy_id,
                hr.scenario_id,
                AVG(CAST(hr.identified_correctly AS FLOAT)) * 100 as scenario_ident_score,
                AVG(CASE
                    WHEN hr.identified_correctly = 1 THEN CAST(hr.correct_high_energy AS FLOAT)
                END) * 100 as scenario_high_score,
                AVG(CASE
                    WHEN hr.identified_correctly = 1 THEN CAST(hr.correct_direct_control AS FLOAT)
                END) * 100 as scenario_control_score
            FROM hazard_responses hr
            GROUP BY hr.energy_id, hr.scenario_id
        )
        SELECT
            energy_id,
            AVG(scenario_ident_score) as ident_score,
            AVG(scenario_high_score) as high_score,
            AVG(scenario_control_score) as control_score
        FROM scenario_averages
        GROUP BY energy_id
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
