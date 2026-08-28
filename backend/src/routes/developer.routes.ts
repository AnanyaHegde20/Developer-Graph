import { Router } from 'express';
import { DeveloperController } from '../controllers';

const router = Router();
const controller = new DeveloperController();

// GET /api/developers - List all developers (supports ?q= search)
router.get('/', (req, res) => controller.getAllDevelopers(req, res));

// GET /api/developers/:id - Get developer summary (skills, projects, roles, companies)
router.get('/:id', (req, res) => controller.getDeveloper(req, res));

// GET /api/developers/:id/skills - Get developer skills
router.get('/:id/skills', (req, res) => controller.getDeveloperSkills(req, res));

// GET /api/developers/:id/projects - Get developer projects
router.get('/:id/projects', (req, res) => controller.getDeveloperProjects(req, res));

// GET /api/developers/:id/recommendations - Get project recommendations
router.get('/:id/recommendations', (req, res) => controller.getDeveloperRecommendations(req, res));

// GET /api/developers/:id/skill-gap/:roleId - Get skill gap analysis for a specific role
router.get('/:id/skill-gap/:roleId', (req, res) => controller.getDeveloperSkillGap(req, res));

export default router;
