import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSearch, FaUser, FaHeart, FaComment, FaEye, FaArrowLeft } from 'react-icons/fa';
import { apiClient } from '../../utils/apiClient';
import { API_ENDPOINTS } from '../../config/api';

const CategoryPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [bloggers, setBloggers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fallbackPosts = [
    {
      id: 1,
      title: `Getting Started with ${category}`,
      excerpt: "Learn how to use React Hooks to manage state and side effects in your applications...",
      author: "John Doe",
      category: category,
      likes: 234,
      comments: 45,
      views: 1200,
      image: "https://via.placeholder.com/400x250",
      date: "2024-01-15"
    }
  ];

  useEffect(() => {
    const fetchCategoryData = async () => {
      setIsLoading(true);
      try {
        const data = await apiClient.get(`${API_ENDPOINTS.featuredPosts}?category=${category}`);
        setPosts(data.posts || data || []);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setPosts(fallbackPosts);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoryData();
  }, [category]);

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ x: -5 }}
          onClick={() => navigate('/')}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-green-700 transition-colors"
        >
          <FaArrowLeft /> Back to Home
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4 capitalize">
            {category}
          </h1>
          <p className="text-gray-600 mb-6">
            Explore articles and content from bloggers specializing in {category}
          </p>

          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-lg"
            />
          </div>

          <div className="mt-6 flex flex-wrap gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-2">
              <FaUser /> {bloggers.length} Bloggers
            </span>
            <span className="flex items-center gap-2">
              📝 {filteredPosts.length} Articles
            </span>
          </div>
        </motion.div>

        {bloggers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Featured Bloggers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {bloggers.slice(0, 4).map((blogger, index) => (
                <motion.div
                  key={blogger.email}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-xl transition-all cursor-pointer"
                >
                  <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-linear-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-xl font-bold">
                    {blogger.username?.charAt(0).toUpperCase()}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{blogger.username}</h3>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {blogger.niches?.map((niche, i) => (
                      <span key={i} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        {niche}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {searchQuery ? `Search Results (${filteredPosts.length})` : 'Latest Articles'}
          </h2>

          {filteredPosts.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <p className="text-gray-600 text-lg">
                {searchQuery
                  ? `No articles found for "${searchQuery}"`
                  : `No articles available in ${category} yet. Check back soon!`
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-all"
                >
                  <div className="relative h-48 bg-linear-to-br from-green-400 to-green-600">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-xs font-semibold text-green-700">
                      {post.category}
                    </span>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
                      <div className="w-10 h-10 rounded-full bg-linear-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold">
                        {post.author.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{post.author}</p>
                        <p className="text-gray-500 text-xs">{post.date}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <FaHeart className="text-red-500" /> {post.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaComment className="text-blue-500" /> {post.comments}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaEye className="text-gray-500" /> {post.views}
                      </span>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
