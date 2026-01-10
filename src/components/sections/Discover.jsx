import React from "react";
import { useNavigate } from "react-router-dom";
import { FiChevronRight, FiCompass, FiBook, FiUsers, FiShare2, FiBookOpen, FiAward, FiCoffee, FiTrendingUp, FiLayers } from "react-icons/fi";
import { FaFire } from "react-icons/fa";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";

const categories = [
  { title: "Popular", description: "Top picks and fan favorites of the week", icon: <FaFire size={22} /> },
  { title: "Design", description: "UI/UX principles, visual design, and creative inspiration", icon: <FiAward size={22} /> },
  { title: "Technology", description: "Latest tech trends, tutorials, and innovations", icon: <FiCoffee size={22} /> },
  { title: "Stories", description: "Personal experiences, case studies, and insights", icon: <FiBookOpen size={22} /> },
  { title: "Productivity", description: "Trends, tools, and innovations shaping the future", icon: <FiLayers size={22} /> },
  { title: "Business", description: "Growth strategies, marketing, and entrepreneurship", icon: <FiTrendingUp size={22} /> },
];

const steps = [
  { icon: <FiCompass size={40} />, title: "Explore Topics", description: "Browse through categories like design, tech, and lifestyle to find content that inspires you." },
  { icon: <FiBook size={40} />, title: "Read & Learn", description: "Enjoy valuable insights from experienced writers and passionate creators." },
  { icon: <FiUsers size={40} />, title: "Join the Community", description: "Subscribe or create an account to get updates, save favorites, and interact with others." },
  { icon: <FiShare2 size={40} />, title: "Share Your Story", description: "Contribute your own posts and let your voice reach a wider audience." },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const Discover = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    navigate(`/category/${category.toLowerCase()}`);
  };

  return (
    <div>
      {/* Inspire Section */}
      <section className="w-full md:pt-40 pt-15 pb-15 md:pb-16 px-4 md:px-6  dark:bg-gray-800">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="text-4xl font-semibold text-center dark:text-gray-100 text-gray-800 mb-3"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {isLoggedIn ? "Browse by Category" : "Find What Inspires You"}
          </motion.h2>

          <motion.p
            className="text-center text-gray-600 dark:text-gray-100 max-w-2xl mx-auto mb-14"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {isLoggedIn 
              ? "Filter articles by your interests and discover content that matters to you."
              : "Discover insightful articles across design, technology, lifestyle, and productivity. Join our community of curious minds."
            }
          </motion.p>

          {/* Category Grid */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {categories.map((item, index) => (
              <motion.div
                key={index}
                onClick={() => handleCategoryClick(item.title)}
                className="bg-white border dark:bg-white/10 dark:border-gray-500 border-gray-200 rounded-xl p-6 hover:border-green-500 hover:shadow-xl shadow-lg transition-all duration-300 group cursor-pointer"
                variants={fadeUp}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-green-700">{item.icon}</div>
                  <FiChevronRight className="text-gray-400 group-hover:text-green-700 transition-colors" size={22} />
                </div>
                <h3 className="text-lg font-semibold dark:text-gray-400 text-gray-800 mb-2">{item.title}</h3>
                <p className="text-sm dark:text-gray-100 text-gray-500">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* How it works Section - Only show when NOT logged in */}
        {!isLoggedIn && (
          <motion.section 
            className="w-full py-16 px-6 bg-slate-50 mt-15 dark:bg-gray-900 dark:border-gray-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="max-w-6xl mx-auto">
              <motion.div className="text-center mb-16" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <motion.h2 className="text-4xl md:text-5xl font-semibold text-slate-800 dark:text-gray-100 mb-4" variants={fadeUp}>
                  How it works
                </motion.h2>
                <motion.p className="text-lg text-slate-400 max-w-2xl mx-auto" variants={fadeUp}>
                  Discover how our blog makes it easy for you to explore, learn, and share ideas that matter
                </motion.p>
              </motion.div>

              <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-15" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                {steps.map((step, index) => (
                  <motion.div key={index} className="flex flex-col items-center text-center" variants={fadeUp}>
                    <div className="text-green-700 mb-6 p-4 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors">{step.icon}</div>
                    <h3 className="text-xl font-semibold text-green-800 mb-3">{step.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed font-semibold">{step.description}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.section>
        )}
      </section>
    </div>
  );
};

export default Discover;