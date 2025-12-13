import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaGoogle, 
  FaFacebook, 
  FaUser, 
  FaEnvelope, 
  FaLock,
  FaTimes,
  FaArrowLeft,
  FaPen,
  FaHashtag
} from "react-icons/fa";
import { MdCheckCircle } from "react-icons/md";

const AuthModal = ({ onClose, onLoginSuccess }) => {
  const { login } = useAuth();
  const [mode, setMode] = useState("choose");
  const [bloggerData, setBloggerData] = useState({
    username: "",
    niche: "",
    email: "",
    password: "",
  });
  const [streamerData, setStreamerData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleStreamerSignup = () => {
    if (!streamerData.name || !streamerData.email || !streamerData.password) {
      alert("Please fill in all fields");
      return;
    }

    if (streamerData.password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }
    
    const userData = { 
      role: "streamer", 
      name: streamerData.name,
      email: streamerData.email
    };
    
    login(userData);
    onLoginSuccess();
    onClose();
  };

  const handleSocialLogin = (provider) => {
    const userData = { 
      role: "streamer", 
      name: `${provider} User`,
      email: `user@${provider.toLowerCase()}.com`,
      provider: provider
    };
    
    login(userData);
    onLoginSuccess();
    onClose();
  };

  const handleBloggerSubmit = () => {
    if (!bloggerData.username || !bloggerData.niche || !bloggerData.email || !bloggerData.password) {
      alert("Please fill in all fields");
      return;
    }

    if (bloggerData.password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }
    
    const userData = { 
      role: "blogger", 
      username: bloggerData.username,
      niche: bloggerData.niche,
      email: bloggerData.email
    };
    
    login(userData);
    onLoginSuccess();
    onClose();
  };

  const handleLogin = () => {
    if (!loginData.email || !loginData.password) {
      alert("Please fill in all fields");
      return;
    }
    
    const userData = { 
      role: "streamer", 
      name: loginData.email.split('@')[0],
      email: loginData.email 
    };
    
    login(userData);
    onLoginSuccess();
    onClose();
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { type: "spring", damping: 25, stiffness: 300 }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8, 
      y: 50,
      transition: { duration: 0.2 }
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0, 
      x: 20,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div 
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-8 relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* CLOSE BUTTON */}
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          onClick={onClose}
        >
          <FaTimes size={24} />
        </motion.button>

        {/* TITLE */}
        <motion.h2 
          key={mode}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-center mb-6 text-gray-900"
        >
          {mode === "choose" && "Join LUMEBLOG"}
          {mode === "streamer" && "Create Your Streamer Account"}
          {mode === "bloggerStep1" && "Blogger Registration – Step 1"}
          {mode === "bloggerStep2" && "Blogger Registration – Step 2"}
          {mode === "login" && "Welcome Back"}
        </motion.h2>

        <AnimatePresence mode="wait">
          {/* CHOOSE USER TYPE */}
          {mode === "choose" && (
            <motion.div
              key="choose"
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex flex-col gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setMode("streamer")}
                className="w-full py-4 border-2 border-green-600 text-green-700 font-semibold rounded-xl hover:bg-green-50 transition-all duration-200 flex items-center justify-center gap-3"
              >
                <FaUser size={20} />
                I am a Streamer
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setMode("bloggerStep1")}
                className="w-full py-4 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-all duration-200 shadow-lg flex items-center justify-center gap-3"
              >
                <FaPen size={20} />
                I am a Blogger
              </motion.button>
              
              <button
                onClick={() => setMode("login")}
                className="text-sm text-gray-600 mt-2 hover:text-green-600 transition-colors"
              >
                Already have an account? <span className="font-semibold">Login</span>
              </button>
            </motion.div>
          )}

          {/* STREAMER SIGNUP */}
          {mode === "streamer" && (
            <motion.div
              key="streamer"
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex flex-col gap-5"
            >
              {/* BACK BUTTON */}
              <motion.button
                whileHover={{ x: -5 }}
                onClick={() => setMode("choose")}
                className="text-sm text-gray-600 hover:text-green-600 transition-colors self-start mb-2 flex items-center gap-2"
              >
                <FaArrowLeft /> Back
              </motion.button>

              {/* STREAMER FORM */}
              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full border border-gray-300 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                  value={streamerData.name}
                  onChange={(e) =>
                    setStreamerData({ ...streamerData, name: e.target.value })
                  }
                />
              </div>

              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full border border-gray-300 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                  value={streamerData.email}
                  onChange={(e) =>
                    setStreamerData({ ...streamerData, email: e.target.value })
                  }
                />
              </div>

              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  placeholder="Password (min. 6 characters)"
                  className="w-full border border-gray-300 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                  value={streamerData.password}
                  onChange={(e) =>
                    setStreamerData({ ...streamerData, password: e.target.value })
                  }
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleStreamerSignup}
                disabled={!streamerData.name || !streamerData.email || !streamerData.password}
                className="w-full py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-all duration-200 shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Create Streamer Account
              </motion.button>

              {/* DIVIDER */}
              <div className="relative flex items-center my-2">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="flex-shrink mx-4 text-gray-500 text-sm">Or continue with</span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>

              {/* SOCIAL LOGIN */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 border border-gray-300 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50 transition-all duration-200 font-medium"
                onClick={() => handleSocialLogin('Google')}
              >
                <FaGoogle className="text-red-500" size={20} />
                Sign up with Google
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 border border-gray-300 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50 transition-all duration-200 font-medium"
                onClick={() => handleSocialLogin('Facebook')}
              >
                <FaFacebook className="text-blue-600" size={20} />
                Sign up with Facebook
              </motion.button>
            </motion.div>
          )}

          {/* BLOGGER STEP 1 */}
          {mode === "bloggerStep1" && (
            <motion.div
              key="bloggerStep1"
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex flex-col gap-4"
            >
              <motion.button
                whileHover={{ x: -5 }}
                onClick={() => setMode("choose")}
                className="text-sm text-gray-600 hover:text-green-600 transition-colors self-start mb-2 flex items-center gap-2"
              >
                <FaArrowLeft /> Back
              </motion.button>

              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Choose a Username"
                  className="w-full border border-gray-300 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                  value={bloggerData.username}
                  onChange={(e) =>
                    setBloggerData({ ...bloggerData, username: e.target.value })
                  }
                />
              </div>

              <div className="relative">
                <FaHashtag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <select
                  className="w-full border border-gray-300 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all appearance-none bg-white"
                  value={bloggerData.niche}
                  onChange={(e) =>
                    setBloggerData({ ...bloggerData, niche: e.target.value })
                  }
                >
                  <option value="">Choose Your Niche</option>
                  <option value="Technology">Technology</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Food">Food</option>
                  <option value="Travel">Travel</option>
                  <option value="Lifestyle">Lifestyle</option>
                  <option value="Health">Health</option>
                  <option value="Business">Business</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setMode("bloggerStep2")}
                disabled={!bloggerData.username || !bloggerData.niche}
                className="w-full py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg"
              >
                Next
              </motion.button>
            </motion.div>
          )}

          {/* BLOGGER STEP 2 */}
          {mode === "bloggerStep2" && (
            <motion.div
              key="bloggerStep2"
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex flex-col gap-4"
            >
              <motion.button
                whileHover={{ x: -5 }}
                onClick={() => setMode("bloggerStep1")}
                className="text-sm text-gray-600 hover:text-green-600 transition-colors self-start mb-2 flex items-center gap-2"
              >
                <FaArrowLeft /> Back
              </motion.button>

              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full border border-gray-300 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                  value={bloggerData.email}
                  onChange={(e) =>
                    setBloggerData({ ...bloggerData, email: e.target.value })
                  }
                />
              </div>

              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  placeholder="Password (min. 6 characters)"
                  className="w-full border border-gray-300 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                  value={bloggerData.password}
                  onChange={(e) =>
                    setBloggerData({ ...bloggerData, password: e.target.value })
                  }
                />
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-800"
              >
                <p className="font-semibold mb-1 flex items-center gap-2">
                  <MdCheckCircle size={18} /> Blogger Agreement
                </p>
                <p className="text-xs">
                  By creating an account, you agree to interact with at least one ad to support the platform.
                </p>
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleBloggerSubmit}
                disabled={!bloggerData.email || !bloggerData.password}
                className="w-full py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg"
              >
                Create Blogger Account
              </motion.button>
            </motion.div>
          )}

          {/* LOGIN */}
          {mode === "login" && (
            <motion.div
              key="login"
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex flex-col gap-4"
            >
              <motion.button
                whileHover={{ x: -5 }}
                onClick={() => setMode("choose")}
                className="text-sm text-gray-600 hover:text-green-600 transition-colors self-start mb-2 flex items-center gap-2"
              >
                <FaArrowLeft /> Back
              </motion.button>

              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full border border-gray-300 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                />
              </div>

              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full border border-gray-300 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogin}
                disabled={!loginData.email || !loginData.password}
                className="w-full py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-all duration-200 shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Login
              </motion.button>

              <p className="text-center text-sm text-gray-600 mt-2">
                Don't have an account?{" "}
                <button
                  onClick={() => setMode("choose")}
                  className="text-green-600 font-semibold hover:underline"
                >
                  Sign up
                </button>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default AuthModal;