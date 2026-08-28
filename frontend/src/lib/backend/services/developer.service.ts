import { DatabaseService } from './database.service';
import * as queries from '@/lib/backend/cypher/developer.queries';
import { Developer, Skill, Project, Company, JobRole } from '@/lib/backend/types';

export class DeveloperService extends DatabaseService {
  async getDeveloperById(developerId: string): Promise<Developer | null> {
    const result = await this.runQuery(queries.GET_DEVELOPER_BY_ID, { developerId });
    return this.extractSingleRecord<Developer>(result, 'd');
  }

  async getDeveloperSkills(developerId: string): Promise<Skill[]> {
    const result = await this.runQuery(queries.GET_DEVELOPER_SKILLS, { developerId });
    return this.extractRecords<Skill>(result, 's');
  }

  async getDeveloperProjects(developerId: string): Promise<Project[]> {
    const result = await this.runQuery(queries.GET_DEVELOPER_PROJECTS, { developerId });
    return this.extractRecords<Project>(result, 'p');
  }

  async getDeveloperCompanies(developerId: string): Promise<Company[]> {
    const result = await this.runQuery(queries.GET_DEVELOPER_COMPANIES, { developerId });
    return this.extractRecords<Company>(result, 'c');
  }

  async getDeveloperJobTargets(developerId: string): Promise<JobRole[]> {
    const result = await this.runQuery(queries.GET_DEVELOPER_JOB_TARGETS, { developerId });
    return this.extractRecords<JobRole>(result, 'j');
  }

  async getDeveloperSummary(developerId: string): Promise<any | null> {
    const result = await this.runQuery(queries.GET_DEVELOPER_SUMMARY, { developerId });
    if (result.records.length === 0) {
      return null;
    }
    const record = result.records[0];
    return {
      developer: record.get('d').properties,
      skills: record.get('skills').map((n: any) => n.properties),
      projects: record.get('projects').map((n: any) => n.properties),
      targetRoles: record.get('targetRoles').map((n: any) => n.properties),
      companies: record.get('companies').map((n: any) => n.properties),
    };
  }

  async getAllDevelopers(): Promise<Developer[]> {
    const result = await this.runQuery(queries.GET_ALL_DEVELOPERS);
    return this.extractRecords<Developer>(result, 'd');
  }

  async searchDevelopers(searchTerm: string): Promise<Developer[]> {
    const result = await this.runQuery(queries.SEARCH_DEVELOPERS, { searchTerm });
    return this.extractRecords<Developer>(result, 'd');
  }
}
