import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import {
  Building2,
  MapPin,
  Phone,
  Upload,
  CheckCircle,
  Loader2,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import PageTransition from '@/components/ui/PageTransition';
import { toast } from 'react-hot-toast';

const departments = [
  'cardiology', 'orthopedic', 'pediatrics', 'gynecology', 'neurology',
  'dermatology', 'ent', 'ophthalmology', 'emergency', 'icu', 'general_medicine'
];

export default function HospitalRegistration() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [step, setStep] = useState(1);
  const [uploading, setUploading] = useState({});
  const [formData, setFormData] = useState({
    hospital_name: '',
    hospital_type: 'hospital',
    address: { street: '', area: '', city: '', state: '', pincode: '' },
    latitude: null,
    longitude: null,
    contact_phone: '',
    contact_email: '',
    departments: [],
    total_doctors: 0,
    has_emergency_services: false,
    has_icu: false,
    has_ambulance: false,
    is_24x7: false,
    visiting_hours: '',
    insurance_supported: false,
    registration_certificate_url: '',
    trade_license_url: '',
    authorized_rep_id_url: ''
  });

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await base44.auth.me();
        setUser(userData);
        setFormData(prev => ({
          ...prev,
          owner_email: userData.email,
          contact_email: userData.email
        }));
      } catch (e) {
        base44.auth.redirectToLogin();
      }
    };
    loadUser();
  }, []);

  const handleFileUpload = async (field, e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(prev => ({ ...prev, [field]: true }));
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setFormData(prev => ({ ...prev, [field]: file_url }));
      toast.success('Document uploaded');
    } catch (error) {
      toast.error('Failed to upload document');
    }
    setUploading(prev => ({ ...prev, [field]: false }));
  };

  const submitRegistration = useMutation({
    mutationFn: (data) => base44.entities.HospitalRegistration.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hospitalRegistrations'] });
      setStep(3);
      toast.success('Registration submitted for verification!');
    }
  });

  const handleSubmit = () => {
    if (!formData.hospital_name || !formData.contact_phone || !formData.registration_certificate_url) {
      toast.error('Please fill all required fields and upload documents');
      return;
    }
    submitRegistration.mutate({ ...formData, owner_email: user.email });
  };

  if (!user) return null;

  return (
    <PageTransition className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Hospital / Clinic Registration</h1>
          <p className="text-gray-600">Join SwasthAI's healthcare network</p>
        </div>

        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <Label>Hospital / Clinic Name *</Label>
                <Input
                  value={formData.hospital_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, hospital_name: e.target.value }))}
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label>Type *</Label>
                <Select value={formData.hospital_type} onValueChange={(value) => setFormData(prev => ({ ...prev, hospital_type: value }))}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hospital">Hospital</SelectItem>
                    <SelectItem value="clinic">Clinic</SelectItem>
                    <SelectItem value="nursing_home">Nursing Home</SelectItem>
                    <SelectItem value="specialty_center">Specialty Center</SelectItem>
                    <SelectItem value="diagnostic_center">Diagnostic Center</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Contact Phone *</Label>
                  <Input
                    value={formData.contact_phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, contact_phone: e.target.value }))}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label>Contact Email</Label>
                  <Input
                    value={formData.contact_email}
                    onChange={(e) => setFormData(prev => ({ ...prev, contact_email: e.target.value }))}
                    className="mt-1.5"
                  />
                </div>
              </div>

              <div>
                <Label>Address *</Label>
                <Input
                  value={formData.address.street}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    address: { ...prev.address, street: e.target.value }
                  }))}
                  placeholder="Street"
                  className="mt-1.5 mb-2"
                />
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    value={formData.address.city}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      address: { ...prev.address, city: e.target.value }
                    }))}
                    placeholder="City"
                  />
                  <Input
                    value={formData.address.state}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      address: { ...prev.address, state: e.target.value }
                    }))}
                    placeholder="State"
                  />
                  <Input
                    value={formData.address.pincode}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      address: { ...prev.address, pincode: e.target.value }
                    }))}
                    placeholder="Pincode"
                  />
                </div>
              </div>

              <Button onClick={() => setStep(2)} className="w-full bg-purple-500 hover:bg-purple-600">
                Continue
              </Button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">Medical Capabilities & Documents</h2>
            <div className="space-y-6">
              <div>
                <Label className="mb-3 block">Departments (select all that apply)</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {departments.map((dept) => (
                    <div key={dept} className="flex items-center gap-2">
                      <Checkbox
                        checked={formData.departments.includes(dept)}
                        onCheckedChange={(checked) => {
                          setFormData(prev => ({
                            ...prev,
                            departments: checked
                              ? [...prev.departments, dept]
                              : prev.departments.filter(d => d !== dept)
                          }));
                        }}
                      />
                      <Label className="capitalize cursor-pointer">{dept.replace(/_/g, ' ')}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={formData.has_emergency_services}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, has_emergency_services: checked }))}
                  />
                  <Label>Emergency Services</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={formData.has_icu}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, has_icu: checked }))}
                  />
                  <Label>ICU Available</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={formData.has_ambulance}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, has_ambulance: checked }))}
                  />
                  <Label>Ambulance Service</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={formData.is_24x7}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_24x7: checked }))}
                  />
                  <Label>24×7 Available</Label>
                </div>
              </div>

              <div>
                <Label>Visiting Hours</Label>
                <Input
                  value={formData.visiting_hours}
                  onChange={(e) => setFormData(prev => ({ ...prev, visiting_hours: e.target.value }))}
                  placeholder="e.g., 9 AM - 6 PM"
                  className="mt-1.5"
                />
              </div>

              <div className="space-y-4">
                <Label>Upload Documents *</Label>
                <div className="space-y-3">
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-4">
                    <input
                      type="file"
                      id="registration_cert"
                      className="hidden"
                      onChange={(e) => handleFileUpload('registration_certificate_url', e)}
                      accept="image/*,.pdf"
                    />
                    <label htmlFor="registration_cert" className="cursor-pointer flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Registration Certificate</p>
                        <p className="text-sm text-gray-500">Hospital registration document</p>
                      </div>
                      {uploading.registration_certificate_url ? (
                        <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                      ) : formData.registration_certificate_url ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <Upload className="w-5 h-5 text-gray-400" />
                      )}
                    </label>
                  </div>

                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-4">
                    <input
                      type="file"
                      id="trade_license"
                      className="hidden"
                      onChange={(e) => handleFileUpload('trade_license_url', e)}
                      accept="image/*,.pdf"
                    />
                    <label htmlFor="trade_license" className="cursor-pointer flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Trade License</p>
                        <p className="text-sm text-gray-500">Business license document</p>
                      </div>
                      {uploading.trade_license_url ? (
                        <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                      ) : formData.trade_license_url ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <Upload className="w-5 h-5 text-gray-400" />
                      )}
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={submitRegistration.isPending}
                  className="flex-1 bg-purple-500 hover:bg-purple-600"
                >
                  {submitRegistration.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit for Verification'
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Registration Submitted!</h2>
            <p className="text-gray-600 mb-8">
              Your hospital registration is under review. Our team will verify your documents 
              and activate your account within 24-48 hours.
            </p>
            <div className="p-4 bg-amber-50 rounded-xl mb-6">
              <div className="flex items-center gap-2 text-amber-800">
                <Clock className="w-5 h-5" />
                <p className="text-sm font-medium">Status: Pending Verification</p>
              </div>
            </div>
            <Button onClick={() => navigate(createPageUrl('Home'))} className="bg-purple-500 hover:bg-purple-600">
              Go to Home
            </Button>
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
}