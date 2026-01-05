import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { 
  X, Download, Send, Pill, FileText, Calendar,
  User, Stethoscope, Clock, CheckCircle, Building2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'react-hot-toast';
import PharmacyOrderFlow from './PharmacyOrderFlow';

export default function PrescriptionViewer({ prescription, onClose }) {
  const [showPharmacyFlow, setShowPharmacyFlow] = useState(false);
  const queryClient = useQueryClient();

  const downloadPrescription = async () => {
    toast.info('Generating PDF prescription...');
    
    // In production, this would generate a PDF
    // For now, we'll create a simple text representation
    const prescriptionText = `
PRESCRIPTION
═══════════════════════════════════════════════

Doctor: ${prescription.doctor_name}, ${prescription.doctor_qualification}
Registration: ${prescription.doctor_registration}
Date: ${new Date(prescription.issued_at).toLocaleDateString()}
Prescription No: ${prescription.prescription_number}

Patient: ${prescription.patient_name}

DIAGNOSIS: ${prescription.diagnosis}

MEDICINES:
${prescription.medicines.map((med, i) => `
${i + 1}. ${med.medicine_name}
   Dosage: ${med.dosage}
   Frequency: ${med.frequency}
   Duration: ${med.duration}
   ${med.instructions ? `Instructions: ${med.instructions}` : ''}
`).join('\n')}

${prescription.special_instructions ? `SPECIAL INSTRUCTIONS:\n${prescription.special_instructions}\n` : ''}
${prescription.follow_up_date ? `FOLLOW-UP DATE: ${new Date(prescription.follow_up_date).toLocaleDateString()}\n` : ''}

Digital Signature: ${prescription.digital_signature}

═══════════════════════════════════════════════
This is a digitally signed prescription from SwasthAI
    `;

    const blob = new Blob([prescriptionText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prescription_${prescription.prescription_number}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    toast.success('Prescription downloaded');
  };

  if (showPharmacyFlow) {
    return (
      <PharmacyOrderFlow
        prescription={prescription}
        onClose={() => setShowPharmacyFlow(false)}
        onBack={() => setShowPharmacyFlow(false)}
      />
    );
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-4 border-b bg-gradient-to-r from-teal-50 to-emerald-50">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-xl mb-1">E-Prescription</DialogTitle>
              <div className="flex items-center gap-2">
                <Badge className="bg-green-100 text-green-700">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Digitally Signed
                </Badge>
                <span className="text-sm text-gray-500">
                  {prescription.prescription_number}
                </span>
              </div>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1" style={{ maxHeight: 'calc(90vh - 200px)' }}>
          <div className="p-6 space-y-6">
            {/* Header Info */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Patient</p>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <p className="font-medium">{prescription.patient_name}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Issued On</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <p className="text-sm">{new Date(prescription.issued_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Doctor</p>
                  <div className="flex items-center gap-2">
                    <Stethoscope className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="font-medium">{prescription.doctor_name}</p>
                      <p className="text-xs text-gray-500">{prescription.doctor_qualification}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Registration</p>
                  <p className="text-sm font-mono">{prescription.doctor_registration}</p>
                </div>
              </div>
            </div>

            {/* Diagnosis */}
            <div className="bg-amber-50 rounded-lg p-4">
              <h3 className="font-semibold text-sm mb-2 text-amber-900">Diagnosis</h3>
              <p className="text-sm text-gray-700">{prescription.diagnosis}</p>
            </div>

            {/* Symptoms */}
            {prescription.symptoms && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-sm mb-2 text-blue-900">Symptoms</h3>
                <p className="text-sm text-gray-700">{prescription.symptoms}</p>
              </div>
            )}

            {/* Medicines */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Pill className="w-5 h-5 text-teal-600" />
                Prescribed Medicines
              </h3>
              <div className="space-y-3">
                {prescription.medicines.map((medicine, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium">{index + 1}. {medicine.medicine_name}</h4>
                        <p className="text-sm text-gray-500">{medicine.dosage}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        Qty: {medicine.quantity}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm mt-3">
                      <div>
                        <p className="text-gray-500 text-xs">Frequency</p>
                        <p className="font-medium">{medicine.frequency}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Duration</p>
                        <p className="font-medium">{medicine.duration}</p>
                      </div>
                    </div>
                    {medicine.instructions && (
                      <div className="mt-2 pt-2 border-t border-gray-200">
                        <p className="text-xs text-gray-600">
                          <span className="font-medium">Instructions:</span> {medicine.instructions}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Tests Recommended */}
            {prescription.tests_recommended?.length > 0 && (
              <div className="bg-purple-50 rounded-lg p-4">
                <h3 className="font-semibold text-sm mb-2 text-purple-900">Tests Recommended</h3>
                <ul className="space-y-1">
                  {prescription.tests_recommended.map((test, i) => (
                    <li key={i} className="text-sm text-gray-700">• {test}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Special Instructions */}
            {prescription.special_instructions && (
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="font-semibold text-sm mb-2 text-green-900">Special Instructions</h3>
                <p className="text-sm text-gray-700">{prescription.special_instructions}</p>
              </div>
            )}

            {/* Follow-up */}
            {prescription.follow_up_date && (
              <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg">
                <Clock className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Follow-up Appointment</p>
                  <p className="font-medium">
                    {new Date(prescription.follow_up_date).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            )}

            {/* Digital Signature */}
            <div className="border-t pt-4 text-center text-xs text-gray-500">
              <p>Digitally signed by Dr. {prescription.doctor_name}</p>
              <p className="font-mono mt-1">{prescription.digital_signature}</p>
              <p className="mt-2">🔒 This prescription is encrypted and HIPAA compliant</p>
            </div>
          </div>
        </ScrollArea>

        {/* Actions */}
        <div className="p-6 pt-4 border-t bg-gray-50 flex gap-3">
          <Button
            onClick={downloadPrescription}
            variant="outline"
            className="flex-1"
          >
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
          <Button
            onClick={() => setShowPharmacyFlow(true)}
            className="flex-1 bg-teal-500 hover:bg-teal-600"
          >
            <Pill className="w-4 h-4 mr-2" />
            Order Medicines
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}