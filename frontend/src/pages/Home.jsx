import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import PostCard from '../components/PostCard';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const normalizedSearch = search.trim().toLowerCase();
    const filteredPosts = normalizedSearch
        ? posts.filter((post) => {
            const title = post.title?.toLowerCase() || '';
            const content = post.content?.toLowerCase() || '';
            const author = post.author?.username?.toLowerCase() || '';
            return title.includes(normalizedSearch)
                || content.includes(normalizedSearch)
                || author.includes(normalizedSearch);
        })
        : posts;

    const featuredPost = filteredPosts.find((post) => post.image) || filteredPosts[0];
    const mainPosts = filteredPosts.filter(
        (post) => post._id !== featuredPost?._id && post.image
    );
    const textPosts = filteredPosts.filter(
        (post) => post._id !== featuredPost?._id && !post.image
    );
    const stories = posts.slice(0, 8);

    const getAvatarUrl = (author) => {
        if (author?.avatar) {
            return author.avatar;
        }
        const seed = author?.username || 'User';
        return `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(seed)}`;
    };

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get('/posts');
                setPosts(response.data.posts);
            } catch (err) {
                setError('Failed to load posts');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    useEffect(() => {
        if (location.state?.openSearch) {
            setShowSearch(true);
        }
    }, [location.state]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-2xl text-gray-600">Loading posts...</div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen overflow-hidden text-white">
            <div className="absolute inset-0 bg-[#0a0b1f]" />
            <div className="absolute inset-0 opacity-90 bg-[radial-gradient(circle_at_20%_20%,rgba(124,58,237,0.55),transparent_45%),radial-gradient(circle_at_80%_10%,rgba(30,64,175,0.6),transparent_40%),radial-gradient(circle_at_50%_80%,rgba(255,0,153,0.45),transparent_50%)]" />
            <div className="absolute inset-0 opacity-60 blur-3xl bg-[radial-gradient(circle_at_10%_40%,rgba(124,58,237,0.35),transparent_55%),radial-gradient(circle_at_90%_60%,rgba(14,116,255,0.35),transparent_55%)] animate-pulse" />

            <div className="fixed left-4 top-1/2 -translate-y-1/2 z-20">
                <div className="flex flex-col items-center gap-3 bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl px-3 py-4 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
                    <Link
                        to="/"
                        className="h-11 w-11 rounded-xl flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition"
                        aria-label="Home"
                    >
                        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
                            <path d="M3 10.5L12 4l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9.5z" />
                        </svg>
                    </Link>
                    <button
                        type="button"
                        onClick={() => setShowSearch((prev) => !prev)}
                        className="h-11 w-11 rounded-xl flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition"
                        aria-label="Search"
                    >
                        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
                            <circle cx="11" cy="11" r="6.5" />
                            <path d="M16.5 16.5L21 21" />
                        </svg>
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/create')}
                        className="h-11 w-11 rounded-xl flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition"
                        aria-label="Create post"
                    >
                        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
                            <path d="M12 5v14M5 12h14" />
                        </svg>
                    </button>
                    <Link
                        to="/dashboard"
                        className="h-11 w-11 rounded-xl flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition"
                        aria-label="Dashboard"
                    >
                        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
                            <path d="M3 12h8V3H3v9zM13 21h8v-6h-8v6zM13 3h8v8h-8V3zM3 21h8v-6H3v6z" />
                        </svg>
                    </Link>
                    <Link
                        to="/dashboard"
                        className="h-11 w-11 rounded-xl flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition"
                        aria-label="Profile"
                    >
                        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
                            <path d="M12 13a4 4 0 1 0-4-4 4 4 0 0 0 4 4z" />
                            <path d="M4 20a8 8 0 0 1 16 0" />
                        </svg>
                    </Link>
                </div>
            </div>

            <div className="relative z-10">
                <div className="container mx-auto max-w-6xl px-6 pt-12">
                    <div className="text-center">
                        <div className="text-xs uppercase tracking-[0.6em] text-white/60">
                            Minigram
                        </div>
                        <h1 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-[0.2em]">
                            MINI<span className="text-pink-300">GRAM</span>
                        </h1>
                        <p className="mt-4 text-white/70 max-w-2xl mx-auto">
                            A glassy feed where stories float through neon clouds.
                        </p>
                    </div>

                    {showSearch && (
                        <div className="mt-8 flex items-center justify-center">
                            <div className="w-full max-w-2xl bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-5 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
                                <input
                                    type="text"
                                    placeholder="Search posts, captions, or authors"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full bg-transparent text-white placeholder-white/50 focus:outline-none"
                                />
                            </div>
                        </div>
                    )}

                    <div className="mt-10 bg-white/5 border border-white/10 rounded-2xl px-5 py-4 backdrop-blur-md">
                        <div className="flex items-center gap-4 overflow-x-auto pb-2">
                            {stories.length === 0 ? (
                                <div className="text-sm text-white/60">
                                    No stories yet.
                                </div>
                            ) : (
                                stories.map((post) => {
                                    const label = post.author?.username || 'User';
                                    return (
                                        <div
                                            key={`story-${post._id}`}
                                            className="flex flex-col items-center min-w-[78px]"
                                        >
                                            <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-pink-500 via-purple-500 to-blue-500 p-[2px] shadow-[0_0_18px_rgba(255,0,153,0.35)]">
                                                <div className="h-full w-full rounded-full bg-black/40 overflow-hidden">
                                                    <img
                                                        src={getAvatarUrl(post.author)}
                                                        alt={label}
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                            </div>
                                            <span className="mt-2 text-xs text-white/70 truncate max-w-[78px]">
                                                {label}
                                            </span>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
                        <div className="lg:col-span-8 space-y-8">
                            {error && (
                                <div className="bg-red-500/20 border border-red-500/40 text-red-100 px-4 py-3 rounded">
                                    {error}
                                </div>
                            )}

                            {!featuredPost && (
                                <div className="text-center py-20 text-white/70">
                                    No posts yet. Be the first to create one!
                                </div>
                            )}

                            {featuredPost && (
                                <PostCard post={featuredPost} variant="glass" featured />
                            )}

                            {mainPosts.length > 0 && (
                                <div className="grid sm:grid-cols-2 gap-6">
                                    {mainPosts.map((post, index) => (
                                        <div
                                            key={post._id}
                                            className={index % 5 === 0 ? 'sm:col-span-2' : ''}
                                        >
                                            <PostCard post={post} variant="glass" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="lg:col-span-4">
                            <div className="sticky top-10 space-y-6">
                                <div className="bg-white/10 border border-white/15 rounded-2xl p-5 backdrop-blur-md">
                                    <div className="text-xs uppercase tracking-[0.3em] text-white/60">
                                        Notes
                                    </div>
                                    <div className="mt-5 space-y-4">
                                        {textPosts.length === 0 ? (
                                            <div className="text-sm text-white/60">
                                                No text posts right now.
                                            </div>
                                        ) : (
                                            textPosts.map((post) => (
                                                <PostCard
                                                    key={post._id}
                                                    post={post}
                                                    variant="glass"
                                                    compact
                                                />
                                            ))
                                        )}
                                    </div>
                                </div>
                                <div className="text-xs text-white/40 leading-relaxed">
                                    MiniGram keeps your feed light, visual, and immersive.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
