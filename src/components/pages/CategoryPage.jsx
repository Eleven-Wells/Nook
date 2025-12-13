import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSearch, FaUser, FaHeart, FaComment, FaEye, FaArrowLeft } from 'react-icons/fa';

const CategoryPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [bloggers, setBloggers] = useState([]);
  const [posts, setPosts] = useState([]);

  // Mock posts data - In production, fetch from API/database
  const mockPosts = [
    {
      id: 1,
      title: "Getting Started with React Hooks",
      excerpt: "Learn how to use React Hooks to manage state and side effects in your applications...",
      author: "John Doe",
      authorEmail: "john@example.com",
      category: "Technology",
      likes: 234,
      comments: 45,
      views: 1200,
      image: "https://via.placeholder.com/400x250",
      date: "2024-01-15"
    },
    {
      id: 2,
      title: "10 Fashion Trends for 2024",
      excerpt: "Discover the hottest fashion trends that will dominate the fashion scene this year...",
      author: "Jane Smith",
      authorEmail: "jane@example.com",
      category: "Fashion",
      likes: 456,
      comments: 78,
      views: 2300,
      image: "https://via.placeholder.com/400x250",
      date: "2024-01-14"
    },
    {
      id: 3,
      title: "Understanding JavaScript Closures",
      excerpt: "Deep dive into JavaScript closures and how they work under the hood...",
      author: "Mike Johnson",
      authorEmail: "mike@example.com",
      category: "Technology",
      likes: 189,
      comments: 32,
      views: 890,
      image: "https://via.placeholder.com/400x250",
      date: "2024-01-13"
    },
    {
      id: 4,
      title: "Healthy Eating Tips for Busy Professionals",
      excerpt: "Maintain a healthy diet even with a hectic schedule with these practical tips...",
      author: "Sarah Williams",
      authorEmail: "sarah@example.com",
      category: "Health",
      likes: 312,
      comments: 56,
      views: 1500,
      image: "https://via.placeholder.com/400x250",
      date: "2024-01-12"
    },
    {
      id: 5,
      title: "Best Travel Destinations in Asia",
      excerpt: "Explore the most beautiful and affordable travel destinations across Asia...",
      author: "Tom Anderson",
      authorEmail: "tom@example.com",
      category: "Travel",
      likes: 567,
      comments: 89,
      views: 3400,
      image: "https://via.placeholder.com/400x250",
      date: "2024-01-11"
    },
    {
      id: 6,
      title: "Modern Web Development Best Practices",
      excerpt: "Essential practices every web developer should follow in 2024...",
      author: "Alice Brown",
      authorEmail: "alice@example.com",
      category: "Technology",
      likes: 423,
      comments: 67,
      views: 2100,
      image: "https://via.placeholder.com/400x250",
      date: "2024-01-10"
    }
  ];

  useEffect(() => {
    // Get all users from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Filter bloggers who have this category in their niches
    const categoryBloggers = users.filter(user => 
      user.role === 'blogger' && 
      user.niches && 
      user.niches.some(niche => niche.toLowerCase() === category.toLowerCase())
    );
    
    setBloggers(categoryBloggers);

    // Filter posts by category
    const categoryPosts = mockPosts.filter(post => 
      post.category.toLowerCase() === category.toLowerCase()
    );
    
    setPosts(categoryPosts);
  }, [category]);

  // Filter posts based on search query
  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ x: -5 }}
          onClick={() => navigate('/')}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-green-700 transition-colors"
        >
          <FaArrowLeft /> Back to Home
        </motion.button>

        {/* Header with Search */}
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

          {/* Search Bar */}
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

          {/* Stats */}
          <div className="mt-6 flex flex-wrap gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-2">
              <FaUser /> {bloggers.length} Bloggers
            </span>
            <span className="flex items-center gap-2">
              📝 {filteredPosts.length} Articles
            </span>
          </div>
        </motion.div>

        {/* Featured Bloggers */}
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
                  <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-xl font-bold">
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

        {/* Blog Posts Grid */}
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
                  {/* Post Image */}
                  <div className="relative h-48 bg-gradient-to-br from-green-400 to-green-600">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-xs font-semibold text-green-700">
                      {post.category}
                    </span>
                  </div>

                  {/* Post Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>

                    {/* Author Info */}
                    <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold">
                        {post.author.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{post.author}</p>
                        <p className="text-gray-500 text-xs">{post.date}</p>
                      </div>
                    </div>

                    {/* Engagement Stats */}
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