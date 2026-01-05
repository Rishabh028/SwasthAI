import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { CheckCircle, Package, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PageTransition from '@/components/ui/PageTransition';

export default function OrderConfirmation() {
  return (
    <PageTransition className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12 text-center max-w-md"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle className="w-10 h-10 text-green-600" />
        </motion.div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
        <p className="text-gray-600 mb-8">
          Your medicines will be delivered within 2-3 days
        </p>

        <div className="flex flex-col gap-3">
          <Link to={createPageUrl('MyOrders')}>
            <Button className="w-full bg-rose-500 hover:bg-rose-600">
              <Package className="w-4 h-4 mr-2" />
              View My Orders
            </Button>
          </Link>
          <Link to={createPageUrl('Home')}>
            <Button variant="outline" className="w-full">
              <Home className="w-4 h-4 mr-2" />
              Go to Home
            </Button>
          </Link>
        </div>
      </motion.div>
    </PageTransition>
  );
}