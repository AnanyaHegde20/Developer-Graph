import { Router } from 'express';
import { RecommendationController } from '../controllers';

const router = Router();
const controller = new RecommendationController();

// GET /api/recommendations/developer/:id/multi-hop - Multi-hop traversal
router.get('/developer/:id/multi-hop', (req, res) => controller.getSkillProjectTech(req, res));

// GET /api/recommendations/technology/stats - Technology usage statistics
router.get('/technology/stats', (req, res) => controller.getTechnologyUsageStats(req, res));

// GET /api/recommendations/company/skill-distribution - Company skill distribution
router.get('/company/skill-distribution', (req, res) => controller.getCompanySkillDistribution(req, res));

export default router;
