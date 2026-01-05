import React from 'react';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import PageTransition from '@/components/ui/PageTransition';

export default function Terms() {
  return (
    <PageTransition className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-slate-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-gray-600">Last updated: December 29, 2025</p>
        </motion.div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12 prose prose-lg max-w-none">
          <h2>Acceptance of Terms</h2>
          <p>
            By accessing and using SwasthAI, you accept and agree to be bound by the terms 
            and provision of this agreement.
          </p>

          <h2>Medical Disclaimer</h2>
          <p>
            <strong>IMPORTANT:</strong> SwasthAI provides health information and facilitates 
            connections with healthcare providers. We do not provide medical advice, diagnosis, 
            or treatment. All medical decisions should be made in consultation with qualified 
            healthcare professionals.
          </p>

          <h2>User Responsibilities</h2>
          <ul>
            <li>Provide accurate and truthful information</li>
            <li>Maintain confidentiality of your account credentials</li>
            <li>Use services for lawful purposes only</li>
            <li>Respect intellectual property rights</li>
            <li>Follow medical advice provided by licensed professionals</li>
          </ul>

          <h2>Healthcare Provider Responsibilities</h2>
          <ul>
            <li>Maintain valid medical licenses and certifications</li>
            <li>Provide accurate professional information</li>
            <li>Adhere to medical ethics and standards</li>
            <li>Maintain patient confidentiality</li>
            <li>Provide quality medical services</li>
          </ul>

          <h2>Payment Terms</h2>
          <ul>
            <li>All fees are in Indian Rupees (INR)</li>
            <li>Payment must be made before service delivery</li>
            <li>Refund policy applies to cancellations per guidelines</li>
            <li>Platform may charge service fees</li>
          </ul>

          <h2>Limitation of Liability</h2>
          <p>
            SwasthAI is a platform connecting patients with healthcare providers. 
            We are not responsible for the quality of medical services provided by 
            healthcare professionals on our platform.
          </p>

          <h2>Contact</h2>
          <p>
            For questions about these Terms, contact us at:{' '}
            <a href="mailto:legal@swasthai.com">legal@swasthai.com</a>
          </p>
        </div>
      </div>
    </PageTransition>
  );
}