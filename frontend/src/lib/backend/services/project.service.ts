import { DatabaseService } from './database.service';
import * as queries from '@/lib/backend/cypher/project.queries';
import { Project, Technology, Skill, Developer } from '@/lib/backend/types';

export class ProjectService extends DatabaseService {
  async getProjectById(projectId: string): Promise<Project | null> {
    const result = await this.runQuery(queries.GET_PROJECT_BY_ID, { projectId });
    return this.extractSingleRecord<Project>(result, 'p');
  }

  async getProjectTechnologies(projectId: string): Promise<Technology[]> {
    const result = await this.runQuery(queries.GET_PROJECT_TECHNOLOGIES, { projectId });
    return this.extractRecords<Technology>(result, 't');
  }

  async getProjectRequiredSkills(projectId: string): Promise<Skill[]> {
    const result = await this.runQuery(queries.GET_PROJECT_REQUIRED_SKILLS, { projectId });
    return this.extractRecords<Skill>(result, 's');
  }

  async getProjectDevelopers(projectId: string): Promise<Developer[]> {
    const result = await this.runQuery(queries.GET_PROJECT_DEVELOPERS, { projectId });
    return this.extractRecords<Developer>(result, 'd');
  }

  async getAllProjects(): Promise<Project[]> {
    const result = await this.runQuery(queries.GET_ALL_PROJECTS);
    return this.extractRecords<Project>(result, 'p');
  }

  async searchProjects(searchTerm: string): Promise<Project[]> {
    const result = await this.runQuery(queries.SEARCH_PROJECTS, { searchTerm });
    return this.extractRecords<Project>(result, 'p');
  }
}
