import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import { RecommendationService } from '../services';

export class RecommendationController extends BaseController {
  private recommendationService: RecommendationService;

  constructor() {
    super();
    this.recommendationService = new RecommendationService();
  }

  async getSkillProjectTech(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const data = await this.recommendationService.getDeveloperSkillProjectTech(id);
      this.sendSuccess(res, data);
    } catch (error) {
      this.sendError(res, error as Error);
    }
  }

  async getTechnologyUsageStats(req: Request, res: Response): Promise<void> {
    try {
      const data = await this.recommendationService.getTechnologyUsageStats();
      this.sendSuccess(res, data);
    } catch (error) {
      this.sendError(res, error as Error);
    }
  }

  async getCompanySkillDistribution(req: Request, res: Response): Promise<void> {
    try {
      const data = await this.recommendationService.getCompanySkillDistribution();
      this.sendSuccess(res, data);
    } catch (error) {
      this.sendError(res, error as Error);
    }
  }
}
