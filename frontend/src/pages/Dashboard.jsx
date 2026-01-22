import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import PostCard from '../components/PostCard';

const StatCard = ({ title, value, subtitle, gradientId }) => {
    return (
        <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md p-6 shadow-[0_18px_40px_rgba(0,0,0,0.45)]">
            <div className="absolute inset-0 opacity-70">
                <svg viewBox="0 0 400 140" className="h-full w-full">
                    <defs>
                        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.8" />
                            <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.9" />
                            <stop offset="100%" stopColor="#ff4fd8" stopOpacity="0.9" />
                        </linearGradient>
                    </defs>
                    <path
                        d="M0 90 C60 40, 120 120, 180 80 C240 40, 300 120, 400 70"
                        stroke={`url(#${gradientId})`}
                        strokeWidth="3"
                        fill="none"
                    />
                    <path
                        d="M0 110 C70 70, 140 130, 200 95 C260 60, 320 120, 400 95"
                        stroke={`url(#${gradientId})`}
                        strokeWidth="2"
                        fill="none"
                        opacity="0.6"
                    />
                </svg>
            </div>
            <div className="relative z-10">
                <div className="text-xs uppercase tracking-[0.35em] text-white/60">{title}</div>
                <div className="mt-4 text-3xl font-semibold text-white">{value}</div>
                <div className="mt-2 text-sm text-white/70">{subtitle}</div>
            </div>
        </div>
    );
};

const Dashboard = () => {
    const [myPosts, setMyPosts] = useState([]);
    const [likedPosts, setLikedPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('my-posts');
    const [draft, setDraft] = useState('');
    const navigate = useNavigate();

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
    const postsToShow = activeTab === 'my-posts' ? myPosts : likedPosts;

    return (
        <div className="relative min-h-screen overflow-hidden text-white">
            <div className="absolute inset-0 bg-[#090b1e]" />
            <div className="absolute inset-0 opacity-90 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.5),transparent_45%),radial-gradient(circle_at_80%_10%,rgba(59,130,246,0.45),transparent_45%),radial-gradient(circle_at_50%_80%,rgba(244,63,94,0.35),transparent_55%)]" />
            <div className="absolute inset-0 opacity-50 blur-3xl bg-[radial-gradient(circle_at_10%_40%,rgba(124,58,237,0.35),transparent_55%),radial-gradient(circle_at_90%_60%,rgba(14,116,255,0.35),transparent_55%)] animate-pulse" />

            <div className="relative z-10 container mx-auto max-w-6xl px-6 py-12">
                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div>
                        <div className="text-xs uppercase tracking-[0.45em] text-white/60">
                            Creator Nebula
                        </div>
                        <h1 className="mt-4 text-4xl font-semibold tracking-wide">
                            Your Dashboard
                        </h1>
                        <p className="mt-3 text-white/70 max-w-xl">
                            Manage your posts inside a neon cloud of stats and bento tiles.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => navigate('/create')}
                        className="self-start md:self-auto rounded-full bg-white/15 px-6 py-3 text-sm font-semibold text-white backdrop-blur-md border border-white/20 hover:bg-white/25 transition"
                    >
                        Create New Post
                    </button>
                </div>

                <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard
                        title="Posts"
                        value={myPosts.length}
                        subtitle="Total published posts"
                        gradientId="posts-wave"
                    />
                    <StatCard
                        title="Likes"
                        value={totalLikes}
                        subtitle="Total likes received"
                        gradientId="likes-wave"
                    />
                    <StatCard
                        title="Liked"
                        value={likedPosts.length}
                        subtitle="Posts you liked"
                        gradientId="liked-wave"
                    />
                </div>

                <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-8 space-y-6">
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setActiveTab('my-posts')}
                                className={`rounded-full px-5 py-2 text-sm font-semibold border transition ${activeTab === 'my-posts'
                                        ? 'border-white/40 bg-white/15 text-white'
                                        : 'border-white/10 text-white/60 hover:text-white hover:bg-white/10'
                                    }`}
                            >
                                My Posts ({myPosts.length})
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('liked')}
                                className={`rounded-full px-5 py-2 text-sm font-semibold border transition ${activeTab === 'liked'
                                        ? 'border-white/40 bg-white/15 text-white'
                                        : 'border-white/10 text-white/60 hover:text-white hover:bg-white/10'
                                    }`}
                            >
                                Liked Posts ({likedPosts.length})
                            </button>
                        </div>

                        {postsToShow.length === 0 ? (
                            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-10 text-center text-white/60">
                                No posts here yet.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-[1fr]">
                                {postsToShow.map((post, index) => {
                                    const isFeature = index === 0 && activeTab === 'my-posts';
                                    const isWide = post.image && index % 4 === 0;
                                    const colSpan = isFeature || isWide ? 'md:col-span-2' : '';
                                    return (
                                        <div key={post._id} className={colSpan}>
                                            <PostCard
                                                post={post}
                                                variant="glass"
                                                featured={isFeature}
                                                compact={!post.image}
                                                onDelete={activeTab === 'my-posts' ? handleDelete : undefined}
                                                onEdit={
                                                    activeTab === 'my-posts'
                                                        ? (postId) => navigate(`/posts/${postId}`)
                                                        : undefined
                                                }
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div className="lg:col-span-4">
                        <div className="sticky top-8 space-y-6">
                            <div className="rounded-3xl border border-white/15 bg-white/10 backdrop-blur-md p-6 shadow-[0_18px_40px_rgba(0,0,0,0.45)]">
                                <div className="text-xs uppercase tracking-[0.35em] text-white/60">
                                    Quick Draft Cloud
                                </div>
                                <textarea
                                    value={draft}
                                    onChange={(e) => setDraft(e.target.value)}
                                    rows={6}
                                    placeholder="Drop your next idea here..."
                                    className="mt-4 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                                />
                                <div className="mt-4 flex items-center justify-between text-xs text-white/50">
                                    <span>{draft.length} chars</span>
                                    <button
                                        type="button"
                                        onClick={() => navigate('/create')}
                                        className="rounded-full bg-white/20 px-5 py-2 text-xs font-semibold text-white hover:bg-white/30 transition"
                                    >
                                        Post Now
                                    </button>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-5 text-xs text-white/50">
                                Build your next drop: keep drafts short, punchy, and ready to post.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
