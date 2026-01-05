import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import {
  Stethoscope,
  Users,
  TrendingUp,
  Shield,
  Clock,
  DollarSign,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import PageTransition from '@/components/ui/PageTransition';
import GradientButton from '@/components/ui/GradientButton';

const benefits = [
  {
    icon: Users,
    title: 'Reach More Patients',
    description: 'Connect with 50,000+ users actively seeking medical consultations'
  },
  {
    icon: Clock,
    title: 'Flexible Scheduling',
    description: 'Set your own availability and manage appointments on your terms'
  },
  {
    icon: DollarSign,
    title: 'Competitive Earnings',
    description: 'Earn up to ₹2-3 lakhs monthly with video and clinic consultations'
  },
  {
    icon: Shield,
    title: 'Verified Platform',
    description: 'ABDM compliant with secure patient data handling and privacy'
  }
];

const features = [
  'Video consultation platform',
  'Appointment management system',
  'Digital prescription tools',
  'Patient health records access',
  'Payment processing',
  'Reviews & ratings system',
  'Marketing support',
  'Dedicated support team'
];

export default function ForDoctors() {
  return (
    <PageTransition className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-teal-600 to-emerald-600 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Join 500+ Doctors Transforming Healthcare in India
              </h1>
              <p className="text-teal-100 text-xl mb-8">
                Expand your practice with video consultations and reach patients across India
              </p>
              <Link to={createPageUrl('DoctorOnboarding')}>
                <GradientButton size="xl" variant="glass">
                  Join as a Doctor
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
                <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-4">
                  <benefit.icon className="w-6 h-6 text-teal-600" />
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
            Everything You Need to Practice Online
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
                <CheckCircle className="w-5 h-5 text-teal-500 flex-shrink-0" />
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
            Ready to Get Started?
          </h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            Join our platform and start consulting patients online today
          </p>
          <Link to={createPageUrl('DoctorOnboarding')}>
            <GradientButton size="lg">
              Apply Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </GradientButton>
          </Link>
        </div>
      </section>
    </PageTransition>
  );
}