import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaPen, 
  FaHome, 
  FaChartLine, 
  FaCog, 
  FaBookmark,
  FaPlus,
  FaEye,
  FaHeart,
  FaComment,
  FaCamera
} from 'react-icons/fa';
import { MdArticle } from 'react-icons/md';

const BloggerDashboard = () => {
  const { user, isBlogger, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  React.useEffect(() => {
    if (!isBlogger) {
      navigate('/profile');
    }
  }, [isBlogger, navigate]);

  const posts = [
    { id: 1, title: 'Getting Started with React', views: 1234, likes: 89, comments: 23, status: 'published' },
    { id: 2, title: '10 Tips for Better Code', views: 2341, likes: 156, comments: 45, status: 'published' },
    { id: 3, title: 'Understanding Hooks', views: 567, likes: 34, comments: 12, status: 'draft' },
  ];

  const stats = [
    { label: 'Total Posts', value: '12', icon: MdArticle, color: 'bg-blue-500' },
    { label: 'Total Views', value: '24.5K', icon: FaEye, color: 'bg-green-500' },
    { label: 'Total Likes', value: '1.2K', icon: FaHeart, color: 'bg-red-500' },
    { label: 'Comments', value: '389', icon: FaComment, color: 'bg-purple-500' },
  ];

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: FaHome },
    { id: 'posts', label: 'My Posts', icon: MdArticle },
    { id: 'analytics', label: 'Analytics', icon: FaChartLine },
    { id: 'bookmarks', label: 'Bookmarks', icon: FaBookmark },
    { id: 'settings', label: 'Settings', icon: FaCog },
  ];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setUploading(true);
    const reader = new FileReader();
    
    reader.onloadend = () => {
      updateProfile({ profileImage: reader.result });
      setUploading(false);
    };

    reader.onerror = () => {
      alert('Failed to upload image');
      setUploading(false);
    };

    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Profile Image with Upload */}
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
                  {user?.profileImage ? (
                    <img 
                      src={user.profileImage} 
                      alt={user.username} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FaPen size={24} />
                  )}
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={triggerFileInput}
                  disabled={uploading}
                  className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-green-700 transition-all disabled:bg-gray-400"
                >
                  {uploading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <FaCamera size={14} />
                  )}
                </motion.button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
              
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.username}!</h1>
                {/* Multiple Niches Display */}
                <div className="flex flex-wrap gap-2 mt-1">
                  {user?.niches && user.niches.length > 0 ? (
                    user.niches.map((niche, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full"
                      >
                        {niche}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-600 text-sm">Blogger</span>
                  )}
                </div>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all shadow-lg flex items-center gap-2"
            >
              <FaPlus /> New Post
            </motion.button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <nav className="space-y-2">
                {menuItems.map((item) => (
                  <motion.button
                    key={item.id}
                    whileHover={{ x: 5 }}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                      activeTab === item.id
                        ? 'bg-green-100 text-green-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon size={20} />
                    {item.label}
                  </motion.button>
                ))}
              </nav>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-2xl shadow-lg p-6"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center text-white`}>
                          <stat.icon size={24} />
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                      <p className="text-gray-600 text-sm">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Recent Posts */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Posts</h2>
                  <div className="space-y-4">
                    {posts.map((post) => (
                      <motion.div
                        key={post.id}
                        whileHover={{ scale: 1.02 }}
                        className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-2">{post.title}</h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <FaEye /> {post.views}
                              </span>
                              <span className="flex items-center gap-1">
                                <FaHeart /> {post.likes}
                              </span>
                              <span className="flex items-center gap-1">
                                <FaComment /> {post.comments}
                              </span>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            post.status === 'published' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {post.status}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Other Tabs */}
            {activeTab !== 'overview' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-2xl shadow-lg p-8 text-center"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {menuItems.find(item => item.id === activeTab)?.label}
                </h2>
                <p className="text-gray-600">This section is under development</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BloggerDashboard;
