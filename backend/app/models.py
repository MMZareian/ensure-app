"""
Pydantic models for API request/response validation.

These are like TypeScript interfaces - they define the shape of data
that the API sends and receives.
"""
from typing import List, Optional
from pydantic import BaseModel


# ══════════════════════════════════════════════════════════════════════════════
# ENERGY TYPES
# ══════════════════════════════════════════════════════════════════════════════

class EnergyType(BaseModel):
    """Energy type definition"""
    id: str
    label: str
    icon: str
    color: str


class EnergyBreakdown(BaseModel):
    """Energy type with calculated scores"""
    id: str
    label: str
    icon: str
    color: str
    identScore: int
    highScore: int
    controlScore: int


# ══════════════════════════════════════════════════════════════════════════════
# PROJECTS
# ══════════════════════════════════════════════════════════════════════════════

class Project(BaseModel):
    """Basic project info"""
    id: str
    name: str
    region: str
    company_name: Optional[str] = None
    industry: Optional[str] = None


class ProjectOverview(BaseModel):
    """Complete project overview for Overview tab"""
    project: Project
    totalScenarios: int
    totalSessions: int
    highAccAll: int
    ctrlAccAll: int
    ragScore: int
    energyBreakdown: List[EnergyBreakdown]


# ══════════════════════════════════════════════════════════════════════════════
# SCENARIOS
# ══════════════════════════════════════════════════════════════════════════════

class ScenarioSummary(BaseModel):
    """Scenario summary for scenario list"""
    id: str
    projectId: str
    name: str
    date: str
    workerCount: int
    avgScore: int
    energyBreakdown: List[EnergyBreakdown]


class WorkerHazard(BaseModel):
    """Single hazard response"""
    energyId: str
    identifiedCorrectly: bool
    markedHighEnergy: bool
    correctHighEnergy: bool
    markedDirectControl: bool
    correctDirectControl: bool


class WorkerResult(BaseModel):
    """Worker result in a scenario"""
    workerId: str
    name: str
    score: int
    hazards: List[WorkerHazard]


class ScenarioDetail(BaseModel):
    """Full scenario detail for Scenario Detail view"""
    id: str
    projectId: str
    name: str
    date: str
    workers: List[WorkerResult]
    energyBreakdown: List[EnergyBreakdown]


class ScenarioComparison(BaseModel):
    """Comparison between two scenarios"""
    scA: ScenarioDetail
    scB: ScenarioDetail
    projA: Project
    projB: Project
    bdA: List[EnergyBreakdown]
    bdB: List[EnergyBreakdown]
    avgA: int
    avgB: int


# ══════════════════════════════════════════════════════════════════════════════
# WORKERS
# ══════════════════════════════════════════════════════════════════════════════

class WorkerSummary(BaseModel):
    """Worker summary row"""
    name: str
    scenarioCount: Optional[int] = None
    avgIdent: int
    avgHigh: int
    avgControl: int


class WorkerTrendPoint(BaseModel):
    """Single data point in worker trend"""
    scenarioName: str
    ident: int
    high: int
    control: int


class WorkerTrend(BaseModel):
    """Worker trend data for Workers tab"""
    name: str
    colorIndex: int
    points: List[WorkerTrendPoint]


# ══════════════════════════════════════════════════════════════════════════════
# COMPARISON
# ══════════════════════════════════════════════════════════════════════════════

class RadarDataset(BaseModel):
    """Single dataset for radar chart"""
    label: str
    data: List[int]
    borderColor: str
    backgroundColor: str
    borderWidth: int
    pointBackgroundColor: str
    borderDash: Optional[List[int]] = None


class ComparisonRadar(BaseModel):
    """Radar chart data for Comparison tab"""
    labels: List[str]
    datasets: List[RadarDataset]


class ComparisonTableRow(BaseModel):
    """Single row in comparison table"""
    energyId: str
    energyLabel: str
    energyIcon: str
    projects: List[EnergyBreakdown]


# ══════════════════════════════════════════════════════════════════════════════
# INDUSTRY BENCHMARK
# ══════════════════════════════════════════════════════════════════════════════

class IndustryBenchmark(BaseModel):
    """Industry benchmark data"""
    energyBreakdown: List[EnergyBreakdown]
