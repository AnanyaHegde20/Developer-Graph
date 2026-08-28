import { Router } from 'express';
import { RoleController } from '../controllers';

const router = Router();
const controller = new RoleController();

// GET /api/roles - List all job roles (supports ?q= search)
router.get('/', (req, res) => controller.getAllRoles(req, res));

// GET /api/roles/:id - Get job role by ID
router.get('/:id', (req, res) => controller.getRole(req, res));

// GET /api/roles/:id/skills - Get required skills for a role
router.get('/:id/skills', (req, res) => controller.getRoleSkills(req, res));

export default router;
