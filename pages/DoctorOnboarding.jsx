import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import {
  Stethoscope,
  Upload,
  CheckCircle,
  ArrowRight,
  Loader2,
  Shield
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PageTransition from '@/components/ui/PageTransition';
import { toast } from 'react-hot-toast';

export default function DoctorOnboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    nmc_registration: '',
    specialization: '',
    qualification: '',
    experience_years: '',
    consultation_fee: '',
    hospital_name: '',
    bio: '',
    verification_documents: [],
    languages: []
  });

  const verifyNMC = useMutation({
    mutationFn: async (nmcNumber) => {
      // Simulate NMC verification API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      return { verified: true, name: 'Dr. Sample Name' };
    }
  });

  const createProfile = useMutation({
    mutationFn: async (data) => {
      const user = await base44.auth.me();
      return base44.entities.DoctorProfile.create({
        ...data,
        doctor_user_email: user.email,
        verification_status: 'pending',
        is_active: false
      });
    },
    onSuccess: () => {
      toast.success('Application submitted! We will verify your credentials.');
      navigate(createPageUrl('DoctorDashboard'));
    }
  });

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setFormData(prev => ({
        ...prev,
        verification_documents: [...prev.verification_documents, file_url]
      }));
      toast.success('Document uploaded');
    } catch (error) {
      toast.error('Failed to upload document');
    }
    setUploading(false);
  };

  const handleSubmit = () => {
    createProfile.mutate(formData);
  };

  return (
    <PageTransition className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Stethoscope className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Join SwasthAI as a Doctor</h1>
          <p className="text-gray-600">Complete your profile to start consulting patients</p>
        </div>

        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8"
          >
            <h2 className="text-xl font-bold mb-6">NMC Verification</h2>
            
            <div className="space-y-4">
              <div>
                <Label>NMC Registration Number *</Label>
                <Input
                  value={formData.nmc_registration}
                  onChange={(e) => setFormData(prev => ({ ...prev, nmc_registration: e.target.value }))}
                  placeholder="Enter your NMC registration number"
                  className="mt-1.5"
                />
                <p className="text-xs text-gray-500 mt-1">
                  We will verify your credentials with the National Medical Commission
                </p>
              </div>

              <Button
                onClick={() => {
                  if (!formData.nmc_registration) {
                    toast.error('Please enter NMC registration number');
                    return;
                  }
                  verifyNMC.mutate(formData.nmc_registration, {
                    onSuccess: () => {
                      toast.success('NMC verification successful!');
                      setStep(2);
                    }
                  });
                }}
                disabled={verifyNMC.isPending}
                className="w-full bg-teal-500 hover:bg-teal-600"
              >
                {verifyNMC.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4 mr-2" />
                    Verify NMC Registration
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8"
          >
            <h2 className="text-xl font-bold mb-6">Professional Details</h2>

            <div className="space-y-4">
              <div>
                <Label>Specialization *</Label>
                <Select 
                  value={formData.specialization}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, specialization: value }))}
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select specialization" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general_physician">General Physician</SelectItem>
                    <SelectItem value="cardiologist">Cardiologist</SelectItem>
                    <SelectItem value="dermatologist">Dermatologist</SelectItem>
                    <SelectItem value="orthopedic">Orthopedic</SelectItem>
                    <SelectItem value="pediatrician">Pediatrician</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Qualification *</Label>
                  <Input
                    value={formData.qualification}
                    onChange={(e) => setFormData(prev => ({ ...prev, qualification: e.target.value }))}
                    placeholder="MBBS, MD"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label>Experience (years) *</Label>
                  <Input
                    type="number"
                    value={formData.experience_years}
                    onChange={(e) => setFormData(prev => ({ ...prev, experience_years: e.target.value }))}
                    className="mt-1.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Consultation Fee (₹) *</Label>
                  <Input
                    type="number"
                    value={formData.consultation_fee}
                    onChange={(e) => setFormData(prev => ({ ...prev, consultation_fee: e.target.value }))}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label>Hospital/Clinic Name</Label>
                  <Input
                    value={formData.hospital_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, hospital_name: e.target.value }))}
                    className="mt-1.5"
                  />
                </div>
              </div>

              <div>
                <Label>Bio</Label>
                <Textarea
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Tell patients about yourself..."
                  className="mt-1.5 h-24"
                />
              </div>

              <div>
                <Label>Upload Documents (Degree, License)</Label>
                <div className="mt-1.5 border-2 border-dashed border-gray-200 rounded-xl p-6 text-center">
                  <input
                    type="file"
                    id="doc-upload"
                    className="hidden"
                    onChange={handleFileUpload}
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                  <label htmlFor="doc-upload" className="cursor-pointer">
                    {uploading ? (
                      <Loader2 className="w-8 h-8 mx-auto text-gray-400 animate-spin" />
                    ) : (
                      <>
                        <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">Click to upload documents</p>
                      </>
                    )}
                  </label>
                  {formData.verification_documents.length > 0 && (
                    <p className="text-sm text-green-600 mt-2">
                      {formData.verification_documents.length} document(s) uploaded
                    </p>
                  )}
                </div>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={createProfile.isPending}
                className="w-full bg-teal-500 hover:bg-teal-600"
              >
                {createProfile.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Application
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
}