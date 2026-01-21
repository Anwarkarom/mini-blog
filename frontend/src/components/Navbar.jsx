import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const location = useLocation();

    if (location.pathname === '/') {
        return null;
    }

    return (
        <nav className="bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <Link to="/" className="text-2xl font-bold hover:opacity-80 transition">
                        📝 Mini Blog
                    </Link>

                    <div className="hidden md:flex items-center gap-6">
                        <Link to="/" className="hover:opacity-80 transition">
                            Home
                        </Link>
                        {isAuthenticated && (
                            <>
                                <Link to="/dashboard" className="hover:opacity-80 transition">
                                    Dashboard
                                </Link>
                                <Link to="/create" className="hover:opacity-80 transition">
                                    Create Post
                                </Link>
                            </>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        {isAuthenticated ? (
                            <>
                                <span className="hidden md:inline">👋 {user?.username}</span>
                                <button
                                    onClick={logout}
                                    className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-opacity-90 transition"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="hover:opacity-80 transition"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-opacity-90 transition"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
