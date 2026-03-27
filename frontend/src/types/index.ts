/**
 * TypeScript types matching the backend API responses
 */

// Authentication
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  manager_id: string;
  username: string;
  full_name: string;
  email?: string;
  company_id: string | null;
  company_name: string;
  role: string;
  title?: string;
  token: string;
  app_access: string;
  subscription_tier: string;
}

export interface UserInfo {
  manager_id: string;
  username: string;
  full_name: string;
  email?: string;
  company_id: string | null;
  company_name: string;
  role: string;
  title?: string;
  app_access: string;
  subscription_tier: string;
}

// Energy Types
export interface EnergyType {
  id: string;
  label: string;
  icon: string;
  color: string;
}

export interface EnergyBreakdown extends EnergyType {
  identScore: number;
  highScore: number;
  controlScore: number;
}

// Projects
export interface Project {
  id: string;
  name: string;
  region: string;
  company_name?: string;
  industry?: string;
}

export interface ProjectOverview {
  project: Project;
  totalScenarios: number;
  totalSessions: number;
  highAccAll: number;
  ctrlAccAll: number;
  ragScore: number;
  energyBreakdown: EnergyBreakdown[];
}

// Scenarios
export interface ScenarioSummary {
  id: string;
  projectId: string;
  name: string;
  date: string;
  workerCount: number;
  avgScore: number;
  energyBreakdown: EnergyBreakdown[];
}

export interface WorkerHazard {
  energyId: string;
  identifiedCorrectly: boolean;
  markedHighEnergy: boolean;
  correctHighEnergy: boolean;
  markedDirectControl: boolean;
  correctDirectControl: boolean;
}

export interface WorkerResult {
  workerId: string;
  name: string;
  score: number;
  hazards: WorkerHazard[];
}

export interface ScenarioDetail {
  id: string;
  projectId: string;
  name: string;
  date: string;
  workers: WorkerResult[];
  energyBreakdown: EnergyBreakdown[];
}

export interface ScenarioComparison {
  scA: ScenarioDetail;
  scB: ScenarioDetail;
  projA: Project;
  projB: Project;
  bdA: EnergyBreakdown[];
  bdB: EnergyBreakdown[];
  avgA: number;
  avgB: number;
}

// Workers
export interface WorkerSummary {
  name: string;
  scenarioCount?: number;
  avgIdent: number;
  avgHigh: number;
  avgControl: number;
}

export interface WorkerTrendPoint {
  scenarioName: string;
  ident: number;
  high: number;
  control: number;
}

export interface WorkerTrend {
  name: string;
  colorIndex: number;
  points: WorkerTrendPoint[];
}

// Comparison
export interface RadarDataset {
  label: string;
  data: number[];
  borderColor: string;
  backgroundColor: string;
  borderWidth: number;
  pointBackgroundColor: string;
  borderDash?: number[];
}

export interface ComparisonProject {
  name: string;
  energyBreakdown: EnergyBreakdown[];
}

export interface IndustryBenchmark {
  energyBreakdown: EnergyBreakdown[];
}
