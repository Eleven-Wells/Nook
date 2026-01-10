import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiLogOut } from 'react-icons/fi';
import { FaUser, FaPen } from 'react-icons/fa';
import { MdDarkMode, MdOutlineLightMode } from "react-icons/md";

export default function Navigation({ openAuthModal }) {
    const { user, isLoggedIn, isBlogger, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('home');
    const [scrolled, setScrolled] = useState(false);

    const navItems = [
        { id: 'home', label: 'Home' },
        { id: 'discover', label: 'Discover' },
        { id: 'featured', label: 'Featured' },
        { id: 'latest', label: 'Latest' }
    ];

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);

            const sections = navItems.map(item => item.id);
            for (const sectionId of sections) {
                const element = document.getElementById(sectionId);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    if (rect.top <= 100 && rect.bottom >= 100) {
                        setActiveSection(sectionId);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (sectionId) => {
        if (location.pathname !== '/') {
            navigate('/');
            setTimeout(() => {
                const element = document.getElementById(sectionId);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);
        } else {
            const element = document.getElementById(sectionId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
        setIsOpen(false);
    };

    const handleUserClick = () => {
        if (isBlogger) {
            navigate('/dashboard');
        } else {
            navigate('/profile');
        }
        setIsOpen(false);
    };

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            logout();
            setIsOpen(false);
            navigate('/');
        }
    };
const [theme, setTheme] = useState(() => {
  if (typeof window !== "undefined") {
    return (
      localStorage.getItem("theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light")
    );
  }
  return "light";
});

useEffect(() => {
  const html = document.documentElement;
  html.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
}, [theme]);

const toggleTheme = () => {
  setTheme(prev => (prev === "light" ? "dark" : "light"));
};


    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", stiffness: 100 }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 dark:bg-gray-900 ${
                    scrolled 
                        ? 'bg-white/95 backdrop-blur-md shadow-lg' 
                        : 'bg-gray-50 border-b border-gray-200'
                }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        
                        {/* Logo */}
                        <motion.div 
                            whileHover={{ scale: 1.05 }}
                            className="shrink-0 cursor-pointer"
                            onClick={() => navigate('/')}
                        >
                            <span className="text-xl font-bold text-green-800">LUMEBLOG</span>
                        </motion.div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-1">
                            {navItems.map((item) => (
                                <motion.button
                                    key={item.id}
                                    onClick={() => scrollToSection(item.id)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`relative px-4 py-2 text-sm font-medium transition-all rounded-lg ${
                                        activeSection === item.id
                                            ? 'text-green-800 bg-green-50'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                    }`}
                                >
                                    {item.label}
                                </motion.button>
                            ))}
                        </div>

                        {/* Desktop Auth Area */}
                        <div className="hidden md:flex items-center gap-3">
                            {isLoggedIn ? (
                                <>
                                    <motion.div 
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        onClick={handleUserClick}
                                        whileHover={{ scale: 1.05 }}
                                        className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full cursor-pointer hover:bg-gray-200 transition-all"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-green-800 text-white flex items-center justify-center text-sm font-bold">
                                            {isBlogger ? <FaPen size={14} /> : <FaUser size={14} />}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-gray-900">
                                                {user?.username || user?.name || user?.email}
                                            </span>
                                            {isBlogger && (
                                                <span className="text-xs text-green-700 font-semibold">
                                                    {user?.niche}
                                                </span>
                                            )}
                                        </div>
                                    </motion.div>

                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleLogout}
                                        className="px-4 py-2 bg-red-600 text-white rounded-full text-sm font-medium hover:bg-red-700 transition-all flex items-center gap-2"
                                    >
                                        <FiLogOut size={16} />
                                        Logout
                                    </motion.button>
                                </>
                            ) : (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={openAuthModal}
                                    className="px-6 py-2 bg-green-800 text-white rounded-full text-sm font-medium hover:bg-green-900 transition-all shadow-md hover:shadow-lg"
                                >
                                    Login
                                </motion.button>
                            )}
                            <div
  onClick={toggleTheme}
  aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
  className="
    flex items-center justify-center
    h-8 w-8 rounded-full
    bg-gray-200 hover:bg-gray-300
    dark:bg-gray-700 dark:hover:bg-gray-600
    cursor-pointer transition-colors
  "
>
  {theme === "dark" ? (
    <MdDarkMode className="text-white" />
  ) : (
    <MdOutlineLightMode className="text-yellow-500" />
  )}
</div>
                        </div>
                    
                        

        

                        {/* Mobile - Login Button + Hamburger */}
                        <div className="md:hidden flex items-center gap-3">

                                                    <div
  onClick={toggleTheme}
  aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
  className="
    flex items-center justify-center
    h-8 w-8 rounded-full
    bg-gray-200 hover:bg-gray-300
    dark:bg-gray-700 dark:hover:bg-gray-600
    cursor-pointer transition-colors
  "
>
  {theme === "dark" ? (
    <MdDarkMode className="text-white" />
  ) : (
    <MdOutlineLightMode className="text-yellow-500" />
  )}
</div>

                            {/* Mobile Login Button - Always visible when not logged in */}
                            {!isLoggedIn && (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={openAuthModal}
                                    className="px-4 py-2 bg-green-800 text-white rounded-full text-sm font-medium hover:bg-green-900 transition-all shadow-md"
                                >
                                    Login
                                </motion.button>
                            )}

                            {/* Hamburger Menu Button */}
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setIsOpen(!isOpen)}
                                className="relative w-10 h-10 flex items-center justify-center text-red-500"
                                aria-label="Toggle menu"
                            >
                                <div className="flex flex-col space-y-1.5">
                                    <motion.span 
                                        animate={{
                                            rotate: isOpen ? 45 : 0,
                                            y: isOpen ? 8 : 0,
                                        }}
                                        className="w-6 h-0.5 bg-gray-900 block dark:bg-gray-100"
                                    />
                                    <motion.span 
                                        animate={{ opacity: isOpen ? 0 : 1 }}
                                        className="w-6 h-0.5 bg-gray-900 block dark:bg-gray-100"
                                    />
                                    <motion.span 
                                        animate={{
                                            rotate: isOpen ? -45 : 0,
                                            y: isOpen ? -8 : 0,
                                        }}
                                        className="w-6 h-0.5 bg-gray-900 block dark:bg-gray-100"
                                    />
                                </div>
                            </motion.button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-t border-gray-200 bg-white dark:bg-gray-900"
                    >
                        <div className="px-4 py-4 space-y-2">
                            {navItems.map((item, index) => (
                                <motion.button
                                    key={item.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    onClick={() => scrollToSection(item.id)}
                                    className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                                        activeSection === item.id
                                            ? 'bg-green-100 dark:bg-green-500/20 text-green-800'
                                            : 'text-gray-700 dark:text-gray-100 hover:bg-gray-100 hover:dark:text-gray-900'
                                    }`}
                                >
                                    {item.label}
                                </motion.button>
                            ))}

                            {/* Mobile Menu - User Section (only show if logged in) */}
                            {isLoggedIn && (
                                <div className="pt-2 border-t border-gray-200 space-y-2">
                                    <motion.div 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        onClick={handleUserClick}
                                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-all"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-green-800 text-white flex items-center justify-center text-lg font-bold">
                                            {isBlogger ? <FaPen size={18} /> : <FaUser size={18} />}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900">
                                                {user?.username || user?.name || user?.email}
                                            </p>
                                            {isBlogger && (
                                                <span className="inline-block mt-1 text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                                                    {user?.niche}
                                                </span>
                                            )}
                                        </div>
                                    </motion.div>

                                    <motion.button
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleLogout}
                                        className="w-full px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <FiLogOut size={18} />
                                        Logout
                                    </motion.button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </motion.nav>

            <div className="h-16" />
        </>
    );
}