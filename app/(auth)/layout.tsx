'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

/**
 * Auth Layout
 * Matches the landing page aesthetic with dark theme and aurora effects
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background matching landing page */}
      <div className="absolute inset-0 aurora" />
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl animate-pulse" />
      <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-primary/8 rounded-full blur-lg animate-pulse" />

      {/* Logo/Brand */}
      <div className="absolute top-6 left-6 z-50">
        <Link href="/">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-2xl font-bold text-text-primary font-heading cursor-pointer"
          >
            SetterFlo
          </motion.div>
        </Link>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
