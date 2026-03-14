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
import { CiBank } from "react-icons/ci";
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
    { id: 'monetization', label: 'Monetization', icon: FaDollarSign },
    { id: 'analytics', label: 'Analytics', icon: FaChartBar },
  ];

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
// Monetization States
const [paymentMethod, setPaymentMethod] = useState(null);
const [isAddingPayment, setIsAddingPayment] = useState(false);
const [bankForm, setBankForm] = useState({ bankName: '', accountNumber: '' });

const handleBindBank = (e) => {
  e.preventDefault();
  // In a real app, you'd send this to your backend here
  setPaymentMethod({
    type: 'Bank Transfer',
    last4: bankForm.accountNumber.slice(-4) || '0000',
    bankName: bankForm.bankName || 'Unknown Bank'
  });
  setIsAddingPayment(false);
};

// Mock Data for the UI
const monetizationMetrics = [
  { title: 'TOTAL EARNED', value: '$1,284', detail: '+18% vs last month', detailColor: 'text-[#22c55e]' },
  { title: 'PENDING', value: '$342', detail: 'Clears in ~3 days', detailColor: 'text-gray-500' },
  { title: 'THIS MONTH', value: '$487', detail: '+5% vs Feb', detailColor: 'text-[#22c55e]' },
  { title: 'SUBSCRIBERS', value: '124', detail: '+12 new this week', detailColor: 'text-[#22c55e]' }
];

const transactions = [
  { date: 'Feb 18, 2025', desc: 'Subscription — @johndoe', type: 'Credit', amount: '+$9.99', status: 'Completed' },
  { date: 'Feb 15, 2025', desc: 'Tip — @sarah_k', type: 'Credit', amount: '+$25.00', status: 'Completed' },
  { date: 'Feb 12, 2025', desc: 'Ad Revenue — February', type: 'Credit', amount: '+$142.50', status: 'Pending' },
  { date: 'Feb 10, 2025', desc: 'Withdrawal to GTBank', type: 'Debit', amount: '-$200.00', status: 'Completed' },
  { date: 'Feb 05, 2025', desc: 'Subscription — @mark_b', type: 'Credit', amount: '+$9.99', status: 'Completed' }
];
 return (
    <div className="flex min-h-screen bg-[#0B0F15] text-gray-200 pb-12">

{/* DESKTOP SIDEBAR - Visible only on md screens and up */}
  <aside className="hidden md:flex w-64 flex-col border-r border-white/10 bg-[#13171F] p-6 space-y-8">
    
    <nav className="space-y-1">
      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-4 px-2">Account</p>
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
            activeTab === item.id ? 'bg-[#1A8749]/10 text-[#22c55e] border border-white/10' : 'text-gray-400 hover:bg-white/5'
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
    </nav>

    <div className="pt-4 space-y-1">
      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-4 px-2">Creator</p>
       {[
        { id: 'monetization', icon: <FaDollarSign />, label: 'Monetization' },
        { id: 'analytics', icon: <FaChartBar />, label: 'Analytics' },
      ].map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveTab(item.id)}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
            activeTab === item.id ? 'bg-[#1A8749]/10 text-[#22c55e] border border-white/10' : 'text-gray-400 hover:bg-white/5'
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

    <button className=" flex items-center gap-3 px-4 py-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all font-bold uppercase text-xs tracking-widest border border-white/10">
      <FaSignOutAlt /> Logout
    </button>
  </aside>

      <div className="flex-1 p-4 md:p-10 max-w-5xl mx-auto w-full">
        
        {/* Profile Header Card (Cover + Info) */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#13171F] rounded-2xl shadow-xl overflow-hidden mb-8 border border-white/10"
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
              <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-[#00d2ff] to-[#3a7bd5] flex items-center justify-center text-[#0B0F15] text-4xl font-black shadow-xl overflow-hidden border-4 border-[#13171F]">
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
              <h1 className="text-2xl font-bold text-white mb-1">{profileData?.name || 'funmibi'}</h1>
              <p className="text-gray-400 text-sm mb-3">{profileData?.email || 'abiodunfunmibi17@gmail.com'}</p>
              <div className="flex flex-wrap gap-3">
                <span className="px-3 py-1 bg-[#1A8749]/20 text-[#22c55e] border border-[#1A8749]/30 rounded-full text-xs font-semibold">
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
        <div className="flex overflow-x-auto border-b border-gray-800 mb-8 hide-scrollbar">
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
                    : 'border-transparent text-gray-500 hover:text-gray-300'
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
    className="bg-[#13171F] rounded-2xl p-8 border border-white/10 shadow-2xl relative"
  >
    {/* Section Header */}
    <div className="flex items-center justify-between mb-10">
      <h2 className="text-xl font-bold text-white tracking-tight">Personal Information</h2>
      
      {!isEditing && (
        <button 
          onClick={() => setIsEditing(true)}
          className="flex items-center gap-2 text-xs font-semibold text-gray-400 border border-gray-700 px-4 py-2 rounded-lg hover:text-green-500 hover:border-green-600 transition-all uppercase tracking-widest"
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
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2 px-1">
            {field.label}
          </label>
          
          <div className={`transition-all duration-300 rounded-xl ${
            isEditing 
              ? "bg-white/[0.03] border-l-2 border-transparent focus-within:border-green-500 focus-within:bg-white/[0.06]" 
              : "bg-transparent border-l-2 border-transparent"
          }`}>
            <div className="border-b border-gray-800/50 pb-3 flex items-center px-1">
              {field.isUsername && <span className="text-gray-600 mr-1 text-lg font-medium">@</span>}
              
              {field.type === 'textarea' ? (
                <textarea
                  name={field.name}
                  readOnly={!isEditing}
                  value={profileData?.[field.name] || ''}
                  onChange={handleInputChange}
                  rows="2"
                  className={`w-full bg-transparent text-white text-base focus:outline-none transition-all resize-none p-2 ${
                    isEditing ? "text-green-400 cursor-text" : "cursor-default overflow-hidden"
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
                  className={`w-full bg-transparent text-white text-lg font-medium focus:outline-none transition-all p-2 ${
                    isEditing ? "text-green-400 cursor-text" : "cursor-default"
                  }`}
                  placeholder={field.placeholder}
                />
              )}
            </div>
          </div>
        </div>
      ))}

    </div>

    {/* Action Buttons - Appears at the bottom ONLY when editing */}
    {isEditing && (
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-end items-center gap-8 mt-12 pt-8 border-t border-gray-800/50"
      >
        <button 
          onClick={() => setIsEditing(false)}
          className="text-xs font-bold text-gray-500 hover:text-white uppercase tracking-[0.2em] transition-colors"
        >
          Cancel
        </button>
        <button 
          onClick={() => {
            handleSave();
            setIsEditing(false);
          }}
          className="flex items-center gap-3 bg-[#1A8749] text-white px-10 py-4 rounded-xl hover:bg-green-600 transition-all text-xs font-bold uppercase tracking-[0.2em] shadow-xl shadow-green-900/20 active:scale-95"
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
               className="bg-[#13171F] rounded-2xl p-8  border border-white/10"
             >
               <h2 className="text-xl font-bold text-white mb-8">Security Settings</h2>
               
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
                     className="w-full bg-[#0B0F15] text-white p-4 rounded-xl border border-gray-800 focus:border-[#22c55e] focus:outline-none transition-colors"
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
                     className="w-full bg-[#0B0F15] text-white p-4 rounded-xl border border-gray-800 focus:border-[#22c55e] focus:outline-none transition-colors"
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
                     className="w-full bg-[#0B0F15] text-white p-4 rounded-xl border border-gray-800 focus:border-[#22c55e] focus:outline-none transition-colors"
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
          {(activeTab === 'notifications') && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-[#13171F] rounded-2xl p-8 text-center  border border-white/10"
            >
              <h2 className="text-xl font-bold text-white mb-2">
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
    {/* Top Metrics Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {monetizationMetrics.map((metric, i) => (
        <div key={i} className="bg-[#13171F] p-6 rounded-2xl border border-white/10 shadow-lg">
          <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">
            {metric.title}
          </h3>
          <div className="text-3xl font-bold text-white mb-2">{metric.value}</div>
          <div className={`text-xs font-medium ${metric.detailColor} flex items-center gap-1`}>
            {metric.detailColor === 'text-[#22c55e]' && <span>↑</span>}
            {metric.detail}
          </div>
        </div>
      ))}
    </div>

    {/* Middle Section: Chart & Payout Methods */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Chart Area */}
      <div className="lg:col-span-2 bg-[#13171F] p-6 rounded-2xl border border-white/10 shadow-lg flex flex-col min-h-[300px]">
        <h3 className="text-lg font-bold text-white mb-6">Monthly Revenue</h3>
        <div className="flex-1 border-b border-gray-800/50 mb-4 relative">
          {/* Chart placeholder - You can drop Recharts or Chart.js here later */}
        </div>
        <div className="flex justify-around text-xs font-semibold text-gray-500 uppercase">
          <span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span><span>Jan</span><span>Feb</span>
        </div>
      </div>

      {/* Payout Methods Area */}
      <div className="bg-[#13171F] p-6 rounded-2xl border border-white/10 shadow-lg flex flex-col">
        <h3 className="text-lg font-bold text-white mb-6">Payout Methods</h3>
        
        <div className="flex-1 space-y-4">
          {/* State 1: Display Bound Payment Method */}
          {paymentMethod && (
            <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-xl">
              <div className="flex items-center gap-4">
                <div className="bg-[#1A8749]/20 p-3 rounded-lg text-[#22c55e]">
                  <CiBank size={20} />
                </div>
                <div>
                  <h4 className="text-white font-medium">{paymentMethod.type}</h4>
                  <p className="text-xs text-gray-500">•••• {paymentMethod.last4} · {paymentMethod.bankName}</p>
                </div>
              </div>
              <span className="bg-[#1A8749]/20 text-[#22c55e] text-[10px] font-bold px-3 py-1 rounded-full tracking-widest">
                Active
              </span>
            </div>
          )}

          {/* State 2: Add New Payment Form */}
          {isAddingPayment && !paymentMethod && (
            <form onSubmit={handleBindBank} className="p-4 bg-white/[0.02] border border-[#22c55e]/30 rounded-xl space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Bank Name</label>
                <input 
                  required
                  type="text" 
                  value={bankForm.bankName}
                  onChange={(e) => setBankForm({...bankForm, bankName: e.target.value})}
                  className="w-full bg-[#0B0F15] text-white p-3 rounded-lg border border-gray-800 focus:border-[#22c55e] focus:outline-none text-sm transition-colors"
                  placeholder="e.g. GTBank"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Account Number</label>
                <input 
                  required
                  type="text" 
                  maxLength="12"
                  value={bankForm.accountNumber}
                  onChange={(e) => setBankForm({...bankForm, accountNumber: e.target.value})}
                  className="w-full bg-[#0B0F15] text-white p-3 rounded-lg border border-gray-800 focus:border-[#22c55e] focus:outline-none text-sm transition-colors"
                  placeholder="0000000000"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setIsAddingPayment(false)} className="flex-1 py-2 text-xs font-bold text-gray-500 hover:text-white transition-colors">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-2 bg-[#1A8749] text-white text-xs font-bold rounded-lg hover:bg-green-600 transition-colors">
                  Save Details
                </button>
              </div>
            </form>
          )}
        </div>

        {/* State 3: Add Button (Only show if no payment method exists AND not currently adding) */}
        {!paymentMethod && !isAddingPayment && (
          <button 
            onClick={() => setIsAddingPayment(true)}
            className="mt-4 w-full py-4 border border-green-500 border-dashed rounded-xl text-sm font-semibold text-green-500 hover:text-green-700 hover:border-green-700 hover:bg-white/[0.02] transition-all"
          >
            + Add Payout Method
          </button>
        )}
      </div>
    </div>

    {/* Bottom Section: Transaction History */}
    <div className="bg-[#13171F] p-6 rounded-2xl border border-white/5 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white">Transaction History</h3>
        <button className="flex items-center gap-2 bg-[#1A8749] text-white px-5 py-2.5 rounded-lg hover:bg-green-600 transition-all text-sm font-bold shadow-lg shadow-green-900/20">
          <FaMoneyBillWave size={16} /> Withdraw
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="pb-4 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Date</th>
              <th className="pb-4 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Description</th>
              <th className="pb-4 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Type</th>
              <th className="pb-4 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Amount</th>
              <th className="pb-4 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, index) => (
              <tr key={index} className="border-b border-gray-800/50 hover:bg-white/[0.02] transition-colors">
                <td className="py-4 text-sm text-gray-400">{tx.date}</td>
                <td className="py-4 text-sm text-white font-medium">{tx.desc}</td>
                <td className="py-4">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest ${
                    tx.type === 'Credit' ? 'text-[#22c55e] bg-[#1A8749]/10' : 'text-red-500 bg-red-500/10'
                  }`}>
                    {tx.type}
                  </span>
                </td>
                <td className={`py-4 text-sm font-bold ${
                  tx.amount.startsWith('+') ? 'text-[#22c55e]' : 'text-red-500'
                }`}>
                  {tx.amount}
                </td>
                <td className="py-4">
                  <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border ${
                    tx.status === 'Completed' ? 'border-[#22c55e]/30 text-[#22c55e]' : 'border-yellow-500/30 text-yellow-500'
                  }`}>
                    {tx.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </motion.div>
)}

        </div>

      </div>
    </div>
  );
};

export default StreamerProfile;