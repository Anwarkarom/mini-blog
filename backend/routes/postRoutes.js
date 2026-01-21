const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
    getAllPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
    likePost,
    addComment,
    getUserPosts,
    getLikedPosts
} = require('../controllers/postController');

// Public routes
router.get('/', getAllPosts);
router.get('/user/my-posts', authMiddleware, getUserPosts);
router.get('/user/liked-posts', authMiddleware, getLikedPosts);
router.get('/:id', getPostById);

// Protected routes
router.post('/', authMiddleware, createPost);
router.put('/:id', authMiddleware, updatePost);
router.delete('/:id', authMiddleware, deletePost);
router.post('/:id/like', authMiddleware, likePost);
router.post('/:id/comment', authMiddleware, addComment);

module.exports = router;
