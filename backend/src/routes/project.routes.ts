import { Router } from 'express';
import { ProjectController } from '../controllers';

const router = Router();
const controller = new ProjectController();

// GET /api/projects - List all projects (supports ?q= search)
router.get('/', (req, res) => controller.getAllProjects(req, res));

// GET /api/projects/:id - Get project by ID
router.get('/:id', (req, res) => controller.getProject(req, res));

export default router;
