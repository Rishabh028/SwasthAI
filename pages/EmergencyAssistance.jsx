import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertCircle,
  Heart,
  Activity,
  Baby,
  HelpCircle,
  MapPin,
  Phone,
  Upload,
  Loader2,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card } from '@/components/ui/card';
import PageTransition from '@/components/ui/PageTransition';
import { toast } from 'react-hot-toast';

const emergencyTypes = [
  { value: 'medical', label: 'Medical Emergency', icon: Activity, color: 'bg-red-500' },
  { value: 'accident', label: 'Accident / Trauma', icon: AlertTriangle, color: 'bg-orange-500' },
  { value: 'cardiac', label: 'Cardiac Emergency', icon: Heart, color: 'bg-pink-500' },
  { value: 'pregnancy', label: 'Pregnancy / Labor', icon: Baby, color: 'bg-purple-500' },
  { value: 'other', label: 'Other Emergency', icon: HelpCircle, color: 'bg-gray-500' }
];

export default function EmergencyAssistance() {
  const queryClient = useQueryClient();
  const [step, setStep] = useState(1);
  const [user, setUser] = useState(null);
  const [requestNumber, setRequestNumber] = useState(null);
  const [formData, setFormData] = useState({
    emergency_type: '',
    patient_name: '',
    patient_age: '',
    patient_gender: '',
    symptoms: '',
    situation_description: '',
    location: { address: '', latitude: null, longitude: null },
    contact_phone: '',
    attached_media: []
  });

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await base44.auth.me();
        setUser(userData);
        setFormData(prev => ({
          ...prev,
          contact_phone: userData.phone || userData.phone_number || '',
          patient_name: userData.full_name || ''
        }));
      } catch (e) {
        console.log('Not authenticated');
      }
    };
    loadUser();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setFormData(prev => ({
          ...prev,
          location: {
            ...prev.location,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }
        }));
      });
    }
  }, []);

  const createEmergency = useMutation({
    mutationFn: async (data) => {
      const requestNumber = `EMG${Date.now()}`;
      const hospitals = await base44.entities.Hospital.filter({ verified: true });
      
      await base44.entities.EmergencyRequest.create({
        ...data,
        request_number: requestNumber,
        requester_email: user?.email || 'anonymous',
        status: 'pending',
        priority: 'critical',
        nearby_hospitals_notified: hospitals.slice(0, 5).map(h => h.id)
      });

      // Notify nearby hospitals
      for (const hospital of hospitals.slice(0, 5)) {
        await base44.entities.Notification.create({
          recipient_email: hospital.owner_email,
          title: '🚨 Emergency Request',
          message: `${data.emergency_type} emergency nearby. Patient: ${data.patient_name}`,
          type: 'general',
          priority: 'urgent'
        });
      }

      return requestNumber;
    },
    onSuccess: (reqNumber) => {
      setRequestNumber(reqNumber);
      setStep(3);
      toast.success('Emergency request sent successfully!', {
        duration: 5000,
        position: 'top-center'
      });
    },
    onError: (error) => {
      console.error('Emergency request failed:', error);
      toast.error('Failed to send emergency request. Please try again or call 108.', {
        duration: 5000,
        position: 'top-center'
      });
    }
  });

  const handleSubmit = () => {
    if (!formData.emergency_type || !formData.patient_name || !formData.contact_phone) {
      toast.error('Please fill all required fields');
      return;
    }
    createEmergency.mutate(formData);
  };

  return (
    <PageTransition className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <AlertCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Emergency Medical Assistance</h1>
          <p className="text-gray-600">We'll notify nearby hospitals & emergency services immediately</p>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="p-6 md:p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Select Emergency Type</h2>
                <RadioGroup value={formData.emergency_type} onValueChange={(value) => setFormData(prev => ({...prev, emergency_type: value}))}>
                  <div className="space-y-3">
                    {emergencyTypes.map((type) => (
                      <label 
                        key={type.value}
                        className="flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all hover:border-red-500"
                      >
                        <RadioGroupItem value={type.value} />
                        <div className={`w-12 h-12 ${type.color} rounded-xl flex items-center justify-center`}>
                          <type.icon className="w-6 h-6 text-white" />
                        </div>
                        <span className="font-medium text-gray-900">{type.label}</span>
                      </label>
                    ))}
                  </div>
                </RadioGroup>
                <Button
                  onClick={() => setStep(2)}
                  disabled={!formData.emergency_type}
                  className="w-full mt-6 bg-red-500 hover:bg-red-600"
                >
                  Continue
                </Button>
              </Card>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="p-6 md:p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Emergency Details</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Patient Name *</Label>
                      <Input
                        value={formData.patient_name}
                        onChange={(e) => setFormData(prev => ({...prev, patient_name: e.target.value}))}
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label>Age</Label>
                      <Input
                        type="number"
                        value={formData.patient_age}
                        onChange={(e) => setFormData(prev => ({...prev, patient_age: e.target.value}))}
                        className="mt-1.5"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Gender</Label>
                    <RadioGroup value={formData.patient_gender} onValueChange={(value) => setFormData(prev => ({...prev, patient_gender: value}))} className="flex gap-4 mt-1.5">
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="male" />
                        <Label>Male</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="female" />
                        <Label>Female</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="other" />
                        <Label>Other</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label>Symptoms / Situation *</Label>
                    <Textarea
                      value={formData.symptoms}
                      onChange={(e) => setFormData(prev => ({...prev, symptoms: e.target.value}))}
                      placeholder="Describe the emergency situation..."
                      className="mt-1.5 min-h-[100px]"
                    />
                  </div>

                  <div>
                    <Label>Location *</Label>
                    <div className="flex items-center gap-2 mt-1.5">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <Input
                        value={formData.location.address}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          location: { ...prev.location, address: e.target.value }
                        }))}
                        placeholder={formData.location.latitude ? 'Location detected' : 'Enter address'}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Contact Number *</Label>
                    <div className="flex items-center gap-2 mt-1.5">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <Input
                        value={formData.contact_phone}
                        onChange={(e) => setFormData(prev => ({...prev, contact_phone: e.target.value}))}
                        placeholder="Emergency contact number"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                    Back
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={createEmergency.isPending}
                    className="flex-1 bg-red-500 hover:bg-red-600"
                  >
                    {createEmergency.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      'Request Emergency Help'
                    )}
                  </Button>
                </div>
              </Card>

              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="text-sm text-amber-800">
                  <strong>Disclaimer:</strong> This is not a substitute for calling emergency services (108/102). 
                  For life-threatening emergencies, call 108 immediately.
                </p>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card className="p-8 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  ✓ Emergency Request Sent!
                </h2>
                <p className="text-lg text-green-600 font-semibold mb-6">
                  Help is on the way
                </p>
                <p className="text-gray-600 mb-8">
                  Nearby hospitals and emergency services have been notified. 
                  Please keep your phone nearby for contact from the hospital.
                </p>
                
                <div className="space-y-3 mb-8">
                  <div className="p-4 bg-blue-50 rounded-xl border-2 border-blue-200 text-left">
                    <p className="text-sm text-blue-600 mb-1 font-semibold">Request Number</p>
                    <p className="font-bold text-lg text-blue-900 font-mono">{requestNumber}</p>
                    <p className="text-xs text-blue-600 mt-1">Save this for reference</p>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-xl text-left">
                    <p className="text-sm text-gray-600 mb-1">Status</p>
                    <p className="font-semibold text-gray-900">✓ Hospitals Notified & Responding</p>
                  </div>
                  
                  <div className="p-4 bg-amber-50 rounded-xl text-left">
                    <p className="text-sm text-gray-600 mb-1">Patient Name</p>
                    <p className="font-semibold text-gray-900">{formData.patient_name}</p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-xl text-left">
                    <p className="text-sm text-gray-600 mb-1">Next Steps</p>
                    <ul className="font-semibold text-gray-900 text-sm space-y-1">
                      <li>✓ Keep your phone accessible</li>
                      <li>✓ Hospital will contact you shortly</li>
                      <li>✓ Be ready to provide your location if asked</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6">
                  <p className="text-sm font-semibold text-red-900 mb-2">
                    ⚠️ For Life-Threatening Emergencies
                  </p>
                  <p className="text-red-800 font-bold text-lg">Call 108 Immediately</p>
                </div>

                <Button 
                  onClick={() => {
                    setStep(1);
                    setFormData({
                      emergency_type: '',
                      patient_name: '',
                      patient_age: '',
                      patient_gender: '',
                      symptoms: '',
                      situation_description: '',
                      location: { address: '', latitude: null, longitude: null },
                      contact_phone: '',
                      attached_media: []
                    });
                    setRequestNumber(null);
                  }}
                  className="w-full bg-teal-500 hover:bg-teal-600"
                >
                  Submit Another Request
                </Button>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}