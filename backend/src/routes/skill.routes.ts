import { Router } from 'express';
import { SkillController } from '../controllers';

const router = Router();
const controller = new SkillController();

// GET /api/skills - List all skills (supports ?q= search)
router.get('/', (req, res) => controller.getAllSkills(req, res));

// GET /api/skills/:id - Get skill by ID
router.get('/:id', (req, res) => controller.getSkill(req, res));

// GET /api/skills/:id/related - Get related skills
router.get('/:id/related', (req, res) => controller.getRelatedSkills(req, res));

export default router;
