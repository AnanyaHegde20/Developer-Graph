import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import { SkillService } from '../services';

export class SkillController extends BaseController {
  private skillService: SkillService;

  constructor() {
    super();
    this.skillService = new SkillService();
  }

  async getSkill(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const skill = await this.skillService.getSkillById(id);
      
      if (!skill) {
        this.sendNotFound(res, 'Skill');
        return;
      }
      
      this.sendSuccess(res, skill);
    } catch (error) {
      this.sendError(res, error as Error);
    }
  }

  async getRelatedSkills(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const skills = await this.skillService.getRelatedSkills(id);
      this.sendSuccess(res, skills);
    } catch (error) {
      this.sendError(res, error as Error);
    }
  }

  async getAllSkills(req: Request, res: Response): Promise<void> {
    try {
      const skills = await this.skillService.getAllSkills();
      this.sendSuccess(res, skills);
    } catch (error) {
      this.sendError(res, error as Error);
    }
  }

  async searchSkills(req: Request, res: Response): Promise<void> {
    try {
      const { q } = req.query;
      const searchTerm = q as string;
      
      if (!searchTerm) {
        this.sendError(res, 'Search term is required', 400);
        return;
      }
      
      const skills = await this.skillService.searchSkills(searchTerm);
      this.sendSuccess(res, skills);
    } catch (error) {
      this.sendError(res, error as Error);
    }
  }

  async getSkillsByCategory(req: Request, res: Response): Promise<void> {
    try {
      const { category } = req.params;
      const skills = await this.skillService.getSkillsByCategory(category);
      this.sendSuccess(res, skills);
    } catch (error) {
      this.sendError(res, error as Error);
    }
  }
}
