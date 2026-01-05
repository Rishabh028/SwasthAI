import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { User, Stethoscope, Building2, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import PageTransition from '@/components/ui/PageTransition';

const roles = [
  {
    icon: User,
    title: 'Patient',
    description: 'Access doctors, book appointments, manage health records',
    color: 'from-blue-500 to-cyan-500',
    link: 'Home'
  },
  {
    icon: Stethoscope,
    title: 'Doctor',
    description: 'Manage your practice, consult patients, join our network',
    color: 'from-teal-500 to-emerald-500',
    link: 'DoctorOnboarding'
  },
  {
    icon: Building2,
    title: 'Hospital / Clinic',
    description: 'Register your facility, manage operations, receive emergencies',
    color: 'from-purple-500 to-pink-500',
    link: 'HospitalRegistration'
  }
];

export default function RegisterChoice() {
  return (
    <PageTransition className="min-h-screen bg-gray-50 flex items-center justify-center py-16 px-4">
      <div className="max-w-5xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Join SwasthAI
          </h1>
          <p className="text-gray-600 text-lg">
            Choose your role to get started
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {roles.map((role, index) => (
            <Link key={index} to={createPageUrl(role.link)}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 group cursor-pointer">
                  <CardContent className="p-8 text-center">
                    <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${role.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <role.icon className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {role.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-6">
                      {role.description}
                    </p>
                    <div className="flex items-center justify-center text-teal-600 font-medium group-hover:gap-3 gap-2 transition-all">
                      Get Started
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}