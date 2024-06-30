import express from 'express'

import seekerRoutes from './seekerRoutes.js'
import recruiterRoutes from './recruiterRoutes.js'
import jobRoutes from './jobRoutes.js'
import tokenRoute from './tokenRoute.js'
import blogRoutes from './blogRoutes.js'
import adminRoute from './adminRoutes.js'

const router = express.Router();

const path = '/api/';

router.use(`${path}user`, seekerRoutes);
router.use(`${path}companies`, recruiterRoutes);
router.use(`${path}jobs`, jobRoutes);
router.use(`${path}token`, tokenRoute);
router.use(`${path}blogs`, blogRoutes);
router.use(`${path}admin`, adminRoute);


export default router;