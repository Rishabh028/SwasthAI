import React from 'react';
import { motion } from 'framer-motion';
import PageTransition from '@/components/ui/PageTransition';
import { Button } from '@/components/ui/button';
import { 
  MessageSquare, 
  FileText, 
  Mail, 
  Phone, 
  Clock,
  ChevronDown 
} from 'lucide-react';

export default function Help() {
  const faqs = [
    {
      question: 'How do I book an appointment?',
      answer: 'You can book an appointment by navigating to "Find Doctors" or "Book Appointment", selecting a doctor, choosing an available slot, and confirming your booking.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit/debit cards, UPI, digital wallets, and bank transfers.'
    },
    {
      question: 'How can I cancel or reschedule my appointment?',
      answer: 'You can manage your appointments from "My Appointments" section. You can cancel or reschedule up to 24 hours before the appointment.'
    },
    {
      question: 'Is my medical data secure?',
      answer: 'Yes, all data is encrypted and securely stored as per international healthcare data protection standards.'
    },
    {
      question: 'How do I access my health records?',
      answer: 'All your health records are available in the "Health Records" section of your profile.'
    }
  ];

  const [expandedFAQ, setExpandedFAQ] = React.useState(0);

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-4">Help & Support</h1>
            <p className="text-blue-100 text-lg">Find answers and get support for your SwasthAI experience</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {/* Contact Methods */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold mb-8">Get In Touch</h2>
              
              <div className="space-y-4">
                <a href="mailto:support@swasthAI.com" className="flex items-start p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-500 transition">
                  <Mail className="w-6 h-6 text-blue-600 mr-4 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold">Email Support</h3>
                    <p className="text-gray-600">support@swasthAI.com</p>
                  </div>
                </a>

                <a href="tel:+919876543210" className="flex items-start p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-500 transition">
                  <Phone className="w-6 h-6 text-blue-600 mr-4 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold">Phone Support</h3>
                    <p className="text-gray-600">+91 9876543210</p>
                  </div>
                </a>

                <a href="#chat" className="flex items-start p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-500 transition">
                  <MessageSquare className="w-6 h-6 text-blue-600 mr-4 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold">Live Chat</h3>
                    <p className="text-gray-600">Available 24/7</p>
                  </div>
                </a>
              </div>
            </motion.div>

            {/* Response Time */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="bg-white rounded-lg border border-gray-200 p-8 h-full">
                <div className="flex items-center mb-4">
                  <Clock className="w-8 h-8 text-blue-600 mr-3" />
                  <h3 className="text-xl font-bold">Response Times</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold text-gray-900">Email</p>
                    <p className="text-gray-600">Within 24 hours</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Phone</p>
                    <p className="text-gray-600">Immediate during business hours</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Live Chat</p>
                    <p className="text-gray-600">Instant response</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* FAQs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold mb-8">Frequently Asked Questions</h2>
            
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition"
                >
                  <button
                    onClick={() => setExpandedFAQ(expandedFAQ === index ? -1 : index)}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition"
                  >
                    <span className="font-semibold text-gray-900">{faq.question}</span>
                    <ChevronDown 
                      className={`w-5 h-5 text-gray-600 transition-transform ${
                        expandedFAQ === index ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  
                  {expandedFAQ === index && (
                    <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
                      <p className="text-gray-700">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
