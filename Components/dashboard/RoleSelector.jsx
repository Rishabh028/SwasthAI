import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { User, Stethoscope, TestTube, ArrowRight } from 'lucide-react';

const roles = [
  {
    id: 'patient',
    title: 'I am a Patient',
    description: 'Book appointments, order medicines, manage health records',
    icon: User,
    color: 'from-teal-500 to-emerald-500',
    link: 'Home'
  },
  {
    id: 'doctor',
    title: 'I am a Doctor',
    description: 'Manage consultations, view appointments, handle patient care',
    icon: Stethoscope,
    color: 'from-blue-500 to-indigo-500',
    link: 'DoctorOnboarding'
  },
  {
    id: 'lab',
    title: 'I am a Lab Partner',
    description: 'Manage test bookings, upload reports, handle collections',
    icon: TestTube,
    color: 'from-amber-500 to-orange-500',
    link: 'LabPartnerOnboarding'
  }
];

export default function RoleSelector({ onSelect }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Welcome to SwasthAI
          </h1>
          <p className="text-gray-600 text-lg">
            How would you like to continue?
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {roles.map((role, index) => (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={createPageUrl(role.link)}>
                <div className={`group relative bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-2xl transition-all cursor-pointer overflow-hidden`}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${role.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
                  
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${role.color} flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform`}>
                    <role.icon className="w-8 h-8 text-white" />
                  </div>

                  <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">
                    {role.title}
                  </h2>
                  <p className="text-gray-600 text-sm text-center mb-6">
                    {role.description}
                  </p>

                  <div className="flex items-center justify-center text-teal-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}