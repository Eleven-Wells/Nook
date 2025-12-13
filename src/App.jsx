import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Navigation from './components/ui/Navigation.jsx';
import Footer from './components/ui/Footer.jsx';
import FeaturedPosts from './components/sections/FeaturedPosts.jsx';
import LatestPost from './components/sections/LatestPost.jsx';
import Home from './components/sections/Home.jsx';
import Contact from './components/sections/Contact.jsx';
import Discover from './components/sections/Discover.jsx';
import AuthModal from './components/ui/AuthModal.jsx';
import BloggerDashboard from './components/dashboard/BloggerDashboard.jsx';
import StreamerProfile from './components/dashboard/StreamerProfile.jsx';
import CategoryPage from './components/pages/CategoryPage.jsx';

const HomePage = () => {
  return (
    <>
      <section id="home">
        <Home />
      </section>

      <section id="discover">
        <Discover />
      </section>

      <section id="featured">
        <FeaturedPosts />
      </section>

      <section id="latest">
        <LatestPost />
      </section>

      <section id="contact">
        <Contact />
      </section>
    </>
  );
};

const App = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleLoginSuccess = () => {
    setShowAuthModal(false);
  };

  return (
    <AuthProvider>
      <div>
        <Navigation openAuthModal={() => setShowAuthModal(true)} />
        
        {showAuthModal && (
          <AuthModal 
            onClose={() => setShowAuthModal(false)}
            onLoginSuccess={handleLoginSuccess}
          />
        )}

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<BloggerDashboard />} />
          <Route path="/profile" element={<StreamerProfile />} />
          <Route path="/category/:category" element={<CategoryPage />} />
        </Routes>

        <Footer />
      </div>
    </AuthProvider>
  );
};

export default App;