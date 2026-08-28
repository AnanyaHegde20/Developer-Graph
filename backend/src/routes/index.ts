import { Router } from 'express';
import developerRoutes from './developer.routes';
import skillRoutes from './skill.routes';
import projectRoutes from './project.routes';
import roleRoutes from './role.routes';
import recommendationRoutes from './recommendation.routes';

const router = Router();

router.use('/developers', developerRoutes);
router.use('/skills', skillRoutes);
router.use('/projects', projectRoutes);
router.use('/roles', roleRoutes);
router.use('/recommendations', recommendationRoutes);

export default router;
