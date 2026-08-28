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
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  status: 'active' | 'completed' | 'archived';
  repositoryUrl?: string;
  createdAt: string;
}

export interface Technology {
  id: string;
  name: string;
  category: string;
  description?: string;
  website?: string;
  createdAt: string;
}

export interface JobRole {
  id: string;
  title: string;
  description: string;
  level: 'junior' | 'mid' | 'senior' | 'lead' | 'principal';
  averageSalary?: number;
  createdAt: string;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  size: 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
  location?: string;
  website?: string;
  createdAt: string;
}

export interface SkillGap {
  targetJobRole: string;
  requiredSkill: string;
  skillCategory: string;
  hasRelatedSkill: boolean;
  status: 'Covered (direct or related)' | 'Gap';
}

export interface ProjectRecommendation {
  projectName: string;
  projectDescription: string;
  matchingSkills: number;
  totalRequiredSkills: number;
  matchPercentage: number;
  technologies: string[];
  teamSize: number;
}

export interface DeveloperSkillProjectTech {
  skillName: string;
  projectName: string;
  projectDescription: string;
  technologyName: string;
  technologyCategory: string;
}
