const Post = require('../models/Post');

// Get all posts
exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('author', 'username email avatar')
            .populate('comments.user', 'username')
            .sort({ createdAt: -1 });

        res.json({ posts });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get single post by ID
exports.getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('author', 'username email avatar')
            .populate('comments.user', 'username');

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        res.json({ post });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Create new post (protected)
exports.createPost = async (req, res) => {
    try {
        const { title, content, image } = req.body;

        const newPost = new Post({
            title,
            content,
            image,
            author: req.user.userId
        });

        await newPost.save();
        await newPost.populate('author', 'username email avatar');

        res.status(201).json({
            message: "Post created successfully",
            post: newPost
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Update post (protected)
exports.updatePost = async (req, res) => {
    try {
        const { title, content, image } = req.body;
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Check if user is the author
        if (post.author.toString() !== req.user.userId) {
            return res.status(403).json({ message: "Not authorized to update this post" });
        }

        post.title = title || post.title;
        post.content = content || post.content;
        if (typeof image === 'string') {
            post.image = image;
        }

        await post.save();
        await post.populate('author', 'username email avatar');

        res.json({
            message: "Post updated successfully",
            post
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Delete post (protected)
exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Check if user is the author
        if (post.author.toString() !== req.user.userId) {
            return res.status(403).json({ message: "Not authorized to delete this post" });
        }

        await Post.findByIdAndDelete(req.params.id);

        res.json({ message: "Post deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Like/Unlike post (protected)
exports.likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const userId = req.user.userId;
        const likeIndex = post.likes.indexOf(userId);

        if (likeIndex === -1) {
            // User hasn't liked the post, add like
            post.likes.push(userId);
        } else {
            // User already liked, remove like
            post.likes.splice(likeIndex, 1);
        }

        await post.save();

        res.json({
            message: likeIndex === -1 ? "Post liked" : "Post unliked",
            likes: post.likes.length
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Add comment to post (protected)
exports.addComment = async (req, res) => {
    try {
        const { text } = req.body;
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const newComment = {
            user: req.user.userId,
            text
        };

        post.comments.push(newComment);
        await post.save();
        await post.populate('comments.user', 'username');

        res.status(201).json({
            message: "Comment added successfully",
            comment: post.comments[post.comments.length - 1]
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get user's own posts
exports.getUserPosts = async (req, res) => {
    try {
        const posts = await Post.find({ author: req.user.userId })
            .populate('author', 'username email avatar')
            .sort({ createdAt: -1 });

        res.json({ posts });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get posts liked by user
exports.getLikedPosts = async (req, res) => {
    try {
        const posts = await Post.find({ likes: req.user.userId })
            .populate('author', 'username email avatar')
            .sort({ createdAt: -1 });

        res.json({ posts });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
