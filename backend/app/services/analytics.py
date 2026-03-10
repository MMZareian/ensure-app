"""
Analytics calculations matching the prototype logic.

This module contains all the calculation functions that the prototype
currently does in JavaScript. We're moving them to the backend so the
frontend just displays data.
"""
from typing import List, Dict, Any


def calculate_energy_breakdown(hazard_responses: List[Dict[str, Any]]) -> Dict[str, Dict[str, int]]:
    """
    Calculate energy breakdown from hazard responses.

    This matches the energyBreakdown() function from the prototype.

    Args:
        hazard_responses: List of hazard response records with fields:
            - energy_id
            - identified_correctly (0 or 1)
            - marked_high_energy (0 or 1)
            - correct_high_energy (0 or 1)
            - marked_direct_control (0 or 1)
            - correct_direct_control (0 or 1)

    Returns:
        Dictionary mapping energy_id to scores:
        {
            "gravity": {"identScore": 75, "highScore": 68, "controlScore": 72},
            "motion": {"identScore": 82, ...},
            ...
        }
    """
    # Initialize result dictionary
    result = {}

    # Group responses by energy type
    for response in hazard_responses:
        energy_id = response['energy_id']

        if energy_id not in result:
            result[energy_id] = {
                'correct': 0,
                'total': 0,
                'highAcc': 0,
                'ctrlAcc': 0
            }

        result[energy_id]['total'] += 1

        # Count correct identification
        if response['identified_correctly'] == 1:
            result[energy_id]['correct'] += 1

        # Count high energy accuracy
        if response['marked_high_energy'] == response['correct_high_energy']:
            result[energy_id]['highAcc'] += 1

        # Count direct control accuracy
        if response['marked_direct_control'] == response['correct_direct_control']:
            result[energy_id]['ctrlAcc'] += 1

    # Calculate percentages
    scores = {}
    for energy_id, counts in result.items():
        if counts['total'] > 0:
            scores[energy_id] = {
                'identScore': round(counts['correct'] / counts['total'] * 100),
                'highScore': round(counts['highAcc'] / counts['total'] * 100),
                'controlScore': round(counts['ctrlAcc'] / counts['total'] * 100),
            }
        else:
            scores[energy_id] = {
                'identScore': 0,
                'highScore': 0,
                'controlScore': 0,
            }

    return scores


def calculate_worker_score(worker_hazards: List[Dict[str, Any]]) -> int:
    """
    Calculate a single worker's identification score.

    Args:
        worker_hazards: List of hazard responses for one worker

    Returns:
        Score as percentage (0-100)
    """
    if not worker_hazards:
        return 0

    correct = sum(1 for h in worker_hazards if h['identified_correctly'] == 1)
    total = len(worker_hazards)

    return round(correct / total * 100) if total > 0 else 0


def calculate_worker_high_score(worker_hazards: List[Dict[str, Any]]) -> int:
    """
    Calculate worker's high energy classification accuracy.

    Args:
        worker_hazards: List of hazard responses for one worker

    Returns:
        Score as percentage (0-100)
    """
    if not worker_hazards:
        return 0

    correct = sum(
        1 for h in worker_hazards
        if h['marked_high_energy'] == h['correct_high_energy']
    )
    total = len(worker_hazards)

    return round(correct / total * 100) if total > 0 else 0


def calculate_worker_control_score(worker_hazards: List[Dict[str, Any]]) -> int:
    """
    Calculate worker's direct control classification accuracy.

    Args:
        worker_hazards: List of hazard responses for one worker

    Returns:
        Score as percentage (0-100)
    """
    if not worker_hazards:
        return 0

    correct = sum(
        1 for h in worker_hazards
        if h['marked_direct_control'] == h['correct_direct_control']
    )
    total = len(worker_hazards)

    return round(correct / total * 100) if total > 0 else 0


def get_rag_status(score: int) -> str:
    """
    Get RAG (Red/Amber/Green) status from score.

    Args:
        score: Score percentage (0-100)

    Returns:
        "green", "amber", or "red"
    """
    if score >= 75:
        return "green"
    elif score >= 60:
        return "amber"
    else:
        return "red"
