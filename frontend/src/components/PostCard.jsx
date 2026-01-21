import { Link } from 'react-router-dom';

const PostCard = ({ post, onDelete }) => {
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <Link to={`/posts/${post._id}`}>
            <div className="relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-purple-300 cursor-pointer">
                {onDelete && (
                    <button
                        type="button"
                        aria-label="Delete post"
                        className="absolute top-3 right-3 h-6 w-6 rounded-full bg-red-600 text-white text-sm font-bold leading-6 hover:bg-red-700 transition"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onDelete(post._id);
                        }}
                    >
                        x
                    </button>
                )}
                {post.image && (
                    <img
                        src={post.image}
                        alt={post.title}
                        className="mb-4 h-48 w-full rounded-lg object-cover border border-gray-100"
                    />
                )}
                <h2 className="text-2xl font-bold text-gray-800 mb-3 hover:text-purple-600 transition">
                    {post.title}
                </h2>
                <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.content.substring(0, 150)}...
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                            👤 {post.author?.username || 'Anonymous'}
                        </span>
                        <span>{formatDate(post.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                            ❤️ {post.likes?.length || 0}
                        </span>
                        <span className="flex items-center gap-1">
                            💬 {post.comments?.length || 0}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default PostCard;
