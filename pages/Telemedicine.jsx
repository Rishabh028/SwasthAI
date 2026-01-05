import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PageTransition from '@/components/ui/PageTransition';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Video, 
  Phone, 
  MessageSquare, 
  Clock,
  Calendar,
  User
} from 'lucide-react';

export default function Telemedicine() {
  const [selectedType, setSelectedType] = useState('video');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const consultationTypes = [
    { id: 'video', name: 'Video Consultation', icon: Video, price: '₹300' },
    { id: 'phone', name: 'Phone Call', icon: Phone, price: '₹200' },
    { id: 'chat', name: 'Chat Consultation', icon: MessageSquare, price: '₹150' }
  ];

  const availableDates = [
    { date: 'Today', slots: ['10:00 AM', '2:00 PM', '4:00 PM'] },
    { date: 'Tomorrow', slots: ['11:00 AM', '3:00 PM', '5:00 PM'] },
    { date: 'Day After', slots: ['9:00 AM', '1:00 PM', '6:00 PM'] }
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-4">Telemedicine Consultation</h1>
            <p className="text-blue-100 text-lg">Connect with qualified doctors from the comfort of your home</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-16">
          {/* Consultation Type Selection */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold mb-6">Select Consultation Type</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {consultationTypes.map((type) => {
                const IconComponent = type.icon;
                return (
                  <motion.button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-6 rounded-lg border-2 transition-all ${
                      selectedType === type.id
                        ? 'border-blue-600 bg-blue-50 shadow-lg'
                        : 'border-gray-200 bg-white hover:border-blue-300'
                    }`}
                  >
                    <IconComponent className={`w-8 h-8 mb-3 ${selectedType === type.id ? 'text-blue-600' : 'text-gray-600'}`} />
                    <h3 className="font-semibold text-gray-900 mb-2">{type.name}</h3>
                    <p className="text-lg font-bold text-blue-600">{type.price}</p>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Date & Time Selection */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12"
          >
            {/* Date Selection */}
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Calendar className="w-6 h-6 mr-2 text-blue-600" />
                Select Date
              </h2>
              <div className="space-y-3">
                {availableDates.map((day, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                      selectedDate === index
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 bg-white hover:border-blue-300'
                    }`}
                    onClick={() => setSelectedDate(index)}
                  >
                    <p className="font-semibold text-gray-900">{day.date}</p>
                    <p className="text-sm text-gray-600">{day.slots.length} slots available</p>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Time Selection */}
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Clock className="w-6 h-6 mr-2 text-blue-600" />
                Select Time
              </h2>
              {selectedDate !== null && (
                <div className="grid grid-cols-2 gap-3">
                  {availableDates[selectedDate].slots.map((slot, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      className={`p-3 rounded-lg border-2 font-semibold transition-all ${
                        selectedTime === slot
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : 'border-gray-200 bg-white text-gray-900 hover:border-blue-300'
                      }`}
                      onClick={() => setSelectedTime(slot)}
                    >
                      {slot}
                    </motion.button>
                  ))}
                </div>
              )}
              {selectedDate === null && (
                <p className="text-gray-500 text-center py-8">Select a date first</p>
              )}
            </div>
          </motion.div>

          {/* Doctor Selection */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold mb-6">Select Doctor</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((doctor) => (
                <div key={doctor} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition">
                  <div className="flex items-start">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                      <User className="w-8 h-8 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">Dr. Name {doctor}</h3>
                      <p className="text-sm text-gray-600 mb-2">Specialist</p>
                      <Badge className="bg-green-100 text-green-800">Available</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex gap-4 justify-center"
          >
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
              Continue to Checkout
            </Button>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
