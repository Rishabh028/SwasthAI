import React from 'react';
import { motion } from 'framer-motion';
import { Shield, CheckCircle } from 'lucide-react';
import PageTransition from '@/components/ui/PageTransition';

export default function ABDM() {
  return (
    <PageTransition className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">ABDM Compliance</h1>
          <p className="text-gray-600">SwasthAI is compliant with Ayushman Bharat Digital Mission</p>
        </motion.div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12 prose prose-lg max-w-none">
          <h2>What is ABDM?</h2>
          <p>
            The Ayushman Bharat Digital Mission (ABDM) aims to develop the backbone necessary 
            to support the integrated digital health infrastructure of India.
          </p>

          <h3>SwasthAI's ABDM Compliance</h3>
          <ul>
            <li>
              <CheckCircle className="inline w-5 h-5 text-green-500 mr-2" />
              <strong>ABHA Integration:</strong> Link your Ayushman Bharat Health Account
            </li>
            <li>
              <CheckCircle className="inline w-5 h-5 text-green-500 mr-2" />
              <strong>Health Records Portability:</strong> Access your records across healthcare providers
            </li>
            <li>
              <CheckCircle className="inline w-5 h-5 text-green-500 mr-2" />
              <strong>Data Security:</strong> Military-grade encryption and secure storage
            </li>
            <li>
              <CheckCircle className="inline w-5 h-5 text-green-500 mr-2" />
              <strong>Consent Framework:</strong> You control who accesses your health data
            </li>
          </ul>

          <h3>Benefits for Patients</h3>
          <p>
            With ABDM compliance, you can seamlessly share your health records with any 
            healthcare provider in India, ensuring continuity of care and better health outcomes.
          </p>
        </div>
      </div>
    </PageTransition>
  );
}