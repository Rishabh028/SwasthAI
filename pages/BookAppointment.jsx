import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { format, addDays, isSameDay } from 'date-fns';
import {
  Calendar,
  Clock,
  Video,
  Building2,
  CreditCard,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  User,
  Phone,
  Mail,
  FileText,
  BadgeCheck,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import PageTransition from '@/components/ui/PageTransition';
import { SkeletonCard } from '@/components/ui/SkeletonLoader';
import { toast } from 'react-hot-toast';

const timeSlots = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM',
  '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM'
];

const steps = [
  { id: 1, title: 'Select Slot', icon: Calendar },
  { id: 2, title: 'Patient Details', icon: User },
  { id: 3, title: 'Payment', icon: CreditCard },
  { id: 4, title: 'Confirmation', icon: CheckCircle },
];

export default function BookAppointment() {
  const urlParams = new URLSearchParams(window.location.search);
  const doctorId = urlParams.get('doctorId');
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(addDays(new Date(), 1));
  const [selectedTime, setSelectedTime] = useState('');
  const [consultationType, setConsultationType] = useState('video');
  const [patientDetails, setPatientDetails] = useState({
    name: '',
    phone: '',
    email: '',
    symptoms: ''
  });
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const isAuth = await base44.auth.isAuthenticated();
        if (isAuth) {
          const userData = await base44.auth.me();
          setUser(userData);
          setPatientDetails(prev => ({
            ...prev,
            name: userData.full_name || '',
            email: userData.email || ''
          }));
        }
      } catch (e) {
        console.log('Not authenticated');
      }
    };
    loadUser();
  }, []);

  const { data: doctor, isLoading } = useQuery({
    queryKey: ['doctor', doctorId],
    queryFn: async () => {
      const doctors = await base44.entities.Doctor.filter({ id: doctorId });
      return doctors[0];
    },
    enabled: !!doctorId
  });

  const createAppointment = useMutation({
    mutationFn: (data) => base44.entities.Appointment.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      setStep(4);
      toast.success('Appointment booked successfully!');
    },
    onError: (error) => {
      toast.error('Failed to book appointment. Please try again.');
    }
  });

  const handleSubmit = () => {
    if (!user) {
      base44.auth.redirectToLogin(window.location.href);
      return;
    }

    createAppointment.mutate({
      doctor_id: doctorId,
      doctor_name: doctor.name,
      doctor_specialization: doctor.specialization,
      patient_name: patientDetails.name,
      patient_email: patientDetails.email,
      patient_phone: patientDetails.phone,
      appointment_date: format(selectedDate, 'yyyy-MM-dd'),
      appointment_time: selectedTime,
      consultation_type: consultationType,
      symptoms: patientDetails.symptoms,
      amount_paid: doctor.consultation_fee,
      payment_status: 'paid',
      status: 'confirmed',
      meeting_link: consultationType === 'video' ? `https://meet.swasthai.com/${Date.now()}` : null
    });
  };

  const dates = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i + 1));

  if (isLoading) {
    return (
      <PageTransition className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <SkeletonCard />
        </div>
      </PageTransition>
    );
  }

  if (!doctor) {
    return (
      <PageTransition className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center py-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Doctor not found</h2>
          <Button onClick={() => navigate(createPageUrl('Doctors'))}>
            Browse Doctors
          </Button>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {/* Progress Steps */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 mb-6">
          <div className="flex items-center justify-between">
            {steps.map((s, index) => (
              <React.Fragment key={s.id}>
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    step >= s.id 
                      ? 'bg-teal-500 text-white' 
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                    {step > s.id ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <s.icon className="w-5 h-5" />
                    )}
                  </div>
                  <span className={`text-xs mt-2 hidden sm:block ${
                    step >= s.id ? 'text-teal-600 font-medium' : 'text-gray-400'
                  }`}>
                    {s.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 ${
                    step > s.id ? 'bg-teal-500' : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* Step 1: Select Slot */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
                >
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Select Date & Time</h2>

                  {/* Consultation Type */}
                  <div className="mb-6">
                    <Label className="text-sm font-medium mb-3 block">Consultation Type</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {doctor.is_video_consultation && (
                        <button
                          onClick={() => setConsultationType('video')}
                          className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                            consultationType === 'video'
                              ? 'border-teal-500 bg-teal-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <Video className={`w-5 h-5 ${consultationType === 'video' ? 'text-teal-600' : 'text-gray-400'}`} />
                          <span className={consultationType === 'video' ? 'font-medium text-teal-700' : 'text-gray-600'}>
                            Video Consult
                          </span>
                        </button>
                      )}
                      {doctor.is_clinic_visit && (
                        <button
                          onClick={() => setConsultationType('clinic')}
                          className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                            consultationType === 'clinic'
                              ? 'border-teal-500 bg-teal-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <Building2 className={`w-5 h-5 ${consultationType === 'clinic' ? 'text-teal-600' : 'text-gray-400'}`} />
                          <span className={consultationType === 'clinic' ? 'font-medium text-teal-700' : 'text-gray-600'}>
                            Clinic Visit
                          </span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Date Selection */}
                  <div className="mb-6">
                    <Label className="text-sm font-medium mb-3 block">Select Date</Label>
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                      {dates.map((date) => (
                        <button
                          key={date.toISOString()}
                          onClick={() => setSelectedDate(date)}
                          className={`flex-shrink-0 flex flex-col items-center p-3 rounded-xl border-2 min-w-[80px] transition-all ${
                            isSameDay(date, selectedDate)
                              ? 'border-teal-500 bg-teal-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <span className="text-xs text-gray-500">{format(date, 'EEE')}</span>
                          <span className={`text-lg font-bold ${
                            isSameDay(date, selectedDate) ? 'text-teal-700' : 'text-gray-900'
                          }`}>
                            {format(date, 'd')}
                          </span>
                          <span className="text-xs text-gray-500">{format(date, 'MMM')}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Time Slots */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">Select Time Slot</Label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {timeSlots.map((time) => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`py-2.5 px-3 rounded-lg border-2 text-sm font-medium transition-all ${
                            selectedTime === time
                              ? 'border-teal-500 bg-teal-50 text-teal-700'
                              : 'border-gray-200 hover:border-gray-300 text-gray-600'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={() => setStep(2)}
                    disabled={!selectedTime}
                    className="w-full mt-6 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </motion.div>
              )}

              {/* Step 2: Patient Details */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
                >
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Patient Details</h2>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={patientDetails.name}
                        onChange={(e) => setPatientDetails(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter patient name"
                        className="mt-1.5"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        value={patientDetails.phone}
                        onChange={(e) => setPatientDetails(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="Enter phone number"
                        className="mt-1.5"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={patientDetails.email}
                        onChange={(e) => setPatientDetails(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="Enter email address"
                        className="mt-1.5"
                      />
                    </div>

                    <div>
                      <Label htmlFor="symptoms">Describe your symptoms</Label>
                      <Textarea
                        id="symptoms"
                        value={patientDetails.symptoms}
                        onChange={(e) => setPatientDetails(prev => ({ ...prev, symptoms: e.target.value }))}
                        placeholder="Briefly describe your symptoms or reason for consultation..."
                        className="mt-1.5 h-32"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                    <Button
                      onClick={() => setStep(3)}
                      disabled={!patientDetails.name || !patientDetails.phone}
                      className="flex-1 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600"
                    >
                      Continue
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Payment */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
                >
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Payment</h2>

                  {/* Order Summary */}
                  <div className="bg-gray-50 rounded-xl p-4 mb-6">
                    <h3 className="font-medium text-gray-900 mb-3">Order Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Consultation Fee</span>
                        <span>₹{doctor.consultation_fee}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Platform Fee</span>
                        <span>₹0</span>
                      </div>
                      <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-semibold">
                        <span>Total</span>
                        <span className="text-teal-600">₹{doctor.consultation_fee}</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Methods (Demo) */}
                  <div className="mb-6">
                    <Label className="text-sm font-medium mb-3 block">Payment Method</Label>
                    <RadioGroup defaultValue="upi">
                      <div className="space-y-2">
                        <label className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 cursor-pointer hover:border-teal-500 transition-colors">
                          <RadioGroupItem value="upi" id="upi" />
                          <span className="font-medium">UPI</span>
                        </label>
                        <label className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 cursor-pointer hover:border-teal-500 transition-colors">
                          <RadioGroupItem value="card" id="card" />
                          <span className="font-medium">Credit/Debit Card</span>
                        </label>
                        <label className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 cursor-pointer hover:border-teal-500 transition-colors">
                          <RadioGroupItem value="netbanking" id="netbanking" />
                          <span className="font-medium">Net Banking</span>
                        </label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={createAppointment.isPending}
                      className="flex-1 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600"
                    >
                      {createAppointment.isPending ? 'Processing...' : `Pay ₹${doctor.consultation_fee}`}
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Confirmation */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                    className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </motion.div>

                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
                  <p className="text-gray-600 mb-6">
                    Your appointment has been successfully booked
                  </p>

                  <div className="bg-gray-50 rounded-xl p-4 text-left mb-6">
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Doctor</span>
                        <span className="font-medium">Dr. {doctor.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Date</span>
                        <span className="font-medium">{format(selectedDate, 'PPP')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Time</span>
                        <span className="font-medium">{selectedTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Type</span>
                        <span className="font-medium capitalize">{consultationType} Consultation</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      variant="outline" 
                      onClick={() => navigate(createPageUrl('MyAppointments'))}
                      className="flex-1"
                    >
                      View Appointments
                    </Button>
                    <Button 
                      onClick={() => navigate(createPageUrl('Home'))}
                      className="flex-1 bg-gradient-to-r from-teal-500 to-emerald-500"
                    >
                      Go Home
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar - Doctor Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24 space-y-6">
              <div className="flex items-start gap-4">
                {doctor.profile_image ? (
                  <img 
                    src={doctor.profile_image} 
                    alt={doctor.name}
                    className="w-16 h-16 rounded-xl object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-teal-100 to-emerald-100 flex items-center justify-center">
                    <span className="text-xl font-bold text-teal-600">
                      {doctor.name?.charAt(0)}
                    </span>
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-gray-900">Dr. {doctor.name}</h3>
                  <p className="text-sm text-gray-500">{doctor.qualification}</p>
                  <p className="text-sm text-teal-600 capitalize">{doctor.specialization?.replace(/_/g, ' ')}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 space-y-3 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{doctor.rating?.toFixed(1) || 'New'} ({doctor.total_reviews || 0} reviews)</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{doctor.experience_years} years experience</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Building2 className="w-4 h-4" />
                  <span>{doctor.hospital_name}</span>
                </div>
              </div>

              {doctor.latitude && doctor.longitude && (
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-sm font-medium text-gray-700 mb-2">Location</p>
                  <div className="h-32 rounded-xl overflow-hidden bg-gray-100">
                    <iframe
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      src={`https://www.openstreetmap.org/export/embed.html?bbox=${doctor.longitude-0.01},${doctor.latitude-0.01},${doctor.longitude+0.01},${doctor.latitude+0.01}&layer=mapnik&marker=${doctor.latitude},${doctor.longitude}`}
                    />
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Consultation Fee</span>
                  <span className="text-xl font-bold text-teal-600">₹{doctor.consultation_fee}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}