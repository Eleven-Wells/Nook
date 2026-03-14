<div className="flex min-h-screen bg-[#0B0F15] text-white">
  {/* DESKTOP SIDEBAR - Visible only on md screens and up */}
  <aside className="hidden md:flex w-64 flex-col border-r border-white/5 bg-[#0B0F15] p-6 space-y-8">
    <div className="text-[#22c55e] font-black text-2xl tracking-tighter mb-4">
      LUMEBLOG
    </div>
    
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
            activeTab === item.id ? 'bg-[#1A8749]/10 text-[#22c55e]' : 'text-gray-400 hover:bg-white/5'
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
      <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-white/5 rounded-xl transition-all">
        <FaDollarSign /> <span className="font-medium">Monetization</span>
      </button>
      <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-white/5 rounded-xl transition-all">
        <FaChartBar /> <span className="font-medium">Analytics</span>
      </button>
    </div>

    <button className="mt-auto flex items-center gap-3 px-4 py-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all font-bold uppercase text-xs tracking-widest">
      <FaSignOutAlt /> Logout
    </button>
  </aside>

  {/* MAIN CONTENT AREA */}
  <main className="flex-1 p-4 md:p-10 max-w-5xl mx-auto w-full">
    max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8
    {/* MOBILE TOP NAV - Visible only on mobile */}
    <div className="md:hidden flex overflow-x-auto gap-6 border-b border-gray-800 mb-8 pb-2 no-scrollbar">
      {['Profile', 'Security', 'Notifications', 'Monetization', 'Appearance', 'Analytics'].map((tab) => (
        <button 
          key={tab}
          onClick={() => setActiveTab(tab.toLowerCase())}
          className={`whitespace-nowrap pb-2 text-sm font-medium transition-all ${
            activeTab === tab.toLowerCase() ? 'text-[#22c55e] border-b-2 border-[#22c55e]' : 'text-gray-500'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>

    {/* Profile Tab Content */}
    {activeTab === 'profile' && (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#13171F] rounded-2xl p-6 md:p-8 border border-white/10 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-xl font-bold text-white tracking-tight">Personal Information</h2>
          {!isEditing && (
            <button 
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 text-[10px] font-bold text-gray-400 border border-gray-800 px-4 py-2 rounded-lg hover:text-green-500 hover:border-green-600 transition-all uppercase tracking-[0.1em]"
            >
              <MdEdit size={16} /> Edit Profile
            </button>
          )}
        </div>

        <div className="space-y-4">
          {[
            { label: 'Full Name', name: 'name', type: 'text' },
            { label: 'Username', name: 'username', type: 'text', isUsername: true },
            { label: 'Email Address', name: 'email', type: 'email' },
            { label: 'Bio', name: 'bio', type: 'textarea' },
            { label: 'Location', name: 'location', type: 'text' }
          ].map((field) => (
            <div key={field.name} className="group">
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-1 px-3">
                {field.label}
              </label>
              
              <div className={`transition-all duration-300 rounded-xl px-3 ${
                isEditing 
                  ? "bg-white/[0.02] border-l-2 border-transparent focus-within:border-[#22c55e] focus-within:bg-white/[0.05]" 
                  : "bg-transparent border-l-2 border-transparent"
              }`}>
                <div className="border-b border-gray-800/50 py-3 flex items-center">
                  {field.isUsername && <span className="text-gray-600 mr-1 text-lg font-medium">@</span>}
                  
                  {field.type === 'textarea' ? (
                    <textarea
                      name={field.name}
                      readOnly={!isEditing}
                      value={profileData?.[field.name] || ''}
                      onChange={handleInputChange}
                      rows="2"
                      className="w-full bg-transparent text-white text-base focus:outline-none transition-all resize-none"
                    />
                  ) : (
                    <input
                      type={field.type}
                      name={field.name}
                      readOnly={!isEditing}
                      value={profileData?.[field.name] || ''}
                      onChange={handleInputChange}
                      className="w-full bg-transparent text-white text-lg font-medium focus:outline-none transition-all"
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* BOTTOM ACTION BUTTONS */}
        {isEditing && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-end items-center gap-8 mt-10 pt-8 border-t border-gray-800/50"
          >
            <button 
              onClick={() => setIsEditing(false)}
              className="text-xs font-bold text-gray-500 hover:text-white uppercase tracking-[0.2em]"
            >
              Cancel
            </button>
            <button 
              onClick={() => { handleSave(); setIsEditing(false); }}
              className="flex items-center gap-3 bg-[#1A8749] text-white px-10 py-4 rounded-xl hover:bg-green-600 transition-all text-xs font-bold uppercase tracking-[0.2em] shadow-xl shadow-green-900/20"
            >
              <FaSave size={14} /> Save Changes
            </button>
          </motion.div>
        )}
      </motion.div>
    )}
  </main>
</div>