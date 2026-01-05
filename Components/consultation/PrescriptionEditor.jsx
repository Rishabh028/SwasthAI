import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { 
  X, Plus, Trash2, Save, Send, Search, Loader2, CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'react-hot-toast';

export default function PrescriptionEditor({ appointment, patientProfile, onClose }) {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [prescription, setPrescription] = useState({
    diagnosis: '',
    symptoms: appointment.symptoms || '',
    medicines: [],
    tests_recommended: [],
    special_instructions: '',
    follow_up_date: ''
  });

  // Fetch medicines from database
  const { data: medicines = [] } = useQuery({
    queryKey: ['medicines'],
    queryFn: () => base44.entities.Medicine.list('name', 100)
  });

  const filteredMedicines = medicines.filter(med =>
    med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    med.generic_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const createPrescription = useMutation({
    mutationFn: async (data) => {
      // Get doctor profile
      const doctorProfiles = await base44.entities.DoctorProfile.filter({
        doctor_user_email: appointment.doctor_email || appointment.created_by
      });
      
      const doctorProfile = doctorProfiles[0];
      const prescriptionNumber = `RX${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
      
      const prescriptionData = {
        ...data,
        appointment_id: appointment.id,
        patient_email: appointment.patient_email,
        patient_name: appointment.patient_name,
        doctor_email: appointment.doctor_email || appointment.created_by,
        doctor_name: appointment.doctor_name,
        doctor_qualification: doctorProfile?.qualification || 'MBBS',
        doctor_registration: doctorProfile?.nmc_registration || 'N/A',
        prescription_number: prescriptionNumber,
        issued_at: new Date().toISOString(),
        digital_signature: `${appointment.doctor_email}_${Date.now()}`,
        status: 'issued'
      };

      return base44.entities.Prescription.create(prescriptionData);
    },
    onSuccess: async (newPrescription) => {
      // Update appointment with prescription reference
      await base44.entities.Appointment.update(appointment.id, {
        status: 'completed',
        prescription_url: `prescription_${newPrescription.id}`
      });

      // Create notification for patient
      await base44.entities.Notification.create({
        recipient_email: appointment.patient_email,
        title: 'Prescription Issued',
        message: `Dr. ${appointment.doctor_name} has issued your prescription. You can view and order medicines now.`,
        type: 'appointment',
        link: `MyAppointments`,
        priority: 'high'
      });

      queryClient.invalidateQueries({ queryKey: ['prescriptions'] });
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast.success('Prescription issued successfully!');
      onClose();
    }
  });

  const addMedicine = (medicine) => {
    if (prescription.medicines.some(m => m.medicine_id === medicine.id)) {
      toast.error('Medicine already added');
      return;
    }

    setPrescription({
      ...prescription,
      medicines: [
        ...prescription.medicines,
        {
          medicine_id: medicine.id,
          medicine_name: medicine.name,
          dosage: '',
          frequency: '',
          duration: '',
          instructions: '',
          quantity: 1
        }
      ]
    });
    setSearchTerm('');
  };

  const updateMedicine = (index, field, value) => {
    const updated = [...prescription.medicines];
    updated[index] = { ...updated[index], [field]: value };
    setPrescription({ ...prescription, medicines: updated });
  };

  const removeMedicine = (index) => {
    setPrescription({
      ...prescription,
      medicines: prescription.medicines.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = () => {
    if (!prescription.diagnosis) {
      toast.error('Please add diagnosis');
      return;
    }
    if (prescription.medicines.length === 0) {
      toast.error('Please add at least one medicine');
      return;
    }

    // Validate all medicines have required fields
    const invalidMedicine = prescription.medicines.find(
      m => !m.dosage || !m.frequency || !m.duration
    );
    if (invalidMedicine) {
      toast.error('Please complete all medicine details');
      return;
    }

    createPrescription.mutate(prescription);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="flex items-center justify-between">
            <span>Create Prescription</span>
            <Badge className="bg-teal-100 text-teal-700">
              E-Prescription
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6" style={{ maxHeight: 'calc(90vh - 180px)' }}>
          <div className="space-y-6 py-4">
            {/* Patient Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Patient Information</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-500">Name</p>
                  <p className="font-medium">{appointment.patient_name}</p>
                </div>
                {patientProfile && (
                  <>
                    <div>
                      <p className="text-gray-500">Age</p>
                      <p className="font-medium">
                        {patientProfile.date_of_birth 
                          ? new Date().getFullYear() - new Date(patientProfile.date_of_birth).getFullYear()
                          : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Blood Group</p>
                      <p className="font-medium">{patientProfile.blood_group || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Gender</p>
                      <p className="font-medium capitalize">{patientProfile.gender || 'N/A'}</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Diagnosis */}
            <div>
              <Label>Diagnosis *</Label>
              <Textarea
                value={prescription.diagnosis}
                onChange={(e) => setPrescription({...prescription, diagnosis: e.target.value})}
                placeholder="Enter diagnosis..."
                rows={2}
                className="mt-1.5"
              />
            </div>

            {/* Symptoms */}
            <div>
              <Label>Symptoms</Label>
              <Textarea
                value={prescription.symptoms}
                onChange={(e) => setPrescription({...prescription, symptoms: e.target.value})}
                placeholder="Enter symptoms..."
                rows={2}
                className="mt-1.5"
              />
            </div>

            {/* Medicines */}
            <div>
              <Label className="mb-3 block">Medicines *</Label>
              
              {/* Medicine Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search medicines..."
                  className="pl-10"
                />
                
                {searchTerm && filteredMedicines.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto z-10">
                    {filteredMedicines.slice(0, 10).map((medicine) => (
                      <button
                        key={medicine.id}
                        onClick={() => addMedicine(medicine)}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 border-b last:border-0"
                      >
                        <p className="font-medium text-sm">{medicine.name}</p>
                        {medicine.generic_name && (
                          <p className="text-xs text-gray-500">{medicine.generic_name}</p>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Added Medicines */}
              <div className="space-y-3">
                {prescription.medicines.map((med, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-sm">{med.medicine_name}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeMedicine(index)}
                        className="h-8 w-8 text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs">Dosage *</Label>
                        <Input
                          value={med.dosage}
                          onChange={(e) => updateMedicine(index, 'dosage', e.target.value)}
                          placeholder="e.g., 500mg"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Frequency *</Label>
                        <Select
                          value={med.frequency}
                          onValueChange={(value) => updateMedicine(index, 'frequency', value)}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Once daily">Once daily</SelectItem>
                            <SelectItem value="Twice daily">Twice daily</SelectItem>
                            <SelectItem value="Three times daily">Three times daily</SelectItem>
                            <SelectItem value="Every 6 hours">Every 6 hours</SelectItem>
                            <SelectItem value="Before meals">Before meals</SelectItem>
                            <SelectItem value="After meals">After meals</SelectItem>
                            <SelectItem value="At bedtime">At bedtime</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs">Duration *</Label>
                        <Select
                          value={med.duration}
                          onValueChange={(value) => updateMedicine(index, 'duration', value)}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="3 days">3 days</SelectItem>
                            <SelectItem value="5 days">5 days</SelectItem>
                            <SelectItem value="7 days">7 days</SelectItem>
                            <SelectItem value="10 days">10 days</SelectItem>
                            <SelectItem value="14 days">14 days</SelectItem>
                            <SelectItem value="1 month">1 month</SelectItem>
                            <SelectItem value="3 months">3 months</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs">Quantity</Label>
                        <Input
                          type="number"
                          value={med.quantity}
                          onChange={(e) => updateMedicine(index, 'quantity', parseInt(e.target.value))}
                          min={1}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs">Instructions</Label>
                      <Input
                        value={med.instructions}
                        onChange={(e) => updateMedicine(index, 'instructions', e.target.value)}
                        placeholder="e.g., Take with water after food"
                        className="mt-1"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Special Instructions */}
            <div>
              <Label>Special Instructions</Label>
              <Textarea
                value={prescription.special_instructions}
                onChange={(e) => setPrescription({...prescription, special_instructions: e.target.value})}
                placeholder="Any special instructions for the patient..."
                rows={3}
                className="mt-1.5"
              />
            </div>

            {/* Follow-up Date */}
            <div>
              <Label>Follow-up Date</Label>
              <Input
                type="date"
                value={prescription.follow_up_date}
                onChange={(e) => setPrescription({...prescription, follow_up_date: e.target.value})}
                min={new Date().toISOString().split('T')[0]}
                className="mt-1.5"
              />
            </div>
          </div>
        </ScrollArea>

        {/* Footer Actions */}
        <div className="p-6 pt-4 border-t flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={createPrescription.isPending}
            className="flex-1 bg-teal-500 hover:bg-teal-600"
          >
            {createPrescription.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Issuing...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Issue Prescription
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}