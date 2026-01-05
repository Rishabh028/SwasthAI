import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Priya Sharma',
    location: 'Mumbai, Maharashtra',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    text: 'SwasthAI has been a game-changer for my family. The AI symptom checker helped us identify my father\'s condition early, and the video consultation with a specialist was seamless. Highly recommended!',
    service: 'Video Consultation'
  },
  {
    id: 2,
    name: 'Rajesh Kumar',
    location: 'Jaipur, Rajasthan',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    text: 'Living in a Tier-2 city, access to specialists was always a challenge. SwasthAI connected me with top doctors from metros. The medicine delivery is also super fast!',
    service: 'Doctor Consultation'
  },
  {
    id: 3,
    name: 'Anita Desai',
    location: 'Bengaluru, Karnataka',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
    text: 'The health records feature is brilliant. All my family\'s medical history is now organized in one place. The AI health coach also gives great personalized tips!',
    service: 'Health Records'
  },
  {
    id: 4,
    name: 'Mohammed Ali',
    location: 'Hyderabad, Telangana',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
    text: 'Booked a full body checkup through SwasthAI. The home sample collection was convenient, and I got my reports digitally within 24 hours. Great experience!',
    service: 'Lab Tests'
  }
];

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-teal-600 font-medium mb-2 block">Testimonials</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our Users Say
          </h2>
          <p className="text-gray-600 text-lg">
            Real stories from real people who transformed their healthcare experience
          </p>
        </motion.div>

        {/* Testimonial Carousel */}
        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-3xl shadow-xl p-8 md:p-12"
            >
              <Quote className="w-12 h-12 text-teal-100 mb-6" />
              
              <p className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-8">
                "{testimonials[currentIndex].text}"
              </p>

              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={testimonials[currentIndex].image}
                    alt={testimonials[currentIndex].name}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {testimonials[currentIndex].name}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {testimonials[currentIndex].location}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex gap-1">
                    {Array.from({ length: testimonials[currentIndex].rating }).map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="px-3 py-1 bg-teal-50 text-teal-700 text-sm rounded-full">
                    {testimonials[currentIndex].service}
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={prev}
              className="p-3 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    index === currentIndex 
                      ? 'bg-teal-500 w-8' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="p-3 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}