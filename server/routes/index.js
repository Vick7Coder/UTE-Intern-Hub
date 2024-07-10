import express from 'express'

import seekerRoutes from './seekerRoutes.js'
import recruiterRoutes from './recruiterRoutes.js'
import jobRoutes from './jobRoutes.js'
import tokenRoute from './tokenRoute.js'
import insightRoutes from './insightRoutes.js'
import adminRoute from './adminRoutes.js'
import lecturerRoute from './LectureRoutes.js'

const router = express.Router();

const path = '/api/';

router.use(`${path}user`, seekerRoutes);
router.use(`${path}companies`, recruiterRoutes);
router.use(`${path}jobs`, jobRoutes);
router.use(`${path}token`, tokenRoute);
router.use(`${path}insights`, insightRoutes);
router.use(`${path}admin`, adminRoute);
router.use(`${path}lecturer`, lecturerRoute);


export default router;