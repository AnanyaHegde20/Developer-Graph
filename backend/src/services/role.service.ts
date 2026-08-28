import { DatabaseService } from './database.service';
import * as queries from '../cypher/jobrole.queries';
import { JobRole, Skill } from '../types';

export class RoleService extends DatabaseService {
  async getRoleById(jobRoleId: string): Promise<JobRole | null> {
    const result = await this.runQuery(queries.GET_JOB_ROLE_BY_ID, { jobRoleId });
    return this.extractSingleRecord<JobRole>(result, 'j');
  }

  async getRoleRequiredSkills(jobRoleId: string): Promise<Skill[]> {
    const result = await this.runQuery(queries.GET_JOB_ROLE_REQUIRED_SKILLS, { jobRoleId });
    return this.extractRecords<Skill>(result, 's');
  }

  async getAllRoles(): Promise<JobRole[]> {
    const result = await this.runQuery(queries.GET_ALL_JOB_ROLES);
    return this.extractRecords<JobRole>(result, 'j');
  }

  async searchRoles(searchTerm: string): Promise<JobRole[]> {
    const result = await this.runQuery(queries.SEARCH_JOB_ROLES, { searchTerm });
    return this.extractRecords<JobRole>(result, 'j');
  }
}
