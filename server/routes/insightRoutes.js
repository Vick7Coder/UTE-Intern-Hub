import express from 'express';
import userAuth from '../middleware/authMiddleware.js';
import {
    createInsight,
    deleteInsightPost,
    getInsightById,
    getInsightPosts,
    updateInsight,
} from '../controller/InsightController.js';

const router = express.Router();

// POST Insight
router.post('/upload-insight', userAuth, createInsight);

// UPDATE Insight
router.put('/update-insight/:insightId', userAuth, updateInsight);

// GET Insight POSTS
router.get('/find-insights', getInsightPosts);
router.get('/get-insight-detail/:id', getInsightById);

// DELETE Insight POST
router.delete('/delete-insight/:insightId', userAuth, deleteInsightPost);

export default router;
