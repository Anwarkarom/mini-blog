import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';

const PostDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [commentText, setCommentText] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState('');
    const [editContent, setEditContent] = useState('');

    useEffect(() => {
        fetchPost();
    }, [id]);

    const fetchPost = async () => {
        try {
            const response = await axios.get(`/posts/${id}`);
            setPost(response.data.post);
            setEditTitle(response.data.post.title);
            setEditContent(response.data.post.content);
        } catch (err) {
            setError('Failed to load post');
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        try {
            await axios.post(`/posts/${id}/like`);
            fetchPost();
        } catch (err) {
            console.error('Failed to like post', err);
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        try {
            await axios.post(`/posts/${id}/comment`, { text: commentText });
            setCommentText('');
            fetchPost();
        } catch (err) {
            console.error('Failed to add comment', err);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/posts/${id}`, {
                title: editTitle,
                content: editContent
            });
            setIsEditing(false);
            fetchPost();
        } catch (err) {
            setError('Failed to update post');
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                await axios.delete(`/posts/${id}`);
                navigate('/');
            } catch (err) {
                setError('Failed to delete post');
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-2xl text-gray-600">Loading post...</div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-2xl text-red-600">{error || 'Post not found'}</div>
            </div>
        );
    }

    const isAuthor = user && post.author._id === user.id;
    const isLiked = user && post.likes.includes(user.id);

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4">
            <div className="container mx-auto max-w-4xl">
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    {isEditing ? (
                        <form onSubmit={handleUpdate} className="space-y-6">
                            <input
                                type="text"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                className="w-full text-3xl font-bold px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            <textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                                rows="12"
                            />
                            <div className="flex gap-4">
                                <button
                                    type="submit"
                                    className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
                                >
                                    Save Changes
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-400 transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <>
                            <div className="mb-6">
                                <h1 className="text-4xl font-bold text-gray-800 mb-4">
                                    {post.title}
                                </h1>
                                <div className="flex items-center justify-between text-gray-600">
                                    <div className="flex items-center gap-4">
                                        <span>👤 {post.author.username}</span>
                                        <span>
                                            📅 {new Date(post.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    {isAuthor && (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setIsEditing(true)}
                                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={handleDelete}
                                                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="prose max-w-none mb-8">
                                <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
                                    {post.content}
                                </p>
                            </div>

                            <div className="border-t pt-6 mb-6">
                                <button
                                    onClick={handleLike}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${isLiked
                                            ? 'bg-red-100 text-red-600'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {isLiked ? '❤️' : '🤍'} {post.likes.length} Likes
                                </button>
                            </div>

                            <div className="border-t pt-6">
                                <h3 className="text-2xl font-bold mb-4">
                                    💬 Comments ({post.comments.length})
                                </h3>

                                {isAuthenticated && (
                                    <form onSubmit={handleComment} className="mb-6">
                                        <textarea
                                            value={commentText}
                                            onChange={(e) => setCommentText(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                                            rows="3"
                                            placeholder="Add a comment..."
                                            required
                                        />
                                        <button
                                            type="submit"
                                            className="mt-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition"
                                        >
                                            Post Comment
                                        </button>
                                    </form>
                                )}

                                <div className="space-y-4">
                                    {post.comments.map((comment) => (
                                        <div
                                            key={comment._id}
                                            className="bg-gray-50 p-4 rounded-lg"
                                        >
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="font-semibold text-gray-800">
                                                    {comment.user.username}
                                                </span>
                                                <span className="text-sm text-gray-500">
                                                    {new Date(comment.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-gray-700">{comment.text}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PostDetails;
