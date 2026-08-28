import { ApiResponse, Developer, Skill, Project, JobRole, SkillGap, ProjectRecommendation, MultiHopResult } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

async function fetchApi<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`);
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }
  const json: ApiResponse<T> = await res.json();
  if (!json.success) {
    throw new Error(json.error || "Unknown error");
  }
  return json.data;
}

export const api = {
  health: () => fetchApi<{ status: string; database: string }>("/api/health"),

  getDevelopers: (q?: string) =>
    fetchApi<Developer[]>(`/api/developers${q ? `?q=${encodeURIComponent(q)}` : ""}`),
  getDeveloper: (id: string) => fetchApi<{ developer: Developer; skills: Skill[]; projects: Project[]; targetRoles: JobRole[]; companies: { id: string; name: string }[] }>(`/api/developers/${id}`),
  getDeveloperSkills: (id: string) => fetchApi<Skill[]>(`/api/developers/${id}/skills`),
  getDeveloperProjects: (id: string) => fetchApi<Project[]>(`/api/developers/${id}/projects`),
  getDeveloperRecommendations: (id: string) =>
    fetchApi<ProjectRecommendation[]>(`/api/developers/${id}/recommendations`),
  getSkillGap: (devId: string, roleId: string) =>
    fetchApi<SkillGap[]>(`/api/developers/${devId}/skill-gap/${roleId}`),

  getSkills: (q?: string) =>
    fetchApi<Skill[]>(`/api/skills${q ? `?q=${encodeURIComponent(q)}` : ""}`),
  getSkill: (id: string) => fetchApi<Skill>(`/api/skills/${id}`),
  getRelatedSkills: (id: string) => fetchApi<Skill[]>(`/api/skills/${id}/related`),

  getProjects: (q?: string) =>
    fetchApi<Project[]>(`/api/projects${q ? `?q=${encodeURIComponent(q)}` : ""}`),
  getProject: (id: string) => fetchApi<Project>(`/api/projects/${id}`),

  getRoles: (q?: string) =>
    fetchApi<JobRole[]>(`/api/roles${q ? `?q=${encodeURIComponent(q)}` : ""}`),
  getRole: (id: string) => fetchApi<JobRole>(`/api/roles/${id}`),
  getRoleSkills: (id: string) => fetchApi<Skill[]>(`/api/roles/${id}/skills`),

  getMultiHop: (devId: string) =>
    fetchApi<MultiHopResult[]>(`/api/recommendations/developer/${devId}/multi-hop`),
  getTechStats: () => fetchApi<{ technology: string; projectCount: number }[]>("/api/recommendations/technology/stats"),
};
