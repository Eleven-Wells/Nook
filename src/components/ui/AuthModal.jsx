import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { AnimatePresence, motion } from "framer-motion";
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
  FaCheck,
  FaKey
} from "react-icons/fa";
import { MdCheckCircle } from "react-icons/md";

const AuthModal = ({ onClose, onLoginSuccess }) => {
  const { login, signup, verifyOTP, resendOTP } = useAuth();
  
  const [mode, setMode] = useState("choose");
  const [bloggerData, setBloggerData] = useState({
    username: "",
    niches: [],
    email: "",
    password: "",
    termsAccepted: false,
  });
  
  const [streamerData, setStreamerData] = useState({
    name: "",
    email: "",
    password: "",
    niches: "",
    agreedToTerms: false
  });
  
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  
  const [otpData, setOtpData] = useState({
    userId: "",
    otp: "",
  });
  
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  const displayError = (message) => {
    setError(message);
    setShowError(true);
    setTimeout(() => setShowError(false), 5000);
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const toggleNiche = (niche) => {
    if (bloggerData.niches.includes(niche)) {
      setBloggerData({
        ...bloggerData,
        niches: bloggerData.niches.filter(n => n !== niche)
      });
    } else {
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

  const handleStreamerSignup = async () => {
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
    
    if (!streamerData.niches) {
      displayError("Please select a niche");
      return;
    }
    
    if (!streamerData.agreedToTerms) {
      displayError("You must agree to terms");
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('📤 Sending streamer signup:', {
        email: streamerData.email,
        role: "streamer",
        name: streamerData.name,
        niches: [streamerData.niches]
      });

      const result = await signup({
        email: streamerData.email,
        password: streamerData.password,
        role: "streamer",
        name: streamerData.name,
        username: streamerData.name.split(' ').join('').toLowerCase().replace(/[^a-zA-Z0-9]/g, ''),
        niches: [streamerData.niches], // Array format
        agreedToTerms: streamerData.agreedToTerms
      });

      console.log('✅ Signup result:', result);

      if (result.success && result.userId) {
        setOtpData({ userId: result.userId, otp: "" });
        setMode("verifyOtp");
      } else if (result.needsVerification) {
        setOtpData({ userId: result.userId, otp: "" });
        setMode("verifyOtp");
      } else {
        displayError(result.message || "Signup failed");
      }
    } catch (err) {
      console.error('[AuthModal] Streamer signup error:', err);
      const msg = err.message === "Failed to fetch"
        ? "Network error: Could not connect to the server. Please check your internet connection."
        : (err.message || "Signup failed");
      displayError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBloggerSubmit = async () => {
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
    
    if (!bloggerData.termsAccepted) {
      displayError("You must agree to the terms and conditions");
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('📤 Sending blogger signup:', {
        username: bloggerData.username,
        niches: bloggerData.niches,
        email: bloggerData.email,
        role: "blogger"
      });

      const result = await signup({
        username: bloggerData.username,
        name: bloggerData.username,
        niches: bloggerData.niches,
        email: bloggerData.email,
        password: bloggerData.password,
        role: "blogger",
        agreedToTerms: bloggerData.termsAccepted
      });

      console.log('✅ Signup result:', result);

      if (result.success && result.userId) {
        setOtpData({ userId: result.userId, otp: "" });
        setMode("verifyOtp");
      } else if (result.needsVerification) {
        setOtpData({ userId: result.userId, otp: "" });
        setMode("verifyOtp");
      } else {
        displayError(result.message || "Signup failed");
      }
    } catch (err) {
      console.error('[AuthModal] Blogger signup error:', err);
      const msg = err.message === "Failed to fetch"
        ? "Network error: Connection to server lost. Please check your internet."
        : (err.message || "Signup failed");
      displayError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!loginData.email || !loginData.password) {
      displayError("Please fill in all fields");
      return;
    }
    
    if (!validateEmail(loginData.email)) {
      displayError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('📤 Logging in:', loginData.email);

      const result = await login(loginData.email, loginData.password);

      console.log('✅ Login result:', result);

      if (result.needsVerification) {
        setOtpData({ userId: result.userId, otp: "" });
        setMode("verifyOtp");
      } else if (result.success) {
        onLoginSuccess();
        onClose();
      } else {
        displayError(result.message || "Login failed");
      }
    } catch (err) {
      console.error('[AuthModal] Login error:', err);
      const msg = err.message === "Failed to fetch"
        ? "Network error: Check your internet connection."
        : (err.message || "Login failed");
      displayError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpData.otp || otpData.otp.length < 4) {
      displayError("Please enter the OTP sent to your email");
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('📤 Verifying OTP for user:', otpData.userId);

      const result = await verifyOTP(otpData.userId, otpData.otp);

      console.log('✅ OTP verification result:', result);

      if (result.success) {
        onLoginSuccess();
        onClose();
      } else {
        displayError(result.message || "Verification failed");
      }
    } catch (err) {
      console.error('[AuthModal] OTP verification error:', err);
      displayError(
        err.message === "Failed to fetch" 
          ? "Network error" 
          : (err.message || "Verification failed")
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    
    try {
      console.log('📤 Resending OTP for user:', otpData.userId);

      await resendOTP(otpData.userId);
      
      displayError("OTP resent successfully!");
    } catch (err) {
      console.error('[AuthModal] Resend OTP error:', err);
      displayError(err.message || "Failed to resend OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring", damping: 25, stiffness: 300 }
    },
    exit: { opacity: 0, scale: 0.8, y: 50, transition: { duration: 0.2 } }
  };

  const contentVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: 20, transition: { duration: 0.2 } }
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
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          onClick={onClose}
        >
          <FaTimes size={24} />
        </motion.button>

        <AnimatePresence>
          {showError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3"
            >
              <FaExclamationCircle className="text-red-600 mt-0.5 shrink-0" size={20} />
              <p className="text-red-800 text-sm font-medium">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.h2
          key={mode}
          className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-gray-100"
        >
          {mode === "choose" && "Join Nook"}
          {mode === "streamer" && "Create Your Streamer Account"}
          {mode === "bloggerStep1" && "Blogger Registration – Step 1"}
          {mode === "bloggerStep2" && "Blogger Registration – Step 2"}
          {mode === "login" && "Welcome Back"}
          {mode === "verifyOtp" && "Verify Your Email"}
        </motion.h2>

        <AnimatePresence mode="wait">
          {/* CHOOSE MODE */}
          {mode === "choose" && (
            <motion.div key="choose" variants={contentVariants} className="flex flex-col gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={() => setMode("streamer")}
                className="w-full dark:bg-gray-900 py-4 border-2 hover:border-green-600 border-gray-700 text-green-700 font-semibold rounded-xl hover:bg-green-200 transition-all flex items-center justify-center gap-3"
              >
                <FaUser size={20} /> I am a Streamer
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={() => setMode("bloggerStep1")}
                className="w-full py-4 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-all shadow-lg flex items-center justify-center gap-3"
              >
                <FaPen size={20} /> I am a Blogger
              </motion.button>

              <button
                onClick={() => setMode("login")}
                className="text-sm text-gray-600 mt-2 hover:text-green-600"
              >
                Already have an account? <span className="font-semibold">Login</span>
              </button>
            </motion.div>
          )}

          {/* STREAMER SIGNUP */}
          {mode === "streamer" && (
            <motion.div key="streamer" variants={contentVariants} className="flex flex-col gap-5">
              <button
                onClick={() => setMode("choose")}
                className="text-sm text-gray-600 flex items-center gap-2"
              >
                <FaArrowLeft /> Back
              </button>

              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full border dark:text-gray-100 border-gray-300 rounded-xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  value={streamerData.name}
                  onChange={(e) => setStreamerData({ ...streamerData, name: e.target.value })}
                />
              </div>

              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full border dark:text-gray-100 border-gray-300 rounded-xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  value={streamerData.email}
                  onChange={(e) => setStreamerData({ ...streamerData, email: e.target.value })}
                />
              </div>

              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  placeholder="Password (min. 6 characters)"
                  className="w-full border dark:text-gray-100 border-gray-300 rounded-xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  value={streamerData.password}
                  onChange={(e) => setStreamerData({ ...streamerData, password: e.target.value })}
                />
              </div>

              {/* Streamer Niche Grid */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-100 flex items-center gap-2">
                  <FaHashtag /> Select Your Primary Niche
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
                  {['Technology', 'Fashion', 'Food', 'Travel', 'Lifestyle', 'Health', 'Business'].map((niche) => (
                    <button
                      key={niche}
                      type="button"
                      onClick={() => setStreamerData({ ...streamerData, niches: niche })}
                      className={`p-2 rounded-lg border text-sm transition-all text-center ${
                        streamerData.niches === niche
                          ? 'border-green-600 bg-green-50 text-green-700 font-bold'
                          : 'border-gray-200 dark:border-gray-700 dark:text-gray-300 hover:border-green-400'
                      }`}
                    >
                      {niche}
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={streamerData.agreedToTerms}
                  onChange={(e) => setStreamerData({ ...streamerData, agreedToTerms: e.target.checked })}
                  className="mt-1 w-5 h-5 rounded text-green-600"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  I agree to Terms & Conditions
                </span>
              </label>

              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={handleStreamerSignup}
                className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 shadow-lg disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                disabled={!streamerData.name || !streamerData.email || !streamerData.password || !streamerData.niches || !streamerData.agreedToTerms || isLoading}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Create Streamer Account"
                )}
              </motion.button>
            </motion.div>
          )}

          {/* BLOGGER STEP 1 */}
          {mode === "bloggerStep1" && (
            <motion.div key="bloggerStep1" variants={contentVariants} className="flex flex-col gap-4">
              <button
                onClick={() => setMode("choose")}
                className="text-sm text-gray-600 flex items-center gap-2"
              >
                <FaArrowLeft /> Back
              </button>

              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Choose a Username"
                  className="w-full border dark:text-gray-100 border-gray-300 rounded-xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  value={bloggerData.username}
                  onChange={(e) => setBloggerData({ ...bloggerData, username: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium dark:text-gray-100 mb-3">
                  <FaHashtag className="inline mr-2" />
                  Select Niches (Up to 3)
                </label>
                <div className="grid grid-cols-2 gap-3 max-h-56 overflow-y-auto pr-2">
                  {availableNiches.map((niche) => {
                    const isSelected = bloggerData.niches.includes(niche);
                    return (
                      <button
                        key={niche}
                        type="button"
                        onClick={() => toggleNiche(niche)}
                        className={`p-3 rounded-xl border-2 text-sm transition-all ${
                          isSelected
                            ? 'border-green-600 bg-green-50 text-green-700 font-bold'
                            : 'bg-white dark:bg-gray-900 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-green-400'
                        }`}
                      >
                        {niche}
                      </button>
                    );
                  })}
                </div>
              </div>

              <motion.button
                onClick={() => setMode("bloggerStep2")}
                disabled={!bloggerData.username || bloggerData.niches.length === 0}
                className="w-full py-3 bg-green-600 text-white font-semibold rounded-xl disabled:bg-gray-400 hover:bg-green-700 transition-all"
              >
                Next
              </motion.button>
            </motion.div>
          )}

          {/* BLOGGER STEP 2 */}
          {mode === "bloggerStep2" && (
            <motion.div key="bloggerStep2" variants={contentVariants} className="flex flex-col gap-4">
              <button
                onClick={() => setMode("bloggerStep1")}
                className="text-sm text-gray-600 flex items-center gap-2"
              >
                <FaArrowLeft /> Back
              </button>

              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full border dark:text-gray-100 border-gray-300 rounded-xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  value={bloggerData.email}
                  onChange={(e) => setBloggerData({ ...bloggerData, email: e.target.value })}
                />
              </div>

              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  placeholder="Password (min. 6 characters)"
                  className="w-full border dark:text-gray-100 border-gray-300 rounded-xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  value={bloggerData.password}
                  onChange={(e) => setBloggerData({ ...bloggerData, password: e.target.value })}
                />
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl text-sm text-green-800 dark:text-green-300">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bloggerData.termsAccepted}
                    onChange={(e) => setBloggerData({ ...bloggerData, termsAccepted: e.target.checked })}
                    className="mt-1 w-5 h-5 rounded text-green-600"
                  />
                  <span>
                    <b>Blogger Agreement:</b> By joining, you agree to support the platform by interacting with one ad per session.
                  </span>
                </label>
              </div>

              <motion.button
                onClick={handleBloggerSubmit}
                disabled={!bloggerData.email || !bloggerData.password || !bloggerData.termsAccepted || isLoading}
                className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed flex items-center justify-center shadow-lg"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Create Blogger Account"
                )}
              </motion.button>
            </motion.div>
          )}

          {/* LOGIN */}
          {mode === "login" && (
            <motion.div key="login" variants={contentVariants} className="flex flex-col gap-4">
              <button
                onClick={() => setMode("choose")}
                className="text-sm text-gray-600 flex items-center gap-2"
              >
                <FaArrowLeft /> Back
              </button>

              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full border dark:text-gray-100 border-gray-300 rounded-xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                />
              </div>

              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full border dark:text-gray-100 border-gray-300 rounded-xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                />
              </div>

              <motion.button
                onClick={handleLogin}
                disabled={!loginData.email || !loginData.password || isLoading}
                className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed flex items-center justify-center shadow-lg"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Login"
                )}
              </motion.button>
            </motion.div>
          )}

          {/* VERIFY OTP */}
          {mode === "verifyOtp" && (
            <motion.div key="verifyOtp" variants={contentVariants} className="flex flex-col gap-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaKey className="text-green-600 text-3xl" />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Enter the verification code sent to your email.
                </p>
              </div>

              <input
                type="text"
                placeholder="Enter OTP"
                className="w-full border dark:text-gray-100 border-gray-300 rounded-xl p-3 text-center text-2xl tracking-widest focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                value={otpData.otp}
                onChange={(e) => setOtpData({ ...otpData, otp: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                maxLength={6}
                autoFocus
              />

              <motion.button
                onClick={handleVerifyOtp}
                disabled={otpData.otp.length < 4 || isLoading}
                className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed flex items-center justify-center shadow-lg"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Verify OTP"
                )}
              </motion.button>

              <button
                onClick={handleResendOtp}
                disabled={isLoading}
                className="text-green-600 text-sm font-semibold hover:text-green-700 disabled:text-gray-400"
              >
                {isLoading ? "Sending..." : "Resend Code"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default AuthModal;