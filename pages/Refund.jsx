import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import PageTransition from '@/components/ui/PageTransition';

export default function Refund() {
  return (
    <PageTransition className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <RefreshCw className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Refund Policy</h1>
          <p className="text-gray-600">Last updated: December 29, 2025</p>
        </motion.div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12 prose prose-lg max-w-none">
          <h2>Consultation Refunds</h2>
          <ul>
            <li>Full refund if cancelled 24 hours before appointment</li>
            <li>50% refund if cancelled 12-24 hours before</li>
            <li>No refund for cancellations within 12 hours</li>
            <li>Refunds processed within 5-7 business days</li>
          </ul>

          <h2>Medicine Order Refunds</h2>
          <ul>
            <li>Cancel before shipment for full refund</li>
            <li>Return unopened medicines within 7 days</li>
            <li>Prescription medicines cannot be returned once delivered</li>
            <li>Damaged or wrong products - full refund + replacement</li>
          </ul>

          <h2>Lab Test Refunds</h2>
          <ul>
            <li>Cancel before sample collection for 100% refund</li>
            <li>After collection - no refund</li>
            <li>Rescheduling allowed up to 24 hours before</li>
          </ul>

          <h2>Contact for Refunds</h2>
          <p>
            Email us at <a href="mailto:refunds@swasthai.com">refunds@swasthai.com</a> with 
            your order/booking number for refund requests.
          </p>
        </div>
      </div>
    </PageTransition>
  );
}