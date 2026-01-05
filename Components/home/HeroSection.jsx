import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  Stethoscope, 
  Heart, 
  Shield, 
  ArrowRight,
  Sparkles,
  Activity
} from 'lucide-react';
import GradientButton from '../ui/GradientButton';

const floatingAnimation = {
  y: [0, -10, 0],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: 'easeInOut'
  }
};

const pulseAnimation = {
  scale: [1, 1.05, 1],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: 'easeInOut'
  }
};

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-white to-emerald-50">
        {/* Animated Blobs */}
        <motion.div
          animate={{ 
            x: [0, 30, 0],
            y: [0, -20, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-20 right-20 w-72 h-72 bg-teal-200/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            x: [0, -20, 0],
            y: [0, 30, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute bottom-20 left-10 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            x: [0, 20, 0],
            y: [0, 20, 0]
          }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-1/2 left-1/3 w-64 h-64 bg-rose-200/20 rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-100 text-teal-700 text-sm font-medium mb-6"
            >
              <Sparkles className="w-4 h-4" />
              <span>AI-Powered Healthcare for India</span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6"
            >
              Your Personal{' '}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                  Health Navigator
                </span>
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="absolute bottom-1 left-0 right-0 h-2 bg-teal-200/50 -z-0 origin-left"
                />
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl text-gray-600 mb-8 max-w-xl"
            >
              Intelligent healthcare connecting you to doctors, labs, pharmacies, 
              and health records — all in one place. Built for a billion Indians.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link to={createPageUrl('SymptomChecker')}>
                <GradientButton size="lg" className="w-full sm:w-auto">
                  Check Symptoms
                  <ArrowRight className="w-5 h-5 ml-2" />
                </GradientButton>
              </Link>
              <Link to={createPageUrl('RegisterChoice')}>
                <GradientButton variant="outline" size="lg" className="w-full sm:w-auto">
                  Join as Provider
                </GradientButton>
              </Link>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-12 flex items-center gap-8 flex-wrap"
            >
              <div className="flex items-center gap-2 text-gray-500">
                <Shield className="w-5 h-5 text-teal-500" />
                <span className="text-sm">ABDM Compliant</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <Heart className="w-5 h-5 text-rose-500" />
                <span className="text-sm">50K+ Happy Users</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <Stethoscope className="w-5 h-5 text-teal-500" />
                <span className="text-sm">500+ Verified Doctors</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            {/* Main Circle */}
            <div className="relative w-[500px] h-[500px] mx-auto">
              {/* Outer Ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 rounded-full border-2 border-dashed border-teal-200"
              />

              {/* Center Graphic */}
              <motion.div
                animate={pulseAnimation}
                className="absolute inset-12 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 shadow-2xl shadow-teal-500/30"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <Activity className="w-32 h-32 text-white/90" />
                </div>
              </motion.div>

              {/* Floating Cards */}
              <motion.div
                animate={floatingAnimation}
                className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 bg-white rounded-2xl shadow-xl p-4 border border-gray-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                    <Stethoscope className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Video Consult</p>
                    <p className="text-xs text-gray-500">In 2 minutes</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ ...floatingAnimation, transition: { ...floatingAnimation.transition, delay: 0.5 } }}
                className="absolute top-1/4 -right-8 bg-white rounded-2xl shadow-xl p-4 border border-gray-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">
                    <Heart className="w-5 h-5 text-rose-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">AI Health Coach</p>
                    <p className="text-xs text-gray-500">24/7 Available</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ ...floatingAnimation, transition: { ...floatingAnimation.transition, delay: 1 } }}
                className="absolute bottom-1/4 -left-8 bg-white rounded-2xl shadow-xl p-4 border border-gray-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Secure Records</p>
                    <p className="text-xs text-gray-500">HIPAA Compliant</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}