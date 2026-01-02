
import React from 'react';
import { motion } from 'framer-motion';

const HubLogo: React.FC = () => {
  return (
    <motion.div 
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 1, ease: "backOut" }}
      className="relative w-24 h-24 md:w-32 md:h-32 mb-6"
    >
      {/* Outer Glow Ring */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 opacity-20 blur-xl animate-pulse"></div>
      
      {/* SVG Icon */}
      <svg viewBox="0 0 100 100" className="w-full h-full fill-none">
        <defs>
          <linearGradient id="hubGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
        
        {/* Hub Square */}
        <motion.rect 
          x="25" y="25" width="50" height="50" rx="12"
          stroke="url(#hubGrad)"
          strokeWidth="3"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
        
        {/* Center Node */}
        <motion.circle 
          cx="50" cy="50" r="8"
          fill="url(#hubGrad)"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.5, type: "spring" }}
        />