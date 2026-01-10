import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaUser, 
  FaCamera, 
  FaEnvelope, 
  FaLock,
  FaBell,
  FaShieldAlt,
  FaPalette,
  FaSave,
  FaExclamationCircle,
  FaCheckCircle
} from 'react-icons/fa';
import { MdEdit } from 'react-icons/md';

const StreamerProfile = () => {
  const { user, isLoggedIn, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    name: user?.name || user?.email?.split('@')[0] || '',
    email: user?.email || '',
    bio: user?.bio || '',
    location: user?.location || '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const profileImageInputRef = useRef(null);
  const coverImageInputRef = useRef(null);
  const [uploadingProfile, setUploadingProfile] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  React.useEffect(() => {
    if (!isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: FaUser },
    { id: 'security', label: 'Security', icon: FaShieldAlt },
    { id: 'notifications', label: 'Notifications', icon: FaBell },
    { id: 'appearance', label: 'Appearance', icon: FaPalette },
  ];

  const handleInputChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSave = () => {
    updateProfile(profileData);
    setSuccess('Profile updated successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handlePasswordUpdate = () => {
    setError('');
    setSuccess('');

    // Validation
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setError('Please fill in all password fields');
      return;
    }

    // Check if current password matches
    if (user?.password !== passwordData.currentPassword) {
      setError('Current password is incorrect');
      return;
    }

    // Check if new password meets requirements
    if (passwordData.newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      return;
    }

    // Check if passwords match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    // Check if new password is different from current
    if (passwordData.currentPassword === passwordData.newPassword) {
      setError('New password must be different from current password');
      return;
    }

    // Update password
    updateProfile({ password: passwordData.newPassword });

    // Clear password fields
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });

    setSuccess('Password updated successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleImageUpload = (e, type) => {
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

    if (type === 'profile') {
      setUploadingProfile(true);
    } else {
      setUploadingCover(true);
    }

    const reader = new FileReader();
    
    reader.onloadend = () => {
      if (type === 'profile') {
        updateProfile({ profileImage: reader.result });
        setUploadingProfile(false);
      } else {
        updateProfile({ coverImage: reader.result });
        setUploadingCover(false);
      }
    };

    reader.onerror = () => {
      alert('Failed to upload image');
      if (type === 'profile') {
        setUploadingProfile(false);
      } else {
        setUploadingCover(false);
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header with Cover Photo */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-2xl shadow-lg h-48 mb-8 overflow-hidden"
        >
          {user?.coverImage ? (
            <img 
              src={user.coverImage} 
              alt="Cover" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-green-400 to-green-600" />
          )}
          <div className="absolute inset-0 bg-black/20"></div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => coverImageInputRef.current?.click()}
            disabled={uploadingCover}
            className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg text-gray-900 font-medium flex items-center gap-2 hover:bg-white transition-all disabled:bg-gray-300"
          >
            {uploadingCover ? (
              <>
                <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <FaCamera /> Change Cover
              </>
            )}
          </motion.button>
          <input
            ref={coverImageInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, 'cover')}
            className="hidden"
          />
        </motion.div>

        {/* Profile Picture Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 -mt-24 mb-8 relative z-10"
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-4xl font-bold shadow-xl overflow-hidden">
                {user?.profileImage ? (
                  <img 
                    src={user.profileImage} 
                    alt={profileData.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  profileData.name.charAt(0).toUpperCase()
                )}
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => profileImageInputRef.current?.click()}
                disabled={uploadingProfile}
                className="absolute bottom-0 right-0 bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700 transition-all disabled:bg-gray-400"
              >
                {uploadingProfile ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <FaCamera size={16} />
                )}
              </motion.button>
              <input
                ref={profileImageInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'profile')}
                className="hidden"
              />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold dark:text-gray-100 text-gray-900 mb-2">{profileData.name}</h1>
              <p className="text-gray-600 dark:text-gray-200 mb-4">{profileData.email}</p>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                  Streamer
                </span>
                <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                  Member since 2024
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white dark:bg-white/10 border border-white/5 backdrop-blur-lg rounded-2xl shadow-lg p-6 sticky top-24">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <motion.button
                    key={tab.id}
                    whileHover={{ x: 5 }}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setError('');
                      setSuccess('');
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                      activeTab === tab.id
                        ? 'bg-green-100 text-green-700'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:text-gray-900'
                    }`}
                  >
                    <tab.icon size={20} />
                    {tab.label}
                  </motion.button>
                ))}
              </nav>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            
            {/* Error/Success Messages */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3"
              >
                <FaExclamationCircle className="text-red-600 mt-0.5 flex-shrink-0" size={20} />
                <p className="text-red-800 text-sm font-medium">{error}</p>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3"
              >
                <FaCheckCircle className="text-green-600 mt-0.5 flex-shrink-0" size={20} />
                <p className="text-green-800 text-sm font-medium">{success}</p>
              </motion.div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white  dark:bg-white/10 border border-white/5 backdrop-blur-lg rounded-2xl shadow-lg p-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 ">Personal Information</h2>
                  <MdEdit className="text-gray-400" size={24} />
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium dark:text-gray-100 text-gray-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <FaUser className="absolute left-4 top-1/2 -translate-y-1/2  text-gray-400" />
                      <input
                        type="text"
                        name="name"
                        value={profileData.name}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-3 border dark:text-gray-500 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                        placeholder="Enter your name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium dark:text-gray-100 text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-3 border dark:text-gray-500 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium dark:text-gray-100 text-gray-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={profileData.bio}
                      onChange={handleInputChange}
                      rows="4"
                      className="w-full px-4 py-3 border dark:text-gray-100 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all resize-none"
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium dark:text-gray-100 text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={profileData.location}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border dark:text-gray-500 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                      placeholder="City, Country"
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    className="w-full py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    <FaSave /> Save Changes
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-2xl shadow-lg p-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Security Settings</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="password"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                        placeholder="Enter current password"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                        placeholder="Enter new password (min. 6 characters)"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                        placeholder="Confirm new password"
                      />
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handlePasswordUpdate}
                    className="w-full py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    <FaSave /> Update Password
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Other Tabs */}
            {(activeTab === 'notifications' || activeTab === 'appearance') && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-2xl shadow-lg p-8 text-center"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {tabs.find(tab => tab.id === activeTab)?.label}
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

export default StreamerProfile;