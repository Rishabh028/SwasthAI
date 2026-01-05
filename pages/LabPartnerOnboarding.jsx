import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import {
  TestTube,
  Upload,
  ArrowRight,
  Loader2,
  Shield,
  CheckCircle
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import PageTransition from '@/components/ui/PageTransition';
import { toast } from 'react-hot-toast';

export default function LabPartnerOnboarding() {
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    lab_name: '',
    license_number: '',
    nabl_accredited: false,
    contact_phone: '',
    contact_email: '',
    lab_address: {
      address_line1: '',
      city: '',
      state: '',
      pincode: ''
    },
    verification_documents: [],
    home_collection: true
  });

  const createProfile = useMutation({
    mutationFn: async (data) => {
      const user = await base44.auth.me();
      return base44.entities.LabPartner.create({
        ...data,
        partner_user_email: user.email,
        verification_status: 'pending',
        is_active: false
      });
    },
    onSuccess: () => {
      toast.success('Application submitted! We will verify your credentials.');
      navigate(createPageUrl('LabPartnerDashboard'));
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
    if (!formData.lab_name || !formData.license_number) {
      toast.error('Please fill all required fields');
      return;
    }
    createProfile.mutate(formData);
  };

  return (
    <PageTransition className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <TestTube className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Partner with SwasthAI</h1>
          <p className="text-gray-600">Complete your lab profile to start receiving bookings</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8"
        >
          <h2 className="text-xl font-bold mb-6">Lab Details</h2>

          <div className="space-y-4">
            <div>
              <Label>Lab Name *</Label>
              <Input
                value={formData.lab_name}
                onChange={(e) => setFormData(prev => ({ ...prev, lab_name: e.target.value }))}
                placeholder="Enter lab name"
                className="mt-1.5"
              />
            </div>

            <div>
              <Label>License Number *</Label>
              <Input
                value={formData.license_number}
                onChange={(e) => setFormData(prev => ({ ...prev, license_number: e.target.value }))}
                placeholder="Lab license number"
                className="mt-1.5"
              />
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="nabl"
                checked={formData.nabl_accredited}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, nabl_accredited: checked }))}
              />
              <Label htmlFor="nabl" className="cursor-pointer">
                NABL Accredited Lab
              </Label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Contact Phone *</Label>
                <Input
                  value={formData.contact_phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, contact_phone: e.target.value }))}
                  placeholder="+91 XXXXX XXXXX"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label>Contact Email</Label>
                <Input
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => setFormData(prev => ({ ...prev, contact_email: e.target.value }))}
                  placeholder="lab@example.com"
                  className="mt-1.5"
                />
              </div>
            </div>

            <div>
              <Label>Lab Address *</Label>
              <Input
                value={formData.lab_address.address_line1}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  lab_address: { ...prev.lab_address, address_line1: e.target.value }
                }))}
                placeholder="Street address"
                className="mt-1.5"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>City *</Label>
                <Input
                  value={formData.lab_address.city}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    lab_address: { ...prev.lab_address, city: e.target.value }
                  }))}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label>State *</Label>
                <Input
                  value={formData.lab_address.state}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    lab_address: { ...prev.lab_address, state: e.target.value }
                  }))}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label>Pincode *</Label>
                <Input
                  value={formData.lab_address.pincode}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    lab_address: { ...prev.lab_address, pincode: e.target.value }
                  }))}
                  className="mt-1.5"
                />
              </div>
            </div>

            <div>
              <Label>Upload License & Accreditation Documents *</Label>
              <div className="mt-1.5 border-2 border-dashed border-gray-200 rounded-xl p-6 text-center">
                <input
                  type="file"
                  id="doc-upload"
                  className="hidden"
                  onChange={handleFileUpload}
                  accept=".pdf,.jpg,.jpeg,.png"
                  multiple
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
                  <div className="mt-3 flex flex-wrap gap-2 justify-center">
                    {formData.verification_documents.map((_, idx) => (
                      <Badge key={idx} className="bg-green-50 text-green-700">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Document {idx + 1}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={createProfile.isPending}
              className="w-full bg-amber-500 hover:bg-amber-600"
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
      </div>
    </PageTransition>
  );
}