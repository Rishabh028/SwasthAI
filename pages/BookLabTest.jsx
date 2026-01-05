import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { format, addDays } from 'date-fns';
import {
  Calendar,
  Clock,
  Home,
  MapPin,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  User,
  Phone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import PageTransition from '@/components/ui/PageTransition';
import { toast } from 'react-hot-toast';

const timeSlots = ['06:00-07:00 AM', '07:00-08:00 AM', '08:00-09:00 AM', '09:00-10:00 AM'];

export default function BookLabTest() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(1);
  const [user, setUser] = useState(null);
  const [bookingData, setBookingData] = useState({
    patient_name: '',
    patient_age: '',
    patient_gender: 'male',
    patient_phone: '',
    collection_type: 'home',
    collection_address: {
      address_line1: '',
      city: '',
      pincode: ''
    },
    collection_date: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
    collection_slot: '',
    tests: []
  });

  useEffect(() => {
    const loadUser = async () => {
      try {
        const isAuth = await base44.auth.isAuthenticated();
        if (isAuth) {
          const userData = await base44.auth.me();
          setUser(userData);
          setBookingData(prev => ({
            ...prev,
            patient_name: userData.full_name || '',
            patient_phone: userData.phone || userData.phone_number || ''
          }));
        }
      } catch (e) {
        console.log('Not authenticated');
      }
    };
    loadUser();

    // Load cart
    const savedCart = localStorage.getItem('swasthai_lab_cart');
    if (savedCart) {
      const cartTests = JSON.parse(savedCart);
      setBookingData(prev => ({
        ...prev,
        tests: cartTests.map(t => ({
          test_id: t.id,
          test_name: t.name,
          price: t.price
        }))
      }));
    }
  }, []);

  const createBooking = useMutation({
    mutationFn: (data) => base44.entities.LabBooking.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['labBookings'] });
      localStorage.removeItem('swasthai_lab_cart');
      setStep(3);
      toast.success('Lab test booked successfully!');
    }
  });

  const handleSubmit = () => {
    const total = bookingData.tests.reduce((sum, t) => sum + t.price, 0);
    createBooking.mutate({
      ...bookingData,
      booking_number: `LB${Date.now()}`,
      total_amount: total,
      payment_status: 'paid',
      status: 'booked',
      lab_name: 'SwasthAI Diagnostics'
    });
  };

  return (
    <PageTransition className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">Patient Details</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Patient Name</Label>
                    <Input
                      value={bookingData.patient_name}
                      onChange={(e) => setBookingData(prev => ({ ...prev, patient_name: e.target.value }))}
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label>Age</Label>
                    <Input
                      type="number"
                      value={bookingData.patient_age}
                      onChange={(e) => setBookingData(prev => ({ ...prev, patient_age: e.target.value }))}
                      className="mt-1.5"
                    />
                  </div>
                </div>
                <div>
                  <Label>Gender</Label>
                  <RadioGroup 
                    value={bookingData.patient_gender}
                    onValueChange={(value) => setBookingData(prev => ({ ...prev, patient_gender: value }))}
                    className="flex gap-4 mt-2"
                  >
                    <label className="flex items-center gap-2">
                      <RadioGroupItem value="male" />
                      Male
                    </label>
                    <label className="flex items-center gap-2">
                      <RadioGroupItem value="female" />
                      Female
                    </label>
                  </RadioGroup>
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input
                    value={bookingData.patient_phone}
                    onChange={(e) => setBookingData(prev => ({ ...prev, patient_phone: e.target.value }))}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label>Address</Label>
                  <Input
                    value={bookingData.collection_address.address_line1}
                    onChange={(e) => setBookingData(prev => ({
                      ...prev,
                      collection_address: { ...prev.collection_address, address_line1: e.target.value }
                    }))}
                    className="mt-1.5"
                  />
                </div>
              </div>
              <Button onClick={() => setStep(2)} className="w-full mt-6 bg-amber-500 hover:bg-amber-600">
                Continue <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">Collection Details</h2>
              <div className="space-y-4">
                <div>
                  <Label>Collection Date</Label>
                  <Input
                    type="date"
                    value={bookingData.collection_date}
                    onChange={(e) => setBookingData(prev => ({ ...prev, collection_date: e.target.value }))}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label>Time Slot</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setBookingData(prev => ({ ...prev, collection_slot: slot }))}
                        className={`p-3 rounded-lg border-2 text-sm ${
                          bookingData.collection_slot === slot
                            ? 'border-amber-500 bg-amber-50'
                            : 'border-gray-200'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button onClick={handleSubmit} className="flex-1 bg-amber-500 hover:bg-amber-600">
                  Book Now
                </Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center"
            >
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
              <p className="text-gray-600 mb-6">Your sample will be collected on {format(new Date(bookingData.collection_date), 'PPP')}</p>
              <Button onClick={() => navigate(createPageUrl('Home'))} className="bg-amber-500">
                Go Home
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}