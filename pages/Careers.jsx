import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Heart, Users, Zap } from 'lucide-react';
import PageTransition from '@/components/ui/PageTransition';
import { Button } from '@/components/ui/button';

export default function Careers() {
  return (
    <PageTransition className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-8 h-8 text-teal-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Join Our Mission</h1>
          <p className="text-gray-600 text-lg">
            Help us build the future of healthcare in India
          </p>
        </motion.div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12 text-center">
          <Heart className="w-16 h-16 text-rose-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">We're Growing!</h2>
          <p className="text-gray-600 mb-8">
            Currently building our team. Check back soon for exciting opportunities 
            in engineering, healthcare, and operations.
          </p>
          <Button className="bg-teal-500 hover:bg-teal-600">
            Get Notified About Openings
          </Button>
        </div>
      </div>
    </PageTransition>
  );
}