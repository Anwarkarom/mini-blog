import { Link } from 'react-router-dom';

const PostCard = ({
    post,
    onDelete,
    onEdit,
    variant = 'solid',
    featured = false,
    compact = false
}) => {
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const isGlass = variant === 'glass';
    const avatarSeed = post.author?.username || 'User';
    const avatarUrl = post.author?.avatar
        || `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(avatarSeed)}`;

    const containerClass = isGlass
        ? 'bg-white/10 backdrop-blur-md border border-white/15 text-white shadow-[0_10px_30px_rgba(0,0,0,0.25)] hover:shadow-[0_0_30px_rgba(255,0,153,0.35)]'
        : 'bg-white text-gray-900 border border-gray-200 shadow-sm hover:shadow-md';
    const headerClass = isGlass ? 'bg-white/5' : 'bg-white';
    const titleClass = isGlass ? 'text-white' : 'text-gray-900';
    const bodyClass = isGlass ? 'text-white/70' : 'text-gray-600';
    const metaClass = isGlass ? 'text-white/70' : 'text-gray-500';
    const imageHeightClass = featured ? 'h-[26rem]' : compact ? 'h-56' : 'h-72';
    const contentPadding = compact ? 'px-4 py-3' : 'px-5 py-4';
    const hasActions = !!onDelete || !!onEdit;

    return (
        <Link to={`/posts/${post._id}`}>
            <div className={`group relative rounded-2xl transition-all duration-300 cursor-pointer overflow-hidden ${containerClass}`}>
                {hasActions && (
                    <div className="absolute top-4 right-4 z-10 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
                        {onEdit && (
                            <button
                                type="button"
                                className="rounded-full bg-white/20 text-white text-xs px-3 py-1 backdrop-blur-md hover:bg-white/30 transition"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onEdit(post._id);
                                }}
                            >
                                Edit
                            </button>
                        )}
                        {onDelete && (
                            <button
                                type="button"
                                aria-label="Delete post"
                                className="rounded-full bg-red-500/80 text-white text-xs px-3 py-1 hover:bg-red-500 transition"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onDelete(post._id);
                                }}
                            >
                                Delete
                            </button>
                        )}
                    </div>
                )}
                <div className={`flex items-center justify-between px-5 py-4 ${headerClass}`}>
                    <div className="flex items-center gap-3">
                        <img
                            src={avatarUrl}
                            alt={post.author?.username || 'User'}
                            className={`h-10 w-10 rounded-full object-cover ${isGlass ? 'ring-2 ring-white/30' : 'ring-1 ring-gray-200'}`}
                        />
                        <div className={`text-sm font-semibold ${titleClass}`}>
                            {post.author?.username || 'Anonymous'}
                        </div>
                    </div>
                    <div className={`text-xs ${metaClass}`}>{formatDate(post.createdAt)}</div>
                </div>
                {post.image && (
                    <div className="relative">
                        <img
                            src={post.image}
                            alt={post.title}
                            className={`${imageHeightClass} w-full object-cover ${isGlass ? 'border-y border-white/10' : 'border-y border-gray-100'}`}
                        />
                        <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition">
                            <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3 text-xs text-white">
                                <span className="rounded-full bg-white/15 px-3 py-1 backdrop-blur-sm">
                                    Like {post.likes?.length || 0}
                                </span>
                                <span className="rounded-full bg-white/15 px-3 py-1 backdrop-blur-sm">
                                    Comment {post.comments?.length || 0}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
                <div className={contentPadding}>
                    <h2 className={`font-bold mb-2 transition ${featured ? 'text-2xl' : 'text-xl'} ${titleClass}`}>
                        {post.title}
                    </h2>
                    <p className={`mb-4 line-clamp-3 ${bodyClass}`}>
                        {post.content.substring(0, 150)}...
                    </p>
                    <div className={`flex items-center gap-4 text-sm ${metaClass}`}>
                        <span>{post.likes?.length || 0} Likes</span>
                        <span>{post.comments?.length || 0} Comments</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default PostCard;
