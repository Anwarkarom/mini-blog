import { useState, useEffect } from 'react';
import axios from '../api/axios';
import PostCard from '../components/PostCard';

const Dashboard = () => {
    const [myPosts, setMyPosts] = useState([]);
    const [likedPosts, setLikedPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('my-posts');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [myPostsRes, likedPostsRes] = await Promise.all([
                axios.get('/posts/user/my-posts'),
                axios.get('/posts/user/liked-posts')
            ]);
            setMyPosts(myPostsRes.data.posts);
            setLikedPosts(likedPostsRes.data.posts);
        } catch (err) {
            console.error('Failed to load dashboard data', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (postId) => {
        if (!window.confirm('Delete this post?')) {
            return;
        }
        try {
            await axios.delete(`/posts/${postId}`);
            setMyPosts((prev) => prev.filter((post) => post._id !== postId));
        } catch (err) {
            console.error('Failed to delete post', err);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-2xl text-gray-600">Loading dashboard...</div>
            </div>
        );
    }

    const totalLikes = myPosts.reduce((sum, post) => sum + post.likes.length, 0);

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4">
            <div className="container mx-auto">
                <h1 className="text-4xl font-bold text-gray-800 mb-8">
                    📊 My Dashboard
                </h1>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="text-3xl mb-2">📝</div>
                        <div className="text-2xl font-bold text-gray-800">
                            {myPosts.length}
                        </div>
                        <div className="text-gray-600">Total Posts</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="text-3xl mb-2">❤️</div>
                        <div className="text-2xl font-bold text-gray-800">
                            {totalLikes}
                        </div>
                        <div className="text-gray-600">Total Likes Received</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="text-3xl mb-2">⭐</div>
                        <div className="text-2xl font-bold text-gray-800">
                            {likedPosts.length}
                        </div>
                        <div className="text-gray-600">Posts Liked</div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex gap-4 border-b mb-6">
                        <button
                            onClick={() => setActiveTab('my-posts')}
                            className={`pb-3 px-4 font-semibold transition ${activeTab === 'my-posts'
                                    ? 'border-b-2 border-purple-600 text-purple-600'
                                    : 'text-gray-600 hover:text-gray-800'
                                }`}
                        >
                            My Posts ({myPosts.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('liked')}
                            className={`pb-3 px-4 font-semibold transition ${activeTab === 'liked'
                                    ? 'border-b-2 border-purple-600 text-purple-600'
                                    : 'text-gray-600 hover:text-gray-800'
                                }`}
                        >
                            Liked Posts ({likedPosts.length})
                        </button>
                    </div>

                    {activeTab === 'my-posts' ? (
                        myPosts.length === 0 ? (
                            <div className="text-center py-12 text-gray-600">
                                You haven't created any posts yet.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {myPosts.map((post) => (
                                    <PostCard key={post._id} post={post} onDelete={handleDelete} />
                                ))}
                            </div>
                        )
                    ) : (
                        likedPosts.length === 0 ? (
                            <div className="text-center py-12 text-gray-600">
                                You haven't liked any posts yet.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {likedPosts.map((post) => (
                                    <PostCard key={post._id} post={post} />
                                ))}
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
