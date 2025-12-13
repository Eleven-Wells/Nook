import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import Images from "../ui/Images";
import { FaArrowRight, FaUser, FaClock } from "react-icons/fa";

const Home = () => {
  const { isLoggedIn } = useAuth();
  const [showOriginal, setShowOriginal] = useState(true);
  const [posts, setPosts] = useState([]);
  const [currentPostIndex, setCurrentPostIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch posts from API
  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://blog-backend-4whx.onrender.com/api/v1/blogs/featured-posts');
      if (!response.ok) throw new Error('Failed to fetch posts');
      const data = await response.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      // Fetch posts when user logs in
      fetchPosts();

      // Show original content for 30 seconds
      const originalTimer = setTimeout(() => {
        setShowOriginal(false);
      }, 30000); // 30 seconds

      return () => clearTimeout(originalTimer);
    } else {
      // Reset to original if user logs out
      setShowOriginal(true);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn && !showOriginal && posts.length > 0) {
      // Rotate posts every 15 seconds
      const interval = setInterval(() => {
        setCurrentPostIndex((prevIndex) => (prevIndex + 1) % posts.length);
      }, 15000); // 15 seconds

      return () => clearInterval(interval);
    }
  }, [isLoggedIn, showOriginal, posts.length]);

  // Motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.5 }
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const slideIn = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } },
    exit: { opacity: 0, x: -100, transition: { duration: 0.5 } }
  };

  // Original Home Content
  const OriginalContent = () => (
    <motion.div
      className="max-w-6xl mx-auto flex flex-col items-center text-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.h1
        className="text-3xl md:text-5xl font-semibold leading-tight whitespace-nowrap max-w-xs sm:max-w-none"
        variants={fadeUp}
      >
        Get the latest gists, blogs
        <br />
        and articles on any topic
      </motion.h1>

      <motion.p
        className="mt-4 text-gray-600 max-w-xl"
        variants={fadeUp}
      >
        A vibrant place where you'll find the latest gist, hot trends,
        creative ideas and inspiring thoughts to fuel your day
      </motion.p>

      <motion.button
        className="mt-6 bg-green-800 text-white px-8 py-3 rounded-full shadow hover:bg-green-900 transition-colors"
        variants={fadeUp}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Read Article
      </motion.button>

      <motion.div className="mt-7" variants={fadeUp}>
        <Images />
      </motion.div>
    </motion.div>
  );

  // Dynamic Post Content
  const PostContent = ({ post }) => (
    <motion.div
      className="max-w-6xl mx-auto"
      variants={slideIn}
      initial="hidden"
      animate="visible"
      exit="exit"
      key={post.id}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Side - Image */}
        <motion.div 
          className="relative rounded-2xl overflow-hidden shadow-2xl group"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <div className="aspect-[4/3] bg-gradient-to-br from-green-400 to-green-600">
            <img 
              src={post.image} 
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>
          {post.isTrending && (
            <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
              🔥 Trending
            </div>
          )}
        </motion.div>

        {/* Right Side - Content */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-3 text-sm text-gray-600 mb-4">
              <span className="flex items-center gap-2">
                <FaUser className="text-green-700" />
                Featured Article
              </span>
              <span className="flex items-center gap-2">
                <FaClock className="text-green-700" />
                {new Date().toLocaleDateString()}
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {post.title}
            </h1>

            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              {post.description}
            </p>

            <motion.a
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-green-800 text-white px-8 py-4 rounded-full shadow-lg hover:bg-green-900 transition-all font-semibold text-lg"
              whileHover={{ scale: 1.05, x: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              Read Full Article
              <FaArrowRight />
            </motion.a>
          </motion.div>

          {/* Progress Indicator */}
          <motion.div 
            className="flex items-center gap-2 mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {posts.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === currentPostIndex 
                    ? 'bg-green-700 w-12' 
                    : 'bg-gray-300 w-8'
                }`}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <section className="bg-[#f7fcff] w-full py-16 px-6 min-h-[600px] flex items-center">
      <AnimatePresence mode="wait">
        {!isLoggedIn || showOriginal ? (
          <OriginalContent key="original" />
        ) : posts.length > 0 && !isLoading ? (
          <PostContent key={`post-${currentPostIndex}`} post={posts[currentPostIndex]} />
        ) : (
          <motion.div
            key="loading"
            className="max-w-6xl mx-auto text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="animate-pulse">
              <div className="h-12 bg-gray-200 rounded-lg mb-4 w-3/4 mx-auto"></div>
              <div className="h-6 bg-gray-200 rounded-lg mb-2 w-1/2 mx-auto"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Home;
