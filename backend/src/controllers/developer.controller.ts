import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import { DeveloperService, RecommendationService } from '../services';

export class DeveloperController extends BaseController {
  private developerService: DeveloperService;
  private recommendationService: RecommendationService;

  constructor() {
    super();
    this.developerService = new DeveloperService();
    this.recommendationService = new RecommendationService();
  }

  async getAllDevelopers(req: Request, res: Response): Promise<void> {
    try {
      const { q } = req.query;
      if (q) {
        const developers = await this.developerService.searchDevelopers(q as string);
        this.sendSuccess(res, developers);
      } else {
        const developers = await this.developerService.getAllDevelopers();
        this.sendSuccess(res, developers);
      }
    } catch (error) {
      this.sendError(res, error as Error);
    }
  }

  async getDeveloper(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const summary = await this.developerService.getDeveloperSummary(id);

      if (!summary) {
        this.sendNotFound(res, 'Developer');
        return;
      }

      this.sendSuccess(res, summary);
    } catch (error) {
      this.sendError(res, error as Error);
    }
  }

  async getDeveloperSkills(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const skills = await this.developerService.getDeveloperSkills(id);
      this.sendSuccess(res, skills);
    } catch (error) {
      this.sendError(res, error as Error);
    }
  }

  async getDeveloperProjects(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const projects = await this.developerService.getDeveloperProjects(id);
      this.sendSuccess(res, projects);
    } catch (error) {
      this.sendError(res, error as Error);
    }
  }

  async getDeveloperRecommendations(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const recommendations = await this.recommendationService.getProjectRecommendations(id);
      this.sendSuccess(res, recommendations);
    } catch (error) {
      this.sendError(res, error as Error);
    }
  }

  async getDeveloperSkillGap(req: Request, res: Response): Promise<void> {
    try {
      const { id, roleId } = req.params;
      const skillGap = await this.recommendationService.getSkillGapAnalysis(id, roleId);
      this.sendSuccess(res, skillGap);
    } catch (error) {
      this.sendError(res, error as Error);
    }
  }
}
