import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { 
  FaGoogle, 
  FaFacebook, 
  FaEnvelope, 
  FaUser, 
  FaLock,
  FaTimes,
  FaExclamationCircle,
  FaCheckCircle,
  FaPen,
  FaCheck
} from 'react-icons/fa';

const AuthModal = ({ onClose, onLoginSuccess }) => {
  const { signup, login, verifyOTP, resendOTP } = useAuth();

  // UI State
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState('streamer');
  const [currentStep, setCurrentStep] = useState('auth'); // 'auth' | 'otp'
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Streamer Data
  const [streamerData, setStreamerData] = useState({
    name: ''
  });

  // Blogger Data
  const [bloggerData, setBloggerData] = useState({
    username: '',
    niches: [],
    agreedToTerms: false
  });

  // OTP State
  const [otpUserId, setOtpUserId] = useState(null);
  const [otpEmail, setOtpEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');

  // Available niches
  const availableNiches = [
    'Technology', 'Fashion', 'Food', 'Travel', 
    'Lifestyle', 'Health', 'Business', 'Entertainment',
    'Sports', 'Art & Design', 'Finance', 'Education'
  ];

  // Toggle niche selection
  const toggleNiche = (niche) => {
    if (bloggerData.niches.includes(niche)) {
      setBloggerData({
        ...bloggerData,
        niches: bloggerData.niches.filter(n => n !== niche)
      });
    } else {
      if (bloggerData.niches.length >= 3) {
        setError('You can select a maximum of 3 niches');
        setTimeout(() => setError(''), 3000);
        return;
      }
      setBloggerData({
        ...bloggerData,
        niches: [...bloggerData.niches, niche]
      });
    }
  };

  // Handle Signup
  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    // Role-specific validation
    if (userType === 'streamer' && !streamerData.name.trim()) {
      setError('Please enter your name');
      return;
    }

    if (userType === 'blogger') {
      if (!bloggerData.username.trim()) {
        setError('Please enter a username');
        return;
      }
      if (bloggerData.niches.length === 0) {
        setError('Please select at least one niche');
        return;
      }
      if (!bloggerData.agreedToTerms) {
        setError('Please agree to the terms and conditions');
        return;
      }
    }

    setLoading(true);

    try {
      // Prepare signup data matching backend expectations
      const signupData = {
        email,
        password,
        role: userType,
        name: userType === 'streamer' ? streamerData.name : (bloggerData.username || ''),
        username: userType === 'blogger' ? bloggerData.username : '',
        niches: userType === 'blogger' ? bloggerData.niches : [],
        agreedToTerms: true
      };

      console.log('📤 Sending signup request:', signupData);

      const result = await signup(signupData);
      
      setLoading(false);

      if (result.success) {
        setOtpUserId(result.userId);
        setOtpEmail(result.email || email);
        setCurrentStep('otp');
        setSuccess('OTP sent to your email!');
      } else {
        if (result.errorCode === 'EMAIL_EXISTS') {
          setError('This email is already registered. Please login instead.');
          setTimeout(() => {
            setIsLogin(true);
            setError('');
          }, 2500);
        } else if (result.errorCode === 'USERNAME_EXISTS') {
          setError('This username is already taken. Please choose another.');
        } else {
          setError(result.message || 'Signup failed. Please try again.');
        }
      }
    } catch (err) {
      setLoading(false);
      console.error('❌ Signup error:', err);
      setError('Network error. Please check your connection and try again.');
    }
  };

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }

    setLoading(true);
    
    try {
      const result = await login(email, password);
      setLoading(false);

      if (result.success) {
        setSuccess('Login successful!');
        setTimeout(() => {
          onLoginSuccess();
        }, 500);
      } else {
        if (result.needsVerification) {
          // Automatically reopen OTP modal
          setOtpUserId(result.userId);
          setOtpEmail(result.email || email);
          setCurrentStep('otp');
          setError('');
          setSuccess('Please verify your email. OTP has been resent.');
        } else {
          setError(result.message || 'Login failed. Please try again.');
        }
      }
    } catch (err) {
      setLoading(false);
      console.error('❌ Login error:', err);
      setError('Network error. Please check your connection and try again.');
    }
  };

  // Handle OTP Verification
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (otpCode.length !== 6) {
      setError('Please enter the 6-digit code');
      return;
    }

    setLoading(true);
    
    try {
      const result = await verifyOTP(otpUserId, otpCode);
      setLoading(false);

      if (result.success) {
        setSuccess('Email verified successfully!');
        setTimeout(() => {
          onLoginSuccess();
        }, 500);
      } else {
        if (result.errorCode === 'INVALID_OTP') {
          setError('Invalid OTP code. Please check and try again.');
        } else if (result.errorCode === 'OTP_EXPIRED') {
          setError('OTP has expired. Please request a new one.');
        } else {
          setError(result.message || 'Verification failed. Please try again.');
        }
      }
    } catch (err) {
      setLoading(false);
      console.error('❌ OTP verification error:', err);
      setError('Network error. Please check your connection and try again.');
    }
  };

  // Handle Resend OTP
  const handleResendOTP = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const result = await resendOTP(otpUserId);
      setLoading(false);

      if (result.success) {
        setSuccess('New OTP sent to your email!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.message || 'Failed to resend OTP. Please try again.');
      }
    } catch (err) {
      setLoading(false);
      console.error('❌ Resend OTP error:', err);
      setError('Network error. Please check your connection and try again.');
    }
  };

  // Reset to main auth screen
  const resetToAuth = () => {
    setCurrentStep('auth');
    setError('');
    setSuccess('');
    setOtpCode('');
  };

  // Animations
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { type: 'spring', damping: 25, stiffness: 300 }
    },
    exit: { opacity: 0, scale: 0.8, y: 50 }
  };

  return (
    <AnimatePresence>
      <motion.div
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full my-8 relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
          >
            <FaTimes size={24} />
          </button>

          {/* MAIN AUTH SCREEN */}
          {currentStep === 'auth' && (
            <div className="p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {isLogin ? 'Welcome Back!' : 'Join LUMEBLOG'}
                </h2>
                <p className="text-gray-600">
                  {isLogin 
                    ? 'Login to continue your journey' 
                    : 'Create an account to get started'}
                </p>
              </div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2"
                  >
                    <FaExclamationCircle className="text-red-600 mt-0.5 flex-shrink-0" />
                    <p className="text-red-800 text-sm">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Success Message */}
              <AnimatePresence>
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl flex items-start gap-2"
                  >
                    <FaCheckCircle className="text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-green-800 text-sm">{success}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* User Type Selection (Signup Only) */}
              {!isLogin && (
                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-3 font-medium">I want to join as:</p>
                  <div className="grid grid-cols-2 gap-3">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setUserType('streamer')}
                      className={`py-3 px-4 rounded-xl font-semibold transition-all ${
                        userType === 'streamer'
                          ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      📚 Reader
                    </motion.button>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setUserType('blogger')}
                      className={`py-3 px-4 rounded-xl font-semibold transition-all ${
                        userType === 'blogger'
                          ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <FaPen className="inline mr-2" size={14} />
                      Blogger
                    </motion.button>
                  </div>
                </div>
              )}

              {/* Auth Form */}
              <form onSubmit={isLogin ? handleLogin : handleSignup}>
                
                {/* Streamer Name (Signup Only) */}
                {!isLogin && userType === 'streamer' && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={streamerData.name}
                        onChange={(e) => setStreamerData({ ...streamerData, name: e.target.value })}
                        placeholder="Enter your name"
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                )}

                {/* Blogger Username (Signup Only) */}
                {!isLogin && userType === 'blogger' && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Username
                    </label>
                    <div className="relative">
                      <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={bloggerData.username}
                        onChange={(e) => setBloggerData({ ...bloggerData, username: e.target.value })}
                        placeholder="Choose a username"
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                )}

                {/* Email */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    />
                  </div>
                  {!isLogin && (
                    <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
                  )}
                </div>

                {/* Blogger Niches (Signup Only) */}
                {!isLogin && userType === 'blogger' && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Your Niches (1-3)
                      <span className="ml-2 text-green-600 text-xs font-bold">
                        Selected: {bloggerData.niches.length}/3
                      </span>
                    </label>
                    <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 border border-gray-200 rounded-xl bg-gray-50">
                      {availableNiches.map((niche) => {
                        const isSelected = bloggerData.niches.includes(niche);
                        return (
                          <motion.button
                            key={niche}
                            type="button"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => toggleNiche(niche)}
                            className={`relative py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                              isSelected
                                ? 'bg-green-100 text-green-700 border-2 border-green-500 shadow-sm'
                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                            }`}
                          >
                            {niche}
                            {isSelected && (
                              <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute -top-1 -right-1 w-5 h-5 bg-green-600 text-white rounded-full flex items-center justify-center text-xs shadow-md"
                              >
                                <FaCheck size={10} />
                              </motion.span>
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Blogger Terms (Signup Only) */}
                {!isLogin && userType === 'blogger' && (
                  <div className="mb-6">
                    <label className="flex items-start gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={bloggerData.agreedToTerms}
                        onChange={(e) => setBloggerData({ ...bloggerData, agreedToTerms: e.target.checked })}
                        className="mt-1 w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      />
                      <span className="text-sm text-gray-600">
                        I agree to the{' '}
                        <a href="#" className="text-green-600 hover:underline font-medium">
                          Terms and Conditions
                        </a>
                      </span>
                    </label>
                  </div>
                )}

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {isLogin ? 'Logging in...' : 'Creating account...'}
                    </div>
                  ) : (
                    isLogin ? 'Login' : 'Create Account'
                  )}
                </motion.button>
              </form>

              {/* Toggle Login/Signup */}
              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setError('');
                      setSuccess('');
                    }}
                    className="text-green-600 font-semibold hover:underline"
                  >
                    {isLogin ? 'Sign up' : 'Login'}
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* OTP VERIFICATION SCREEN */}
          {currentStep === 'otp' && (
            <div className="p-8">
              {/* Back Button */}
              <button
                onClick={resetToAuth}
                className="mb-4 text-gray-600 hover:text-gray-800 flex items-center gap-2 font-medium"
              >
                ← Back
              </button>

              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaEnvelope className="text-green-600" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Verify Your Email
                </h3>
                <p className="text-gray-600">
                  We've sent a 6-digit code to
                </p>
                <p className="text-green-600 font-semibold">{otpEmail}</p>
              </div>

              {/* Error/Success Messages */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2"
                  >
                    <FaExclamationCircle className="text-red-600 mt-0.5 flex-shrink-0" />
                    <p className="text-red-800 text-sm">{error}</p>
                  </motion.div>
                )}
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl flex items-start gap-2"
                  >
                    <FaCheckCircle className="text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-green-800 text-sm">{success}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleVerifyOTP}>
                <input
                  type="text"
                  maxLength="6"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl mb-4 text-center text-3xl tracking-[0.5em] font-bold focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  autoFocus
                />

                <motion.button
                  type="submit"
                  disabled={loading || otpCode.length !== 6}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed mb-4"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Verifying...
                    </div>
                  ) : (
                    'Verify Email'
                  )}
                </motion.button>

                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={loading}
                  className="w-full text-green-600 hover:text-green-700 font-medium hover:underline disabled:text-gray-400 disabled:no-underline"
                >
                  {loading ? 'Sending...' : 'Resend OTP'}
                </button>
              </form>

              <p className="text-xs text-gray-500 text-center mt-4">
                Code expires in 10 minutes
              </p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AuthModal;