import { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { BsWifiOff } from 'react-icons/bs';
import { BiRefresh } from 'react-icons/bi';
import { TrendingCard, ShimmerCard } from '../ui/Card.jsx';
import { API_BASE_URL, API_ENDPOINTS } from '../../config/api';
import { apiClient } from '../../utils/apiClient';

// Reusable Connection Failed Component
export const ConnectionFailed = ({ onRetry, isRetrying, message }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="flex flex-col items-center justify-center py-20"
    >
        <motion.div
            animate={{
                rotate: [0, -10, 10, -10, 0],
            }}
            transition={{
                duration: 0.5,
                repeat: isRetrying ? Infinity : 0,
                repeatDelay: 0.5
            }}
        >
            <BsWifiOff className="text-gray-400 text-6xl mb-4" />
        </motion.div>

        <h3 className="text-xl font-bold text-gray-900 mb-2">Connection Failed</h3>
        <p className="text-gray-600 text-sm mb-6 text-center max-w-md">
            {message || 'Unable to connect to the server. Please check your connection.'}
        </p>

        <motion.button
            onClick={onRetry}
            disabled={isRetrying}
            className="flex items-center gap-2 bg-green-800 hover:bg-green-900 text-white px-6 py-3 rounded-full font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <BiRefresh className={`text-xl ${isRetrying ? 'animate-spin' : ''}`} />
            {isRetrying ? 'Retrying...' : 'Retry Connection'}
        </motion.button>
    </motion.div>
);

// Main Featured Posts Section
const FeaturedPosts = () => {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [isRetrying, setIsRetrying] = useState(false);

    const fetchPosts = async () => {
        setIsLoading(true);
        setHasError(false);

        try {
            const data = await apiClient.get(API_ENDPOINTS.featuredPosts);
            setPosts(data.posts || data || []);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching posts:', error);
            setHasError(true);
            setIsLoading(false);

            setTimeout(() => {
                if (hasError) {
                    handleRetry();
                }
            }, 5000);
        }
    };

    const handleRetry = () => {
        setIsRetrying(true);
        fetchPosts().finally(() => {
            setIsRetrying(false);
        });
    };

    useEffect(() => {
        fetchPosts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3">Featured Posts</h2>
                    <p className="text-gray-600 dark:text-slate-200 max-w-2xl mx-auto">
                        Explore our featured posts filled with ideas worth reading, sharing, and remembering.
                    </p>
                </motion.div>

                {/* Content */}
                <AnimatePresence mode="wait">
                    {isLoading ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {[...Array(6)].map((_, index) => (
                                <ShimmerCard key={index} />
                            ))}
                        </motion.div>
                    ) : hasError ? (
                        <motion.div key="error">
                            <ConnectionFailed
                                onRetry={handleRetry}
                                isRetrying={isRetrying}
                                message="Unable to load featured posts. Please check your connection and try again."
                            />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="content"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {posts.map((post, index) => (
                                <motion.div
                                    key={post.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <TrendingCard
                                        image={post.image}
                                        title={post.title}
                                        description={post.description}
                                        isTrending={post.isTrending}
                                        link={post.link}
                                        isLoading={false}
                                    />
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* See More Button */}
                {!isLoading && !hasError && posts.length > 0 && (
                    <motion.div
                        className="text-center mt-12"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                    >
                        <motion.button
                            className="bg-white border-2 border-green-800 text-green-800 hover:bg-green-800 hover:text-white px-8 py-3 rounded-full font-semibold transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            See More
                        </motion.button>
                    </motion.div>
                )}
            </div>
        </section>
    );
}

export default FeaturedPosts