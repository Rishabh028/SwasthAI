import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { 
  X, User, FileText, Pill, Activity, 
  Calendar, Clock, Plus, Trash2, Save,
  CheckCircle, Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'react-hot-toast';
import PrescriptionEditor from './PrescriptionEditor';

export default function DoctorConsultationPanel({ appointment, onClose, callDuration }) {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('patient');
  const [showPrescriptionEditor, setShowPrescriptionEditor] = useState(false);

  // Fetch patient profile
  const { data: patientProfile } = useQuery({
    queryKey: ['patientProfile', appointment.patient_email],
    queryFn: async () => {
      const profiles = await base44.entities.UserProfile.filter({ 
        created_by: appointment.patient_email 
      });
      return profiles[0] || null;
    }
  });

  // Fetch patient health records
  const { data: healthRecords = [] } = useQuery({
    queryKey: ['patientRecords', appointment.patient_email],
    queryFn: () => base44.entities.HealthRecord.filter(
      { created_by: appointment.patient_email },
      '-record_date',
      10
    )
  });

  // Fetch existing prescriptions
  const { data: prescriptions = [] } = useQuery({
    queryKey: ['prescriptions', appointment.id],
    queryFn: () => base44.entities.Prescription.filter({ 
      appointment_id: appointment.id 
    })
  });

  const updateAppointmentNotes = useMutation({
    mutationFn: (notes) => base44.entities.Appointment.update(appointment.id, {
      doctor_notes: notes
    }),
    onSuccess: () => {
      toast.success('Notes saved');
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    }
  });

  return (
    <>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-teal-50">
          <div>
            <h3 className="font-semibold text-gray-900">Consultation Panel</h3>
            <p className="text-sm text-gray-500">
              {Math.floor(callDuration / 60)}:{(callDuration % 60).toString().padStart(2, '0')} elapsed
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-3 m-4">
            <TabsTrigger value="patient">Patient</TabsTrigger>
            <TabsTrigger value="records">Records</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1 px-4">
            <TabsContent value="patient" className="space-y-4">
              {/* Patient Info */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-teal-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{appointment.patient_name}</h4>
                    <p className="text-sm text-gray-500">{appointment.patient_email}</p>
                  </div>
                </div>

                {patientProfile && (
                  <>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-gray-500">Age</p>
                        <p className="font-medium">
                          {patientProfile.date_of_birth 
                            ? new Date().getFullYear() - new Date(patientProfile.date_of_birth).getFullYear()
                            : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Gender</p>
                        <p className="font-medium capitalize">{patientProfile.gender || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Blood Group</p>
                        <p className="font-medium">{patientProfile.blood_group || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Phone</p>
                        <p className="font-medium">{patientProfile.phone || 'N/A'}</p>
                      </div>
                    </div>

                    {patientProfile.allergies?.length > 0 && (
                      <div>
                        <p className="text-sm text-gray-500 mb-2">Allergies</p>
                        <div className="flex flex-wrap gap-1">
                          {patientProfile.allergies.map((allergy, i) => (
                            <Badge key={i} variant="destructive" className="text-xs">
                              {allergy}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {patientProfile.chronic_conditions?.length > 0 && (
                      <div>
                        <p className="text-sm text-gray-500 mb-2">Chronic Conditions</p>
                        <div className="flex flex-wrap gap-1">
                          {patientProfile.chronic_conditions.map((condition, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {condition}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Appointment Info */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-gray-700">Appointment Details</h4>
                <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-sm">
                  <p><span className="text-gray-500">Symptoms:</span> {appointment.symptoms || 'Not specified'}</p>
                  {appointment.notes && (
                    <p><span className="text-gray-500">Notes:</span> {appointment.notes}</p>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="records" className="space-y-3">
              {healthRecords.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">No health records available</p>
                </div>
              ) : (
                healthRecords.map((record) => (
                  <div key={record.id} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h5 className="font-medium text-sm">{record.title}</h5>
                        <p className="text-xs text-gray-500 capitalize">
                          {record.record_type?.replace(/_/g, ' ')}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {new Date(record.record_date).toLocaleDateString()}
                      </Badge>
                    </div>
                    {record.notes && (
                      <p className="text-xs text-gray-600">{record.notes}</p>
                    )}
                    {record.file_url && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => window.open(record.file_url, '_blank')}
                        className="mt-2 h-7 text-xs"
                      >
                        View Document
                      </Button>
                    )}
                  </div>
                ))
              )}
            </TabsContent>

            <TabsContent value="notes" className="space-y-4">
              <Textarea
                placeholder="Add consultation notes..."
                defaultValue={appointment.doctor_notes || ''}
                rows={6}
                onBlur={(e) => {
                  if (e.target.value !== appointment.doctor_notes) {
                    updateAppointmentNotes.mutate(e.target.value);
                  }
                }}
                className="resize-none"
              />
              <p className="text-xs text-gray-500">
                Notes are automatically saved when you click outside the text area
              </p>
            </TabsContent>
          </ScrollArea>
        </Tabs>

        {/* Actions */}
        <div className="p-4 border-t border-gray-200 space-y-2">
          <Button
            onClick={() => setShowPrescriptionEditor(true)}
            className="w-full bg-teal-500 hover:bg-teal-600"
          >
            <Pill className="w-4 h-4 mr-2" />
            Write Prescription
          </Button>
          
          {prescriptions.length > 0 && (
            <div className="text-xs text-center text-gray-500">
              {prescriptions.length} prescription(s) issued
            </div>
          )}
        </div>
      </div>

      {/* Prescription Editor Modal */}
      {showPrescriptionEditor && (
        <PrescriptionEditor
          appointment={appointment}
          patientProfile={patientProfile}
          onClose={() => setShowPrescriptionEditor(false)}
        />
      )}
    </>
  );
}