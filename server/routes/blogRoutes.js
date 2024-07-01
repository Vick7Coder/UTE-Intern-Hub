import express from 'express';
import userAuth from '../middleware/authMiddleware.js';
import {
    createBlog,
    deleteBlogPost,
    getBlogById,
    getBlogPosts,
    updateBlog,
} from '../controller/BlogController.js';

const router = express.Router();

// POST BLOG
router.post('/upload-blog', userAuth, createBlog);

// UPDATE BLOG
router.put('/update-blog/:blogId', userAuth, updateBlog);

// GET BLOG POSTS
router.get('/find-blogs', getBlogPosts);
router.get('/get-blog-detail/:id', getBlogById);

// DELETE BLOG POST
router.delete('/delete-blog/:blogId', userAuth, deleteBlogPost);

export default router;
