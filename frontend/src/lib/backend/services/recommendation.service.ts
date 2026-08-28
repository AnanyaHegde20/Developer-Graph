import { DatabaseService } from './database.service';
import * as queries from '@/lib/backend/cypher/recommendation.queries';

const toNum = (val: any): number => (typeof val === 'number' ? val : val.toNumber());

export class RecommendationService extends DatabaseService {
  async getDeveloperSkillProjectTech(developerId: string): Promise<any[]> {
    const result = await this.runQuery(queries.DEVELOPER_SKILL_PROJECT_TECHNOLOGY, { developerId });
    return result.records.map((record: any) => ({
      projectId: record.get('projectId'),
      projectName: record.get('projectName'),
      projectDescription: record.get('projectDescription'),
      matchingSkills: record.get('matchingSkills'),
      technologies: record.get('technologies'),
    }));
  }

  async getSkillGapAnalysis(developerId: string, roleId: string): Promise<any[]> {
    const devResult = await this.runQuery(queries.GET_DEVELOPER_SKILL_IDS, { developerId });
    const devSkillIds = new Set(devResult.records.map((r: any) => r.get('skillId')));

    const roleResult = await this.runQuery(queries.GET_ROLE_REQUIRED_SKILLS, { roleId });
    const requiredSkills = roleResult.records.map((r: any) => ({
      skillId: r.get('skillId'),
      skillName: r.get('skillName'),
      skillCategory: r.get('skillCategory'),
      difficulty: r.get('difficulty'),
    }));

    return requiredSkills.filter((skill: any) => !devSkillIds.has(skill.skillId));
  }

  async getProjectRecommendations(developerId: string): Promise<any[]> {
    const result = await this.runQuery(queries.PROJECT_RECOMMENDATIONS, { developerId });
    return result.records.map((record: any) => ({
      projectId: record.get('projectId'),
      projectName: record.get('projectName'),
      matchingSkillCount: toNum(record.get('matchingSkillCount')),
      matchingSkills: record.get('matchingSkills'),
    }));
  }

  async getTechnologyUsageStats(): Promise<any[]> {
    const result = await this.runQuery(queries.TECHNOLOGY_USAGE_STATS);
    return result.records.map((record: any) => ({
      technologyName: record.get('technologyName'),
      category: record.get('category'),
      projectCount: toNum(record.get('projectCount')),
      developerCount: toNum(record.get('developerCount')),
    }));
  }

  async getCompanySkillDistribution(): Promise<any[]> {
    const result = await this.runQuery(queries.COMPANY_SKILL_DISTRIBUTION);
    return result.records.map((record: any) => ({
      companyName: record.get('companyName'),
      skillName: record.get('skillName'),
      skillCategory: record.get('skillCategory'),
      developerCount: toNum(record.get('developerCount')),
    }));
  }
}
