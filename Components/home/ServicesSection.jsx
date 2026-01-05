import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  Stethoscope, 
  Brain, 
  Pill, 
  TestTube, 
  FileText, 
  Heart,
  Video,
  MessageCircle,
  ArrowRight,
  Building2,
  AlertCircle
} from 'lucide-react';
import { StaggerContainer, StaggerItem } from '../ui/PageTransition';

const services = [
  {
    icon: Brain,
    title: 'AI Symptom Checker',
    description: 'Get instant AI-powered health assessments based on your symptoms',
    color: 'from-purple-500 to-indigo-500',
    bgColor: 'bg-purple-50',
    iconColor: 'text-purple-600',
    link: 'SymptomChecker'
  },
  {
    icon: Stethoscope,
    title: 'Find Doctors',
    description: 'Connect with verified specialists across all medical fields',
    color: 'from-teal-500 to-emerald-500',
    bgColor: 'bg-teal-50',
    iconColor: 'text-teal-600',
    link: 'Doctors'
  },
  {
    icon: Building2,
    title: 'Nearby Hospitals',
    description: 'Discover hospitals and clinics with facilities near you',
    color: 'from-indigo-500 to-purple-500',
    bgColor: 'bg-indigo-50',
    iconColor: 'text-indigo-600',
    link: 'NearbyHospitals'
  },
  {
    icon: AlertCircle,
    title: 'Emergency Help',
    description: 'Get immediate emergency medical assistance',
    color: 'from-red-500 to-rose-500',
    bgColor: 'bg-red-50',
    iconColor: 'text-red-600',
    link: 'EmergencyAssistance'
  },
  {
    icon: Pill,
    title: 'Pharmacy',
    description: 'Order medicines online with home delivery',
    color: 'from-rose-500 to-pink-500',
    bgColor: 'bg-rose-50',
    iconColor: 'text-rose-600',
    link: 'Pharmacy'
  },
  {
    icon: TestTube,
    title: 'Lab Tests',
    description: 'Book lab tests with free home sample collection',
    color: 'from-amber-500 to-orange-500',
    bgColor: 'bg-amber-50',
    iconColor: 'text-amber-600',
    link: 'LabTests'
  },
  {
    icon: FileText,
    title: 'Health Records',
    description: 'Store and access all your medical records securely',
    color: 'from-emerald-500 to-green-500',
    bgColor: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    link: 'HealthRecords'
  },
  {
    icon: MessageCircle,
    title: 'Community Forum',
    description: 'Share experiences and get support from the community',
    color: 'from-cyan-500 to-blue-500',
    bgColor: 'bg-cyan-50',
    iconColor: 'text-cyan-600',
    link: 'Forum'
  }
];

export default function ServicesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-teal-600 font-medium mb-2 block">Our Services</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Complete Healthcare at Your Fingertips
          </h2>
          <p className="text-gray-600 text-lg">
            From AI-powered diagnosis to medicine delivery — everything you need for your health journey
          </p>
        </motion.div>

        {/* Services Grid */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <StaggerItem key={index}>
              <Link to={createPageUrl(service.link)}>
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 h-full"
                >
                  {/* Gradient Overlay on Hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`} />
                  
                  {/* Icon */}
                  <div className={`w-14 h-14 ${service.bgColor} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <service.icon className={`w-7 h-7 ${service.iconColor}`} />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">
                    {service.description}
                  </p>

                  {/* Arrow */}
                  <div className="flex items-center text-teal-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Learn more</span>
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}