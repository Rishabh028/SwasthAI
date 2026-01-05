import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import {
  TestTube,
  Beaker,
  TrendingUp,
  Shield,
  Clock,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import PageTransition from '@/components/ui/PageTransition';
import GradientButton from '@/components/ui/GradientButton';

const benefits = [
  {
    icon: TrendingUp,
    title: 'Grow Your Business',
    description: 'Access to 50,000+ potential customers actively booking lab tests'
  },
  {
    icon: Clock,
    title: 'Easy Management',
    description: 'Simple dashboard to manage bookings, reports, and sample collections'
  },
  {
    icon: Shield,
    title: 'Trusted Network',
    description: 'Join India\'s most trusted healthcare platform with verified partners'
  },
  {
    icon: Beaker,
    title: 'Digital Reports',
    description: 'Upload and share reports digitally with patients instantly'
  }
];

const features = [
  'Real-time booking notifications',
  'Customer management system',
  'Home sample collection tracking',
  'Digital report upload',
  'Payment processing',
  'Analytics dashboard',
  'Marketing support',
  '24/7 technical support'
];

export default function ForPartners() {
  return (
    <PageTransition className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-amber-600 to-orange-600 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Partner with India's Leading Digital Health Platform
              </h1>
              <p className="text-amber-100 text-xl mb-8">
                Join 100+ diagnostic centers delivering quality healthcare services
              </p>
              <Link to={createPageUrl('LabPartnerOnboarding')}>
                <GradientButton size="xl" variant="glass">
                  Partner with Us
                  <ArrowRight className="w-5 h-5 ml-2" />
                </GradientButton>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Partner with SwasthAI?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
              >
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4">
                  <benefit.icon className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600 text-sm">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Complete Partner Dashboard
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-3"
              >
                <CheckCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                <span className="text-gray-700">{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Partner with Us?
          </h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            Start accepting bookings and grow your diagnostic center
          </p>
          <Link to={createPageUrl('LabPartnerOnboarding')}>
            <GradientButton size="lg" variant="coral">
              Become a Partner
              <ArrowRight className="w-5 h-5 ml-2" />
            </GradientButton>
          </Link>
        </div>
      </section>
    </PageTransition>
  );
}