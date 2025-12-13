import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const footerSections = [
        {
            title: 'About us',
            links: ['Our mission', 'Our vision', 'Press', 'Payment info']
        },
        {
            title: 'Support',
            links: ['Help Center', 'Community', 'Our Terms', 'Our Policies']
        },
        {
            title: 'Partners',
            links: ['Partnerships', 'Vendors']
        }
    ];

    const socialLinks = [
        { icon: FaTwitter, url: '#', label: 'Twitter' },
        { icon: FaLinkedin, url: '#', label: 'LinkedIn' },
        { icon: FaFacebook, url: '#', label: 'Facebook' },
        { icon: FaInstagram, url: '#', label: 'Instagram' },
    ];

    return (
        <footer className="bg-gradient-to-br from-green-700 to-green-800 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
                    
                    {/* Brand Section */}
                    <div className="lg:col-span-2">
                        <motion.h2 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-3xl font-bold text-white mb-4"
                        >
                            LUMEBLOG
                        </motion.h2>
                        <p className="text-white/90 mb-6 leading-relaxed font-medium">
                            Fuel your curiosity. Stay inspired, stay connected.
                        </p>
                        
                        {/* Social Icons */}
                        <div className="flex gap-3">
                            {socialLinks.map((social, index) => (
                                <motion.a
                                    key={social.label}
                                    href={social.url}
                                    aria-label={social.label}
                                    initial={{ opacity: 0, scale: 0 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ scale: 1.2, y: -3 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white hover:text-green-800 transition-all duration-300"
                                >
                                    <social.icon size={18} />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Footer Links Sections */}
                    {footerSections.map((section, index) => (
                        <motion.div 
                            key={section.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <h3 className="font-bold mb-4 text-white text-base">
                                {section.title}
                            </h3>
                            <ul className="space-y-2">
                                {section.links.map((link) => (
                                    <li key={link}>
                                        <a 
                                            href="#" 
                                            className="text-white/90 hover:text-white text-sm font-medium transition-colors inline-block hover:translate-x-1 duration-200"
                                        >
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom Bar */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="pt-8 border-t border-white/30"
                >
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-white/90 text-sm font-medium">
                            © {currentYear} LUMEBLOG. All rights reserved.
                        </p>
                        <div className="flex gap-6 text-sm font-medium">
                            <a href="#" className="text-white/90 hover:text-white transition-colors">
                                Privacy Policy
                            </a>
                            <a href="#" className="text-white/90 hover:text-white transition-colors">
                                Terms of Service
                            </a>
                        </div>
                    </div>
                </motion.div>
            </div>
        </footer>
    );
}