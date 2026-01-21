import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';

const CreatePost = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imageData, setImageData] = useState('');
    const [imagePreview, setImagePreview] = useState('');
    const [imageError, setImageError] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleImageChange = (e) => {
        const file = e.target.files && e.target.files[0];
        setImageError('');

        if (!file) {
            setImageData('');
            setImagePreview('');
            return;
        }

        const maxBytes = 2 * 1024 * 1024;
        if (file.size > maxBytes) {
            setImageError('Image must be 2MB or less.');
            setImageData('');
            setImagePreview('');
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            if (typeof reader.result === 'string') {
                setImageData(reader.result);
                setImagePreview(reader.result);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await axios.post('/posts', {
                title,
                content,
                image: imageData
            });
            navigate(`/posts/${response.data.post._id}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create post');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4">
            <div className="container mx-auto max-w-3xl">
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    <h1 className="text-3xl font-bold mb-8 text-gray-800">
                        Create New Post ✍️
                    </h1>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">
                                Title
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                                placeholder="Enter your post title..."
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">
                                Content
                            </label>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition resize-none"
                                rows="12"
                                placeholder="Write your content here..."
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">
                                Image (optional)
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                            />
                            {imageError && (
                                <p className="text-sm text-red-600 mt-2">{imageError}</p>
                            )}
                            {imagePreview && (
                                <div className="mt-4">
                                    <img
                                        src={imagePreview}
                                        alt="Selected preview"
                                        className="w-full max-h-80 object-cover rounded-lg border border-gray-200"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setImageData('');
                                            setImagePreview('');
                                        }}
                                        className="mt-3 text-sm text-gray-600 underline hover:text-gray-800"
                                    >
                                        Remove image
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
                            >
                                {loading ? 'Publishing...' : 'Publish Post'}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/')}
                                className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreatePost;
