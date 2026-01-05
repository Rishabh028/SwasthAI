import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import {
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Video,
  Building2,
  User,
  Phone
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import PageTransition from '@/components/ui/PageTransition';
import { toast } from 'react-hot-toast';

export default function DoctorAppointments() {
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await base44.auth.me();
        setUser(userData);
        
        const profiles = await base44.entities.DoctorProfile.filter({ 
          doctor_user_email: userData.email 
        });
        if (profiles.length > 0) {
          setProfile(profiles[0]);
        }
      } catch (e) {
        base44.auth.redirectToLogin();
      }
    };
    loadUser();
  }, []);

  const { data: appointments = [] } = useQuery({
    queryKey: ['doctorAppointments', profile?.id],
    queryFn: () => base44.entities.Appointment.filter({ 
      doctor_id: profile.id 
    }, '-appointment_date'),
    enabled: !!profile
  });

  const updateAppointment = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Appointment.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['doctorAppointments'] });
      setSelectedAppointment(null);
      setRejectionReason('');
      toast.success(
        variables.data.status === 'confirmed' 
          ? 'Appointment confirmed' 
          : 'Appointment rejected'
      );
    }
  });

  const handleConfirm = (appointment) => {
    updateAppointment.mutate({
      id: appointment.id,
      data: {
        status: 'confirmed',
        meeting_link: appointment.consultation_type === 'video' 
          ? `https://meet.google.com/${Math.random().toString(36).substr(2, 9)}` 
          : undefined
      }
    });
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }
    updateAppointment.mutate({
      id: selectedAppointment.id,
      data: {
        status: 'rejected',
        rejection_reason: rejectionReason
      }
    });
  };

  const pendingAppointments = appointments.filter(a => a.status === 'pending');
  const confirmedAppointments = appointments.filter(a => a.status === 'confirmed');
  const completedAppointments = appointments.filter(a => ['completed', 'rejected', 'cancelled'].includes(a.status));

  if (!user || !profile) return null;

  return (
    <PageTransition className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
          My Appointments
        </h1>

        <Tabs defaultValue="pending">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="pending">
              Pending ({pendingAppointments.length})
            </TabsTrigger>
            <TabsTrigger value="confirmed">
              Confirmed ({confirmedAppointments.length})
            </TabsTrigger>
            <TabsTrigger value="history">
              History ({completedAppointments.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <div className="space-y-4">
              {pendingAppointments.map((appointment) => (
                <Card key={appointment.id}>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <User className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="font-semibold text-gray-900">{appointment.patient_name}</p>
                            <p className="text-sm text-gray-500">{appointment.patient_phone}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {format(new Date(appointment.appointment_date), 'PPP')} at {appointment.appointment_time}
                          </div>
                          <div className="flex items-center gap-2">
                            {appointment.consultation_type === 'video' ? (
                              <Video className="w-4 h-4 text-blue-500" />
                            ) : (
                              <Building2 className="w-4 h-4 text-emerald-500" />
                            )}
                            {appointment.consultation_type === 'video' ? 'Video Consultation' : 'Clinic Visit'}
                          </div>
                        </div>
                        {appointment.symptoms && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600">
                              <strong>Symptoms:</strong> {appointment.symptoms}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleConfirm(appointment)}
                          className="bg-green-500 hover:bg-green-600"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedAppointment(appointment)}
                          className="border-red-500 text-red-600 hover:bg-red-50"
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {pendingAppointments.length === 0 && (
                <div className="text-center py-16 bg-white rounded-2xl">
                  <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No pending appointments</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="confirmed">
            <div className="space-y-4">
              {confirmedAppointments.map((appointment) => (
                <Card key={appointment.id}>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <User className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="font-semibold text-gray-900">{appointment.patient_name}</p>
                            <p className="text-sm text-gray-500">{appointment.patient_phone}</p>
                          </div>
                          <Badge className="bg-green-100 text-green-700">Confirmed</Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {format(new Date(appointment.appointment_date), 'PPP')} at {appointment.appointment_time}
                          </div>
                          <div className="flex items-center gap-2">
                            {appointment.consultation_type === 'video' ? (
                              <Video className="w-4 h-4 text-blue-500" />
                            ) : (
                              <Building2 className="w-4 h-4 text-emerald-500" />
                            )}
                            {appointment.consultation_type === 'video' ? 'Video Consultation' : 'Clinic Visit'}
                          </div>
                        </div>
                        {appointment.meeting_link && (
                          <a 
                            href={appointment.meeting_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-teal-600 hover:underline"
                          >
                            Join Video Call →
                          </a>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {confirmedAppointments.length === 0 && (
                <div className="text-center py-16 bg-white rounded-2xl">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No confirmed appointments</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="history">
            <div className="space-y-4">
              {completedAppointments.map((appointment) => (
                <Card key={appointment.id}>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <p className="font-semibold text-gray-900">{appointment.patient_name}</p>
                          <Badge variant="secondary" className="capitalize">
                            {appointment.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500">
                          {format(new Date(appointment.appointment_date), 'PPP')}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {completedAppointments.length === 0 && (
                <div className="text-center py-16 bg-white rounded-2xl">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No appointment history</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Rejection Dialog */}
        <Dialog open={!!selectedAppointment} onOpenChange={() => setSelectedAppointment(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject Appointment</DialogTitle>
              <DialogDescription>
                Please provide a reason for rejecting this appointment request
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Reason for rejection..."
                className="min-h-[100px]"
              />
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setSelectedAppointment(null)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleReject}
                  disabled={updateAppointment.isPending}
                  className="flex-1 bg-red-500 hover:bg-red-600"
                >
                  Reject Appointment
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </PageTransition>
  );
}