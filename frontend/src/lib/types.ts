export interface Developer {
  id: string;
  name: string;
  email: string;
  bio?: string;
  yearsExperience: number;
  location?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  description?: string;
  difficulty?: string;
  createdAt?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  repositoryUrl?: string;
  createdAt?: string;
}

export interface Technology {
  id: string;
  name: string;
  category: string;
  description?: string;
  website?: string;
}

export interface JobRole {
  id: string;
  title: string;
  description: string;
  level?: string;
  averageSalary?: number;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  size?: string;
  location?: string;
  website?: string;
}

export interface DeveloperSummary {
  developer: Developer;
  skills: Skill[];
  projects: Project[];
  targetRoles: JobRole[];
  companies: Company[];
}

export interface SkillGap {
  skillId: string;
  skillName: string;
  skillCategory: string;
  difficulty?: string;
}

export interface ProjectRecommendation {
  projectId: string;
  projectName: string;
  matchingSkillCount: number;
  matchingSkills: string[];
}

export interface MultiHopResult {
  projectId: string;
  projectName: string;
  projectDescription: string;
  matchingSkills: string[];
  technologies: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}
