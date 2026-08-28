import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import { ProjectService } from '../services';

export class ProjectController extends BaseController {
  private projectService: ProjectService;

  constructor() {
    super();
    this.projectService = new ProjectService();
  }

  async getProject(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const project = await this.projectService.getProjectById(id);
      
      if (!project) {
        this.sendNotFound(res, 'Project');
        return;
      }
      
      this.sendSuccess(res, project);
    } catch (error) {
      this.sendError(res, error as Error);
    }
  }

  async getProjectTechnologies(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const technologies = await this.projectService.getProjectTechnologies(id);
      this.sendSuccess(res, technologies);
    } catch (error) {
      this.sendError(res, error as Error);
    }
  }

  async getProjectRequiredSkills(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const skills = await this.projectService.getProjectRequiredSkills(id);
      this.sendSuccess(res, skills);
    } catch (error) {
      this.sendError(res, error as Error);
    }
  }

  async getProjectDevelopers(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const developers = await this.projectService.getProjectDevelopers(id);
      this.sendSuccess(res, developers);
    } catch (error) {
      this.sendError(res, error as Error);
    }
  }

  async getAllProjects(req: Request, res: Response): Promise<void> {
    try {
      const projects = await this.projectService.getAllProjects();
      this.sendSuccess(res, projects);
    } catch (error) {
      this.sendError(res, error as Error);
    }
  }

  async searchProjects(req: Request, res: Response): Promise<void> {
    try {
      const { q } = req.query;
      const searchTerm = q as string;
      
      if (!searchTerm) {
        this.sendError(res, 'Search term is required', 400);
        return;
      }
      
      const projects = await this.projectService.searchProjects(searchTerm);
      this.sendSuccess(res, projects);
    } catch (error) {
      this.sendError(res, error as Error);
    }
  }
}
