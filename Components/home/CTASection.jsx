import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowRight, Smartphone, CheckCircle } from 'lucide-react';
import GradientButton from '../ui/GradientButton';

const features = [
  'AI-powered symptom analysis',
  'Video consultations with top doctors',
  'Medicine delivery in 2 hours',
  'Free home lab sample collection',
  'All health records in one place',
  'ABDM/ABHA integrated'
];

export default function CTASection() {
  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 md:p-16 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl" />
          
          <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                Start Your Health Journey Today
              </h2>
              <p className="text-gray-300 text-lg mb-8">
                Join 50,000+ Indians who trust SwasthAI for their healthcare needs. 
                Get started in less than 2 minutes.
              </p>

              <ul className="space-y-3 mb-8">
                {features.map((feature, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 text-gray-200"
                  >
                    <CheckCircle className="w-5 h-5 text-teal-400 flex-shrink-0" />
                    <span>{feature}</span>
                  </motion.li>
                ))}
              </ul>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to={createPageUrl('SymptomChecker')}>
                  <GradientButton size="lg" className="w-full sm:w-auto">
                    Get Started Free
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </GradientButton>
                </Link>
              </div>
            </motion.div>

            {/* Right - Phone Mockup */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative hidden lg:flex justify-center"
            >
              <div className="relative">
                {/* Phone Frame */}
                <div className="w-72 h-[580px] bg-slate-800 rounded-[3rem] border-4 border-slate-700 shadow-2xl overflow-hidden">
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-slate-800 rounded-b-2xl z-10" />
                  
                  {/* Screen Content */}
                  <div className="h-full bg-gradient-to-br from-teal-50 to-white p-4 pt-10">
                    {/* App Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <p className="text-xs text-gray-500">Good Morning</p>
                        <p className="font-semibold text-gray-900">Priya Sharma</p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                        <span className="text-teal-600 font-semibold">PS</span>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-white rounded-xl p-3 shadow-sm">
                        <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center mb-2">
                          <span className="text-purple-600 text-lg">🩺</span>
                        </div>
                        <p className="text-xs font-medium text-gray-900">Symptom Check</p>
                      </div>
                      <div className="bg-white rounded-xl p-3 shadow-sm">
                        <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center mb-2">
                          <span className="text-teal-600 text-lg">👨‍⚕️</span>
                        </div>
                        <p className="text-xs font-medium text-gray-900">Find Doctor</p>
                      </div>
                    </div>

                    {/* Appointment Card */}
                    <div className="bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl p-4 text-white mb-4">
                      <p className="text-xs opacity-80 mb-1">Upcoming Appointment</p>
                      <p className="font-semibold mb-2">Dr. Amit Patel</p>
                      <div className="flex items-center gap-2 text-xs">
                        <span>📅 Today, 4:00 PM</span>
                        <span>📹 Video Call</span>
                      </div>
                    </div>

                    {/* Health Score */}
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <p className="text-xs text-gray-500 mb-2">Your Health Score</p>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center">
                          <span className="text-white font-bold">85</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Good</p>
                          <p className="text-xs text-gray-500">Keep it up!</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -top-4 -right-14 bg-white rounded-xl shadow-lg p-3"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="text-xs">
                      <p className="font-medium text-gray-900">Report Ready</p>
                      <p className="text-gray-500">Blood Test</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}