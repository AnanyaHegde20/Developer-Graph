import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import { RoleService } from '../services';

export class RoleController extends BaseController {
  private roleService: RoleService;

  constructor() {
    super();
    this.roleService = new RoleService();
  }

  async getAllRoles(req: Request, res: Response): Promise<void> {
    try {
      const { q } = req.query;
      if (q) {
        const roles = await this.roleService.searchRoles(q as string);
        this.sendSuccess(res, roles);
      } else {
        const roles = await this.roleService.getAllRoles();
        this.sendSuccess(res, roles);
      }
    } catch (error) {
      this.sendError(res, error as Error);
    }
  }

  async getRole(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const role = await this.roleService.getRoleById(id);

      if (!role) {
        this.sendNotFound(res, 'Job role');
        return;
      }

      this.sendSuccess(res, role);
    } catch (error) {
      this.sendError(res, error as Error);
    }
  }

  async getRoleSkills(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const skills = await this.roleService.getRoleRequiredSkills(id);
      this.sendSuccess(res, skills);
    } catch (error) {
      this.sendError(res, error as Error);
    }
  }
}
