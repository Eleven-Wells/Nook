import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

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
        <footer className="bg-linear-to-br from-green-700 to-green-800 text-white dark:text-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
                    
                    <div className="lg:col-span-2">
                        <h2 className="text-3xl font-bold text-white mb-4">
                            LUMEBLOG
                        </h2>
                        <p className="text-white/90 mb-6 leading-relaxed font-medium">
                            Fuel your curiosity. Stay inspired, stay connected.
                        </p>
                        
                        <div className="flex gap-3">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.url}
                                    aria-label={social.label}
                                    className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white hover:text-green-800 transition-all duration-300"
                                >
                                    <social.icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {footerSections.map((section) => (
                        <div key={section.title}>
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
                        </div>
                    ))}
                </div>

                <div className="pt-8 border-t border-white/30">
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
                </div>
            </div>
        </footer>
    );
}
