/**
 * API Client for communicating with the FastAPI backend
 */

import type {
  LoginCredentials,
  LoginResponse,
  UserInfo,
  Project,
  ProjectOverview,
  ScenarioSummary,
  ScenarioDetail,
  ScenarioComparison,
  WorkerSummary,
  WorkerTrend,
  ComparisonProject,
  IndustryBenchmark,
  RadarDataset,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '';

/**
 * Generic fetch wrapper with error handling
 */
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: response.statusText }));
    throw new Error(error.detail || `API Error: ${response.status}`);
  }

  return response.json();
}

/**
 * Authentication API
 */
export const authAPI = {
  /**
   * Login with username and password
   */
  login: (credentials: LoginCredentials) =>
    fetchAPI<LoginResponse>('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    }),

  /**
   * Logout (clear session)
   */
  logout: () =>
    fetchAPI<{ success: boolean; message: string }>('/api/auth/logout', {
      method: 'POST',
    }),

  /**
   * Get current user info
   */
  me: (token: string) =>
    fetchAPI<UserInfo>(`/api/auth/me?token=${token}`),
};

/**
 * Projects API
 */
export const projectsAPI = {
  /**
   * Get all projects, optionally filtered by company
   */
  getAll: (companyId?: string) => {
    const url = companyId ? `/api/projects?company_id=${companyId}` : '/api/projects';
    return fetchAPI<Project[]>(url);
  },

  /**
   * Get project overview for Overview tab
   */
  getOverview: (projectId: string) =>
    fetchAPI<ProjectOverview>(`/api/projects/${projectId}/overview`),

  /**
   * Get scenarios for a project
   */
  getScenarios: (projectId: string) =>
    fetchAPI<ScenarioSummary[]>(`/api/projects/${projectId}/scenarios`),
};

/**
 * Scenarios API
 */
export const scenariosAPI = {
  /**
   * Get detailed scenario data
   */
  getDetail: (scenarioId: string) =>
    fetchAPI<ScenarioDetail>(`/api/scenarios/${scenarioId}`),

  /**
   * Compare two scenarios
   */
  compare: (scenarioA: string, scenarioB: string) =>
    fetchAPI<ScenarioComparison>(
      `/api/scenarios/compare?scenario_a=${scenarioA}&scenario_b=${scenarioB}`
    ),
};

/**
 * Workers API
 */
export const workersAPI = {
  /**
   * Get worker summary table
   */
  getSummary: (projectId: string, scenarioId: string = 'all') =>
    fetchAPI<WorkerSummary[]>(
      `/api/workers/summary?project_id=${projectId}&scenario_id=${scenarioId}`
    ),

  /**
   * Get worker trends for a project
   */
  getTrends: (projectId: string) =>
    fetchAPI<WorkerTrend[]>(`/api/workers/trends?project_id=${projectId}`),
};

/**
 * Comparison API
 */
export const comparisonAPI = {
  /**
   * Get radar chart data for project comparison
   */
  getRadarData: (
    projectIds: string[],
    mode: 'ident' | 'high' | 'control',
    includeIndustry: boolean = false
  ) => {
    const params = new URLSearchParams({
      project_ids: projectIds.join(','),
      mode,
      include_industry: includeIndustry.toString(),
    });
    return fetchAPI<{ labels: string[]; datasets: RadarDataset[] }>(
      `/api/comparison/projects?${params}`
    );
  },

  /**
   * Get comparison table data
   */
  getTableData: (projectIds: string[], includeIndustry: boolean = false) => {
    const params = new URLSearchParams({
      project_ids: projectIds.join(','),
      include_industry: includeIndustry.toString(),
    });
    return fetchAPI<ComparisonProject[]>(`/api/comparison/table?${params}`);
  },

  /**
   * Get industry benchmark
   */
  getIndustryBenchmark: () =>
    fetchAPI<IndustryBenchmark>('/api/industry/benchmark'),
};
