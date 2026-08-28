import { DatabaseService } from './database.service';
import * as queries from '../cypher/skill.queries';
import { Skill } from '../types';

export class SkillService extends DatabaseService {
  async getSkillById(skillId: string): Promise<Skill | null> {
    const result = await this.runQuery(queries.GET_SKILL_BY_ID, { skillId });
    return this.extractSingleRecord<Skill>(result, 's');
  }

  async getRelatedSkills(skillId: string): Promise<Skill[]> {
    const result = await this.runQuery(queries.GET_RELATED_SKILLS, { skillId });
    return this.extractRecords<Skill>(result, 'related');
  }

  async getAllSkills(): Promise<Skill[]> {
    const result = await this.runQuery(queries.GET_ALL_SKILLS);
    return this.extractRecords<Skill>(result, 's');
  }

  async searchSkills(searchTerm: string): Promise<Skill[]> {
    const result = await this.runQuery(queries.SEARCH_SKILLS, { searchTerm });
    return this.extractRecords<Skill>(result, 's');
  }

  async getSkillsByCategory(category: string): Promise<Skill[]> {
    const result = await this.runQuery(queries.GET_SKILLS_BY_CATEGORY, { category });
    return this.extractRecords<Skill>(result, 's');
  }
}
