import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Target, Users, Award, Shield, Zap } from 'lucide-react';
import PageTransition from '@/components/ui/PageTransition';

const values = [
  {
    icon: Heart,
    title: 'Patient-First',
    description: 'Every decision we make prioritizes patient health and experience'
  },
  {
    icon: Shield,
    title: 'Trust & Security',
    description: 'ABDM compliant with highest standards of data protection'
  },
  {
    icon: Zap,
    title: 'Innovation',
    description: 'Leveraging AI to make healthcare accessible and intelligent'
  },
  {
    icon: Users,
    title: 'Inclusivity',
    description: 'Healthcare for everyone, everywhere in India'
  }
];

const stats = [
  { value: '50K+', label: 'Happy Patients' },
  { value: '500+', label: 'Verified Doctors' },
  { value: '100+', label: 'Lab Partners' },
  { value: '100K+', label: 'Consultations' }
];

export default function About() {
  return (
    <PageTransition className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-teal-600 to-emerald-600 py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-white"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Building the Operating System for Indian Healthcare
            </h1>
            <p className="text-teal-100 text-xl">
              SwasthAI connects patients, doctors, labs, and pharmacies on one intelligent platform, 
              making quality healthcare accessible to a billion Indians.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Target className="w-8 h-8 text-teal-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              We're on a mission to democratize healthcare in India by solving fragmented care, 
              poor medical triage, and lack of access. Through AI-powered intelligence and seamless 
              connectivity, we're building the missing link that connects the entire healthcare ecosystem.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 rounded-2xl p-6 text-center"
              >
                <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-7 h-7 text-teal-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600 text-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-gradient-to-br from-teal-600 to-emerald-600">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center text-white"
              >
                <p className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</p>
                <p className="text-teal-100">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PageTransition>
  );
}