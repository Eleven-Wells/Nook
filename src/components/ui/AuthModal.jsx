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
  FaHashtag,
  FaExclamationCircle,
  FaCheck
} from "react-icons/fa";
import { MdCheckCircle } from "react-icons/md";

const AuthModal = ({ onClose, onLoginSuccess }) => {
  const { login } = useAuth();
  const [mode, setMode] = useState("choose");
  const [bloggerData, setBloggerData] = useState({
    username: "",
    niches: [], // Changed from niche to niches (array)
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
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);

  const availableNiches = [
    'Technology',
    'Fashion',
    'Food',
    'Travel',
    'Lifestyle',
    'Health',
    'Business',
    'Entertainment',
    'Sports',
    'Art & Design',
    'Finance',
    'Education'
  ];

  // Show error with animation
  const displayError = (message) => {
    setError(message);
    setShowError(true);
    setTimeout(() => setShowError(false), 5000);
  };

  // Validate email format
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Handle niche selection
  const toggleNiche = (niche) => {
    if (bloggerData.niches.includes(niche)) {
      // Remove niche if already selected
      setBloggerData({
        ...bloggerData,
        niches: bloggerData.niches.filter(n => n !== niche)
      });
    } else {
      // Add niche if not selected and less than 3
      if (bloggerData.niches.length < 3) {
        setBloggerData({
          ...bloggerData,
          niches: [...bloggerData.niches, niche]
        });
      } else {
        displayError("You can only select up to 3 niches");
      }
    }
  };

  const handleStreamerSignup = () => {
    if (!streamerData.name || !streamerData.email || !streamerData.password) {
      displayError("Please fill in all fields");
      return;
    }

    if (!validateEmail(streamerData.email)) {
      displayError("Please enter a valid email address");
      return;
    }

    if (streamerData.password.length < 6) {
      displayError("Password must be at least 6 characters");
      return;
    }

    const existingUsers = JSON.parse(localStorage.getItem('users')) || [];
    const userExists = existingUsers.find(u => u.email === streamerData.email);
    
    if (userExists) {
      displayError("An account with this email already exists. Please login instead.");
      setTimeout(() => setMode("login"), 2000);
      return;
    }
    
    const userData = { 
      role: "streamer", 
      name: streamerData.name,
      email: streamerData.email,
      password: streamerData.password
    };
    
    existingUsers.push(userData);
    localStorage.setItem('users', JSON.stringify(existingUsers));
    
    login(userData);
    onLoginSuccess();
    onClose();
  };

  const handleSocialLogin = (provider) => {
    const email = prompt(`Enter your ${provider} email to continue (Demo Mode):`);
    
    if (!email) {
      return;
    }

    if (!validateEmail(email)) {
      displayError("Please enter a valid email address");
      return;
    }

    const existingUsers = JSON.parse(localStorage.getItem('users')) || [];
    const existingUser = existingUsers.find(u => u.email === email);

    if (existingUser) {
      login(existingUser);
      onLoginSuccess();
      onClose();
    } else {
      const name = prompt(`Welcome! Please enter your full name:`);
      
      if (!name || name.trim() === "") {
        displayError("Name is required to create an account");
        return;
      }

      const userData = { 
        role: "streamer", 
        name: name.trim(),
        email: email,
        provider: provider,
        password: `${provider}_${Date.now()}`
      };
      
      existingUsers.push(userData);
      localStorage.setItem('users', JSON.stringify(existingUsers));
      
      login(userData);
      onLoginSuccess();
      onClose();
    }
  };

  const handleBloggerSubmit = () => {
    if (!bloggerData.username || bloggerData.niches.length === 0 || !bloggerData.email || !bloggerData.password) {
      displayError("Please fill in all fields");
      return;
    }

    if (!validateEmail(bloggerData.email)) {
      displayError("Please enter a valid email address");
      return;
    }

    if (bloggerData.password.length < 6) {
      displayError("Password must be at least 6 characters");
      return;
    }

    const existingUsers = JSON.parse(localStorage.getItem('users')) || [];
    const userExists = existingUsers.find(u => u.email === bloggerData.email);
    
    if (userExists) {
      displayError("An account with this email already exists. Please login instead.");
      setTimeout(() => setMode("login"), 2000);
      return;
    }
    
    const userData = { 
      role: "blogger", 
      username: bloggerData.username,
      niches: bloggerData.niches, // Array of niches
      email: bloggerData.email,
      password: bloggerData.password
    };
    
    existingUsers.push(userData);
    localStorage.setItem('users', JSON.stringify(existingUsers));
    
    login(userData);
    onLoginSuccess();
    onClose();
  };

  const handleLogin = () => {
    if (!loginData.email || !loginData.password) {
      displayError("Please fill in all fields");
      return;
    }

    if (!validateEmail(loginData.email)) {
      displayError("Please enter a valid email address");
      return;
    }

    const existingUsers = JSON.parse(localStorage.getItem('users')) || [];
    const user = existingUsers.find(u => u.email === loginData.email);
    
    if (!user) {
      displayError("No account found with this email. Would you like to sign up?");
      setTimeout(() => setMode("choose"), 2500);
      return;
    }

    if (user.password !== loginData.password) {
      displayError("Incorrect password. Please try again.");
      return;
    }

    login(user);
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
        className="bg-white dark:bg-gray-950 w-full max-w-lg rounded-2xl shadow-2xl p-8 relative max-h-[90vh] overflow-y-auto"
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

        {/* ERROR MESSAGE */}
        <AnimatePresence>
          {showError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3"
            >
              <FaExclamationCircle className="text-red-600 mt-0.5 flex-shrink-0" size={20} />
              <p className="text-red-800 text-sm font-medium">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* TITLE */}
        <motion.h2 
          key={mode}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-gray-100"
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
                className="w-full dark:bg-gray-900 py-4 border-2 hover:border-green-600 border-gray-700 text-green-700 font-semibold rounded-xl hover:bg-green-200 transition-all duration-200 flex items-center justify-center gap-3"
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
                  placeholder="Full Name"
                  className="w-full border dark:text-gray-100 border-gray-300 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
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
                  className="w-full border dark:text-gray-100 border-gray-300 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
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
                  className="w-full border dark:text-gray-100 border-gray-300 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
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

              <div className="relative flex items-center my-2">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="flex-shrink mx-4 text-gray-500 text-sm">Or continue with</span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 border dark:text-gray-100 dark:hover:text-black border-gray-300 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50 transition-all duration-200 font-medium"
                onClick={() => handleSocialLogin('Google')}
              >
                <FaGoogle className="text-red-500" size={20} />
                Sign up with Google
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 border dark:text-gray-100 dark:hover:text-black border-gray-300 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50 transition-all duration-200 font-medium"
                onClick={() => handleSocialLogin('Facebook')}
              >
                <FaFacebook className="text-blue-600" size={20} />
                Sign up with Facebook
              </motion.button>
            </motion.div>
          )}

          {/* BLOGGER STEP 1 - Multi-Select Niches */}
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
                  className="w-full border dark:text-gray-100 border-gray-300 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                  value={bloggerData.username}
                  onChange={(e) =>
                    setBloggerData({ ...bloggerData, username: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-3">
                  <FaHashtag className="inline mr-2" />
                  Select Your Niches (Choose up to 3)
                </label>
                
                {/* Selected Count */}
                <div className="mb-3 text-sm text-gray-600 dark:text-gray-100">
                  Selected: <span className="font-semibold text-green-700">{bloggerData.niches.length}/3</span>
                </div>

                {/* Niche Grid */}
                <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-2">
                  {availableNiches.map((niche) => {
                    const isSelected = bloggerData.niches.includes(niche);
                    return (
                      <motion.button
                        key={niche}
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleNiche(niche)}
                        className={`relative p-3 rounded-xl border-2 font-medium text-sm transition-all ${
                          isSelected
                            ? 'border-green-600 bg-green-50 text-green-700'
                            : 'bg-white text-gray-700 hover:border-green-400'
                        }`}
                      >
                        {niche}
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-green-600 rounded-full flex items-center justify-center"
                          >
                            <FaCheck className="text-white" size={12} />
                          </motion.div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setMode("bloggerStep2")}
                disabled={!bloggerData.username || bloggerData.niches.length === 0}
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
                className="text-sm text-gray-600 dark:text-gray-100 hover:text-green-600 transition-colors self-start mb-2 flex items-center gap-2"
              >
                <FaArrowLeft /> Back
              </motion.button>

              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full border border-gray-300 dark:text-gray-100 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
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
                  className="w-full border border-gray-300 dark:text-gray-100 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
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
                  className="w-full border dark:text-gray-100 border-gray-300 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                />
              </div>

              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full border dark:text-gray-100 border-gray-300 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
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