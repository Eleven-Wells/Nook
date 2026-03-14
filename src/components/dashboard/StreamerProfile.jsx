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
  FaCheckCircle,
  FaDollarSign,
  FaChartBar,
  FaSignOutAlt,
  FaMoneyBillWave,
} from 'react-icons/fa';
import { MdEdit } from 'react-icons/md';
import MonetizationTab from "./MonetizationTab";

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
    { id: 'monetization', label: 'Monetization', icon: FaDollarSign },
    { id: 'analytics', label: 'Analytics', icon: FaChartBar },
  ];
  
  const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            logout();
            setIsOpen(false);
            navigate('/');
        }
    };
  const handleInputChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };
  const [isEditing, setIsEditing] = useState(false);

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
    <div className="flex min-h-screen transition-colors duration-300 dark:bg-[#0B0F15] bg-
    [f5f7fa] dark:text-gray-200 text-gray-600 pb-12">

{/* DESKTOP SIDEBAR - Visible only on md screens and up */}
  <aside className="hidden md:flex w-64 flex-col border-r dark:border-white/10 border-gray-200 dark:bg-[#13171F] bg-gray-400/10 p-6 space-y-8 transition-colors">
    
    <nav className="space-y-1">
      <p className="text-[10px] font-bold text-gray-600 dark:text-gray-500 uppercase tracking-[0.2em] mb-4 px-2">Account</p>
      {[
        { id: 'profile', icon: <FaUser />, label: 'Profile' },
        { id: 'security', icon: <FaLock />, label: 'Security' },
        { id: 'notifications', icon: <FaBell />, label: 'Notifications', count: 3 },
        { id: 'appearance', icon: <FaPalette />, label: 'Appearance' },
      ].map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveTab(item.id)}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
            activeTab === item.id ? 'bg-[#1A8749]/10 text-[#22c55e] border border-green-200 dark:border-white/10' 
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/5'
          }`}
        >
          <div className="flex items-center gap-3">
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </div>
          {item.count && (
            <span className="bg-[#22c55e] text-white dark:text-[#0B0F15] text-[10px] font-bold px-2 py-0.5 rounded-full">
              {item.count}
            </span>
          )}
        </button>
      ))}
    </nav>

    <div className="pt-4 space-y-1">
      <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-4 px-2">Creator</p>
       {[
        { id: 'monetization', icon: <FaDollarSign />, label: 'Monetization' },
        { id: 'analytics', icon: <FaChartBar />, label: 'Analytics' },
      ].map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveTab(item.id)}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
            activeTab === item.id ? 'bg-[#1A8749]/10 text-[#22c55e] border border-green-200 dark:border-white/10' 
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/5'
          }`}
        >
          <div className="flex items-center gap-3">
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </div>
          {item.count && (
            <span className="bg-[#22c55e] text-[#0B0F15] text-[10px] font-bold px-2 py-0.5 rounded-full">
              {item.count}
            </span>
          )}
        </button>
      ))}
    </div>

     <motion.button
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleLogout} className=" flex items-center gap-3 px-4 py-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all font-bold uppercase text-xs tracking-widest border dark:border-white/10 border-gray-100">
      <FaSignOutAlt /> Logout
    </motion.button>
  </aside>

      <div className="flex-1 p-4 md:p-10 max-w-5xl mx-auto w-full">
        
        {/* Profile Header Card (Cover + Info) */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="dark:bg-[#13171F] bg-gray-400/10 rounded-2xl shadow-xl overflow-hidden mb-8 border dark:border-white/10 border-gray-200 transition-colors"
        >
          {/* Cover Photo Section */}
          <div className="relative h-40 w-full group">
            {user?.coverImage ? (
              <img 
                src={user.coverImage} 
                alt="Cover" 
                className="w-full h-full object-cover"
              />
            ) : (
              // Green pattern background placeholder
              <div className="w-full h-full bg-[#1A8749] opacity-90" style={{ backgroundImage: 'radial-gradient(#22c55e 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
            )}
            <div className="absolute inset-0 bg-black/10"></div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => coverImageInputRef.current?.click()}
              disabled={uploadingCover}
              className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg text-white text-sm font-medium flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {uploadingCover ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <><FaCamera /> Edit Cover</>
              )}
            </motion.button>
            <input
              ref={coverImageInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, 'cover')}
              className="hidden"
            />
          </div>

          {/* Profile Info Section */}
          <div className="px-8 pb-8 relative flex flex-col md:flex-row gap-6 items-start md:items-center">
            {/* Avatar overlapping the banner */}
            <div className="relative -mt-16">
              <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-[#00d2ff] to-[#3a7bd5] flex items-center justify-center text-[#0B0F15] text-4xl font-black shadow-xl overflow-hidden border-4 border-gray-400/10 dark:border-[#13171F]">
                {user?.profileImage ? (
                  <img 
                    src={user.profileImage} 
                    alt={profileData?.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  profileData?.name?.charAt(0).toUpperCase() || 'F'
                )}
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => profileImageInputRef.current?.click()}
                disabled={uploadingProfile}
                className="absolute bottom-0 right-0 bg-[#1A8749] text-white p-2 rounded-full shadow-lg hover:bg-green-600 transition-all disabled:bg-gray-600"
              >
                {uploadingProfile ? (
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <FaCamera size={12} />
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

            {/* Name and Badges */}
            <div className="flex-1 mt-2 md:mt-0">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{profileData?.name || 'funmibi'}</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">{profileData?.email || 'abiodunfunmibi17@gmail.com'}</p>
              <div className="flex flex-wrap gap-3">
                <span className="px-3 py-1 bg-green-100 dark:bg-[#1A8749]/20 text-[#22c55e] border dark:border-[#1A8749]/30 border-green-300 rounded-full text-xs font-semibold">
                  Streamer
                </span>
                <span className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-xs font-semibold">
                  Member since 2024
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Horizontal Tabs */}
        <div className="flex overflow-x-auto border-b border-gray-200 dark:border-gray-800 mb-8 hide-scrollbar">
          <div className="flex gap-8 px-2">
            {tabs?.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (setError) setError('');
                  if (setSuccess) setSuccess('');
                }}
                className={`pb-4 text-sm font-medium transition-all whitespace-nowrap border-b-2 ${
                  activeTab === tab.id
                    ? 'border-[#22c55e] text-[#22c55e]'
                    : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
            <FaExclamationCircle className="text-red-500 mt-0.5 flex-shrink-0" size={20} />
            <p className="text-red-400 text-sm font-medium">{error}</p>
          </motion.div>
        )}

        {success && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-start gap-3">
            <FaCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" size={20} />
            <p className="text-green-400 text-sm font-medium">{success}</p>
          </motion.div>
        )}

        {/* Tab Content Area */}
        <div>
       {/* Profile Tab */}
{activeTab === 'profile' && (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="bg-white dark:bg-[#13171F] rounded-2xl p-8 border border-gray-200 dark:border-white/10 shadow-2xl relative transition-colors duration-300"
  >
    {/* Section Header */}
    <div className="flex items-center justify-between mb-10">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
        Personal Information
      </h2>
      
      {!isEditing && (
        <button 
          onClick={() => setIsEditing(true)}
          className="flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-[#13171F] border border-gray-200 dark:border-gray-700 px-4 py-2 rounded-lg hover:text-[#22c55e] dark:hover:text-green-500 hover:border-[#22c55e] dark:hover:border-green-600 transition-all uppercase tracking-widest"
        >
          <MdEdit size={16} /> Edit Profile
        </button>
      )}
    </div>

    {/* Form Fields Stack */}
    <div className="space-y-6">
      {[
        { label: 'Full Name', name: 'name', type: 'text', placeholder: 'Your Name' },
        { label: 'Username', name: 'username', type: 'text', placeholder: 'username', isUsername: true },
        { label: 'Email Address', name: 'email', type: 'email', placeholder: 'email@example.com' },
        { label: 'Bio', name: 'bio', type: 'textarea', placeholder: 'Tell us about yourself' },
        { label: 'Location', name: 'location', type: 'text', placeholder: 'City, Country' }
      ].map((field) => (
        <div key={field.name} className="group">
          <label className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-2 px-1">
            {field.label}
          </label>
          
          <div className={`transition-all duration-300 rounded-xl ${
            isEditing 
              ? "bg-gray-50 dark:bg-white/[0.03] border-l-2 border-transparent focus-within:border-[#22c55e] dark:focus-within:border-green-500 focus-within:bg-gray-100 dark:focus-within:bg-white/[0.06]" 
              : "bg-transparent border-l-2 border-transparent"
          }`}>
            <div className="border-b border-gray-200 dark:border-gray-800/50 pb-3 flex items-center px-1">
              {field.isUsername && (
                <span className="text-gray-400 dark:text-gray-600 mr-1 text-lg font-medium">@</span>
              )}
              
              {field.type === 'textarea' ? (
                <textarea
                  name={field.name}
                  readOnly={!isEditing}
                  value={profileData?.[field.name] || ''}
                  onChange={handleInputChange}
                  rows="2"
                  className={`w-full bg-transparent text-gray-900 dark:text-white text-base focus:outline-none transition-all resize-none p-2 ${
                    isEditing ? "text-[#1A8749] dark:text-green-400 cursor-text" : "cursor-default overflow-hidden"
                  }`}
                  placeholder={field.placeholder}
                />
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  readOnly={!isEditing}
                  value={profileData?.[field.name] || ''}
                  onChange={handleInputChange}
                  className={`w-full bg-transparent text-gray-900 dark:text-white text-lg font-medium focus:outline-none transition-all p-2 ${
                    isEditing ? "text-[#1A8749] dark:text-green-400 cursor-text" : "cursor-default"
                  }`}
                  placeholder={field.placeholder}
                />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Action Buttons */}
    {isEditing && (
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-end items-center gap-8 mt-12 pt-8 border-t border-gray-100 dark:border-gray-800/50"
      >
        <button 
          onClick={() => setIsEditing(false)}
          className="text-xs font-bold text-gray-400 hover:text-gray-900 dark:hover:text-white uppercase tracking-[0.2em] transition-colors"
        >
          Cancel
        </button>
        <button 
          onClick={() => {
            handleSave();
            setIsEditing(false);
          }}
          className="flex items-center gap-3 bg-[#1A8749] text-white px-10 py-4 rounded-xl hover:bg-green-600 transition-all text-xs font-bold uppercase tracking-[0.2em] shadow-xl shadow-green-900/10 dark:shadow-green-900/20 active:scale-95"
        >
          <FaSave size={14} /> Save Changes
        </button>
      </motion.div>
    )}
  </motion.div>
)}

          {/* Security Tab (Styled to match the new dark theme) */}
          {activeTab === 'security' && (
             <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="bg-white dark:bg-[#13171F] rounded-2xl p-8  border border-gray-200 dark:border-white/10 transition-colors shadow-2xl"
             >
               <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-8">Security Settings</h2>
               
               <div className="space-y-6 max-w-xl">
                 <div>
                   <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                     Current Password
                   </label>
                   <input
                     type="password"
                     name="currentPassword"
                     value={passwordData?.currentPassword || ''}
                     onChange={handlePasswordChange}
                     className="w-full bg-gray-50 dark:bg-[#0B0F15] text-gray-900 dark:text-white p-4 rounded-xl border border-gray-200 dark:border-gray-800 focus:border-[#22c55e] focus:outline-none transition-colors"
                     placeholder="Enter current password"
                   />
                 </div>

                 <div>
                   <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                     New Password
                   </label>
                   <input
                     type="password"
                     name="newPassword"
                     value={passwordData?.newPassword || ''}
                     onChange={handlePasswordChange}
                     className="w-full bg-gray-50 dark:bg-[#0B0F15] text-gray-900 dark:text-white p-4 rounded-xl border border-gray-200 dark:border-gray-800 focus:border-[#22c55e] focus:outline-none transition-colors"
                     placeholder="Enter new password"
                   />
                 </div>

                 <div>
                   <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                     Confirm New Password
                   </label>
                   <input
                     type="password"
                     name="confirmPassword"
                     value={passwordData?.confirmPassword || ''}
                     onChange={handlePasswordChange}
                     className="w-full bg-gray-50 dark:bg-[#0B0F15] text-gray-900 dark:text-white p-4 rounded-xl border border-gray-200 dark:border-gray-800 focus:border-[#22c55e] focus:outline-none transition-colors"
                     placeholder="Confirm new password"
                   />
                 </div>

                 <motion.button
                   whileHover={{ scale: 1.02 }}
                   whileTap={{ scale: 0.98 }}
                   onClick={handlePasswordUpdate}
                   className="w-full py-3 bg-[#1A8749] text-white rounded-lg font-medium hover:bg-green-600 transition-all flex items-center justify-center gap-2 mt-4"
                 >
                   <FaSave /> Update Password
                 </motion.button>
               </div>
             </motion.div>
          )}

          {/* Other Tabs */}
          {(activeTab === 'notifications' || activeTab === 'analytics' || activeTab === 'appearance' ) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white dark:bg-[#13171F] rounded-2xl p-8 text-center  border border-gray-200 dark:border-white/10 shadow-2xl"
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {tabs?.find(tab => tab.id === activeTab)?.label}
              </h2>
              <p className="text-gray-500">This section is currently under development.</p>
            </motion.div>
          )}

        {/* Monetization Tab */}
{activeTab === 'monetization' && (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-6"
  >
   <MonetizationTab />
  </motion.div>
)}

        </div>

      </div>
    </div>
  );
};

export default StreamerProfile;