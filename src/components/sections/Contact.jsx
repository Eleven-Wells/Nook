import React, { useState } from "react";
import { FiMail } from "react-icons/fi";
import { PiShootingStar } from "react-icons/pi";
import { motion } from "framer-motion";

const StayInLoop = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = () => {
    console.log("Subscribing:", email);
    setEmail("");
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } },
  };

  return (
    <section className="w-full py-20 px-6 dark:bg-gray-800 bg-slate-100">
      <motion.div
        className="max-w-2xl mx-auto text-center"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {/* Star Icon */}
        <motion.div className="flex justify-center mb-3" variants={fadeUp}>
          <div className="bg-green-800 rounded-xl p-3 text-white">
            <PiShootingStar size={28} />
          </div>
        </motion.div>

        {/* Heading */}
        <motion.h2
          className="text-4xl md:text-5xl font-bold dark:text-gray-100 text-slate-900 mb-6"
          variants={fadeUp}
        >
          Stay in the loop
        </motion.h2>

        {/* Description */}
        <motion.p
          className="text-lg dark:text-slate-400 text-slate-600 mb-10 leading-relaxed"
          variants={fadeUp}
        >
          Get weekly updates, exclusive insights, and fresh content delivered
          straight to your inbox. Join our growing community of readers.
        </motion.p>

        {/* Email Subscription */}
        <motion.div
          className="flex flex-col sm:flex-row gap-3 mb-4"
          variants={fadeUp}
        >
          <div className="flex-1 relative dark:bg-white/10">
            <FiMail
              className=" absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400"
              size={20}
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full dark:text-gray-100 pl-12 pr-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:border-green-800 focus:ring-1 focus:ring-green-800 shadow-xl"
            />
          </div>
          <motion.button
            onClick={handleSubscribe}
            className="bg-green-800 hover:bg-green-900 text-white px-8 py-3 rounded-xl font-semibold transition-colors whitespace-nowrap shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Join the list
          </motion.button>
        </motion.div>

        {/* Disclaimer */}
        <motion.p className="text-sm dark:text-slate-400 text-slate-500 mb-12" variants={fadeUp}>
          No spam, ever. Unsubscribe anytime.
        </motion.p>

        {/* Subscribers Count */}
        <motion.div className="flex items-center justify-center gap-4" variants={fadeUp}>
          <div className="flex -space-x-3">
            <motion.img
              src="/pro1.jpg"
              alt="Subscriber 1"
              className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-md"
              variants={fadeUp}
            />
            <motion.img
              src="/pro2.jpg"
              alt="Subscriber 2"
              className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-md"
              variants={fadeUp}
            />
            <motion.img
              src="/pro3.jpg"
              alt="Subscriber 3"
              className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-md"
              variants={fadeUp}
            />
          </div>
          <motion.p className="text-slate-600 dark:text-slate-400 text-sm font-medium" variants={fadeUp}>
            Join 1,000+ subscribers
          </motion.p>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default StayInLoop;
