import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { format, isToday, isTomorrow, isPast } from 'date-fns';
import {
  Calendar,
  Clock,
  Video,
  Building2,
  User,
  FileText,
  Phone,
  MoreVertical,
  XCircle,
  CheckCircle,
  ExternalLink,
  Stethoscope,
  Pill,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import PageTransition from '@/components/ui/PageTransition';
import { SkeletonList } from '@/components/ui/SkeletonLoader';
import VideoConsultationRoom from '@/components/consultation/VideoConsultationRoom';
import PrescriptionViewer from '@/components/consultation/PrescriptionViewer';
import { toast } from 'react-hot-toast';

const statusColors = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  no_show: 'bg-gray-100 text-gray-700'
};

export default function MyAppointments() {
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [activeConsultation, setActiveConsultation] = useState(null);
  const [viewingPrescription, setViewingPrescription] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const isAuth = await base44.auth.isAuthenticated();
        if (isAuth) {
          setUser(await base44.auth.me());
        } else {
          base44.auth.redirectToLogin();
        }
      } catch (e) {
        base44.auth.redirectToLogin();
      }
    };
    loadUser();
  }, []);

  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ['appointments', user?.email],
    queryFn: () => base44.entities.Appointment.filter({ patient_email: user?.email }, '-appointment_date'),
    enabled: !!user?.email
  });

  const { data: prescriptions = [] } = useQuery({
    queryKey: ['userPrescriptions', user?.email],
    queryFn: () => base44.entities.Prescription.filter({ patient_email: user?.email }),
    enabled: !!user?.email
  });

  const cancelAppointment = useMutation({
    mutationFn: ({ id }) => base44.entities.Appointment.update(id, { status: 'cancelled' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast.success('Appointment cancelled');
    }
  });

  const startConsultation = async (appointment) => {
    try {
      // Create video consultation session
      const consultation = await base44.entities.VideoConsultation.create({
        appointment_id: appointment.id,
        doctor_email: appointment.doctor_email || appointment.created_by,
        patient_email: user.email,
        room_id: `room_${appointment.id}_${Date.now()}`,
        session_token: `token_${Math.random().toString(36).substr(2)}`,
        status: 'active',
        started_at: new Date().toISOString(),
        participants_joined: [user.email]
      });

      setActiveConsultation({ ...appointment, consultationId: consultation.id });
    } catch (error) {
      toast.error('Failed to start consultation');
    }
  };

  const endConsultation = async (data) => {
    if (activeConsultation?.consultationId) {
      await base44.entities.VideoConsultation.update(activeConsultation.consultationId, {
        status: 'ended',
        ended_at: data.ended_at,
        duration_minutes: Math.floor(data.duration / 60)
      });
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    }
    setActiveConsultation(null);
  };

  const getPrescriptionForAppointment = (appointmentId) => {
    return prescriptions.find(p => p.appointment_id === appointmentId);
  };

  const upcomingAppointments = appointments.filter(apt => 
    !isPast(new Date(`${apt.appointment_date}T${apt.appointment_time}`)) && 
    apt.status !== 'cancelled' && 
    apt.status !== 'completed'
  );

  const pastAppointments = appointments.filter(apt => 
    isPast(new Date(`${apt.appointment_date}T${apt.appointment_time}`)) || 
    apt.status === 'completed' || 
    apt.status === 'cancelled'
  );

  const getDateLabel = (date) => {
    const appointmentDate = new Date(date);
    if (isToday(appointmentDate)) return 'Today';
    if (isTomorrow(appointmentDate)) return 'Tomorrow';
    return format(appointmentDate, 'EEEE, MMM d');
  };

  const AppointmentCard = ({ appointment, isPast = false }) => {
    const prescription = getPrescriptionForAppointment(appointment.id);
    
    return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden ${
        isPast ? 'opacity-75' : ''
      }`}
    >
      {/* Date Header */}
      <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className="font-medium text-gray-700">
            {getDateLabel(appointment.appointment_date)}
          </span>
        </div>
        <Badge className={statusColors[appointment.status]}>
          {appointment.status}
        </Badge>
      </div>

      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Doctor Avatar */}
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-teal-100 to-emerald-100 flex items-center justify-center flex-shrink-0">
            <Stethoscope className="w-7 h-7 text-teal-600" />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900">
              Dr. {appointment.doctor_name}
            </h3>
            <p className="text-sm text-gray-500 capitalize">
              {appointment.doctor_specialization?.replace(/_/g, ' ')}
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {appointment.appointment_time}
              </span>
              <span className="flex items-center gap-1">
                {appointment.consultation_type === 'video' ? (
                  <Video className="w-4 h-4" />
                ) : (
                  <Building2 className="w-4 h-4" />
                )}
                <span className="capitalize">{appointment.consultation_type}</span>
              </span>
            </div>

            {appointment.symptoms && (
              <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                <span className="font-medium">Symptoms:</span> {appointment.symptoms}
              </p>
            )}
          </div>

          {/* Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {appointment.consultation_type === 'video' && appointment.status === 'confirmed' && (
                <DropdownMenuItem onClick={() => startConsultation(appointment)}>
                  <Video className="w-4 h-4 mr-2" />
                  Start Video Call
                </DropdownMenuItem>
              )}
              {prescription && (
                <DropdownMenuItem onClick={() => setViewingPrescription(prescription)}>
                  <FileText className="w-4 h-4 mr-2" />
                  View Prescription
                </DropdownMenuItem>
              )}
              {!isPast && appointment.status !== 'cancelled' && (
                <DropdownMenuItem 
                  onClick={() => cancelAppointment.mutate({ id: appointment.id })}
                  className="text-red-600"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Cancel Appointment
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Action Buttons */}
        {!isPast && appointment.status === 'confirmed' && (
        <div className="mt-4 pt-4 border-t border-gray-100 flex gap-3">
          {appointment.consultation_type === 'video' && (
            <Button 
              onClick={() => startConsultation(appointment)}
              className="flex-1 bg-teal-500 hover:bg-teal-600"
            >
              <Video className="w-4 h-4 mr-2" />
              Join Video Call
            </Button>
          )}
          {appointment.consultation_type === 'clinic' && (
            <a href={`tel:${appointment.patient_phone || ''}`} className="flex-1">
              <Button variant="outline" className="w-full">
                <Phone className="w-4 h-4 mr-2" />
                Contact
              </Button>
            </a>
          )}
        </div>
        )}

        {appointment.status === 'completed' && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-green-600 mb-3">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-medium">Consultation Completed</span>
            </div>
            {prescription && (
              <div className="flex gap-2">
                <Button 
                  onClick={() => setViewingPrescription(prescription)}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  View Prescription
                </Button>
                <Button 
                  onClick={() => setViewingPrescription(prescription)}
                  size="sm"
                  className="flex-1 bg-teal-500 hover:bg-teal-600"
                >
                  <Pill className="w-4 h-4 mr-2" />
                  Order Medicines
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
  };

  if (!user) return null;

  return (
    <>
      {activeConsultation && (
        <VideoConsultationRoom
          appointment={activeConsultation}
          userRole="patient"
          user={user}
          onEnd={endConsultation}
        />
      )}

      {viewingPrescription && (
        <PrescriptionViewer
          prescription={viewingPrescription}
          onClose={() => setViewingPrescription(null)}
        />
      )}

    <PageTransition className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Appointments</h1>
            <p className="text-gray-500 mt-1">Manage your upcoming and past appointments</p>
          </div>
          <Link to={createPageUrl('Doctors')}>
            <Button className="bg-teal-500 hover:bg-teal-600">
              Book New
            </Button>
          </Link>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="upcoming" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Upcoming ({upcomingAppointments.length})
            </TabsTrigger>
            <TabsTrigger value="past" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Past ({pastAppointments.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            {isLoading ? (
              <SkeletonList count={3} />
            ) : upcomingAppointments.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No upcoming appointments</h3>
                <p className="text-gray-500 mb-6">Book a consultation with a doctor today</p>
                <Link to={createPageUrl('Doctors')}>
                  <Button className="bg-teal-500 hover:bg-teal-600">
                    Find Doctors
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <AppointmentCard key={appointment.id} appointment={appointment} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="past">
            {isLoading ? (
              <SkeletonList count={3} />
            ) : pastAppointments.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No past appointments</h3>
                <p className="text-gray-500">Your completed appointments will appear here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pastAppointments.map((appointment) => (
                  <AppointmentCard key={appointment.id} appointment={appointment} isPast />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
    </>
  );
}