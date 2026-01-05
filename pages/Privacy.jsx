import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, UserCheck } from 'lucide-react';
import PageTransition from '@/components/ui/PageTransition';

export default function Privacy() {
  return (
    <PageTransition className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-teal-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-gray-600">Last updated: December 29, 2025</p>
        </motion.div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12 prose prose-lg max-w-none">
          <h2 className="flex items-center gap-2 text-gray-900">
            <Lock className="w-6 h-6 text-teal-500" />
            Your Privacy Matters
          </h2>
          <p>
            At SwasthAI, we are committed to protecting your personal and health information. 
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information.
          </p>

          <h3>Information We Collect</h3>
          <ul>
            <li><strong>Personal Information:</strong> Name, email, phone number, date of birth</li>
            <li><strong>Health Information:</strong> Medical history, symptoms, prescriptions, lab reports</li>
            <li><strong>Payment Information:</strong> Transaction details (encrypted)</li>
            <li><strong>Usage Data:</strong> App usage patterns, preferences</li>
          </ul>

          <h3>How We Use Your Information</h3>
          <ul>
            <li>Provide healthcare services and consultations</li>
            <li>Connect you with doctors and labs</li>
            <li>Process payments and deliver medicines</li>
            <li>Improve our services through analytics</li>
            <li>Send appointment reminders and health tips</li>
          </ul>

          <h3>Data Security</h3>
          <p>
            We implement industry-standard security measures including:
          </p>
          <ul>
            <li>256-bit SSL encryption for data transmission</li>
            <li>Encrypted storage of health records</li>
            <li>Regular security audits</li>
            <li>Access controls and authentication</li>
            <li>ABDM/HIPAA-style compliance frameworks</li>
          </ul>

          <h3>ABDM Compliance</h3>
          <p>
            SwasthAI is compliant with the Ayushman Bharat Digital Mission (ABDM) framework. 
            Your health records can be linked with your ABHA (Ayushman Bharat Health Account) ID 
            for unified health data management across India.
          </p>

          <h3>Your Rights</h3>
          <ul>
            <li>Access your personal and health data</li>
            <li>Request data correction or deletion</li>
            <li>Opt-out of marketing communications</li>
            <li>Export your health records</li>
            <li>Revoke consent for data processing</li>
          </ul>

          <h3>Contact Us</h3>
          <p>
            For privacy concerns or data requests, contact us at:{' '}
            <a href="mailto:privacy@swasthai.com" className="text-teal-600">privacy@swasthai.com</a>
          </p>
        </div>
      </div>
    </PageTransition>
  );
}