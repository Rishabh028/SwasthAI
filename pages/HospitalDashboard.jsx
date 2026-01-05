import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import {
  Building2,
  Users,
  AlertCircle,
  Calendar,
  Stethoscope,
  Clock,
  CheckCircle,
  XCircle,
  Phone,
  MapPin,
  Edit,
  Plus,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import PageTransition from '@/components/ui/PageTransition';
import { toast } from 'react-hot-toast';

export default function HospitalDashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [hospital, setHospital] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const loadData = async () => {
      try {
        const userData = await base44.auth.me();
        setUser(userData);
        
        const hospitals = await base44.entities.Hospital.filter({ 
          owner_email: userData.email,
          verified: true,
          is_active: true
        });
        
        if (hospitals.length === 0) {
          toast.error('No verified hospital found. Please complete registration.');
          navigate(createPageUrl('HospitalRegistration'));
          return;
        }
        
        setHospital(hospitals[0]);
        setFormData(hospitals[0]);
      } catch (e) {
        base44.auth.redirectToLogin();
      }
    };
    loadData();
  }, [navigate]);

  const { data: emergencyRequests = [] } = useQuery({
    queryKey: ['hospitalEmergencies', hospital?.id],
    queryFn: () => {
      if (!hospital) return [];
      return base44.entities.EmergencyRequest.filter(
        { status: ['pending', 'acknowledged'] },
        '-created_date',
        20
      );
    },
    enabled: !!hospital,
    refetchInterval: 10000
  });

  const { data: appointments = [] } = useQuery({
    queryKey: ['hospitalAppointments', hospital?.id],
    queryFn: async () => {
      if (!hospital) return [];
      const doctors = await base44.entities.Doctor.filter({ hospital_name: hospital.name });
      if (doctors.length === 0) return [];
      const allAppointments = await Promise.all(
        doctors.map(doc => base44.entities.Appointment.filter({ doctor_id: doc.id }))
      );
      return allAppointments.flat();
    },
    enabled: !!hospital
  });

  const { data: affiliatedDoctors = [] } = useQuery({
    queryKey: ['hospitalDoctors', hospital?.name],
    queryFn: () => base44.entities.Doctor.filter({ hospital_name: hospital?.name }),
    enabled: !!hospital
  });

  const updateHospital = useMutation({
    mutationFn: (data) => base44.entities.Hospital.update(hospital.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hospitalDoctors'] });
      setEditMode(false);
      toast.success('Hospital profile updated');
    }
  });

  const acknowledgeEmergency = useMutation({
    mutationFn: (emergencyId) => 
      base44.entities.EmergencyRequest.update(emergencyId, { 
        status: 'acknowledged',
        acknowledged_by: hospital.name
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hospitalEmergencies'] });
      toast.success('Emergency request acknowledged');
    }
  });

  const stats = [
    {
      title: 'Active Emergencies',
      value: emergencyRequests.length,
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Today\'s Appointments',
      value: appointments.filter(apt => 
        format(new Date(apt.appointment_date), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
      ).length,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Affiliated Doctors',
      value: affiliatedDoctors.length,
      icon: Stethoscope,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50'
    },
    {
      title: 'Total Patients',
      value: appointments.length,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  if (!hospital) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
      </div>
    );
  }

  return (
    <PageTransition className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Hospital Dashboard
            </h1>
            <p className="text-gray-500 mt-1">{hospital.name}</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-green-100 text-green-700">
              <CheckCircle className="w-3 h-3 mr-1" />
              Verified
            </Badge>
            {hospital.availability?.is_24x7 && (
              <Badge className="bg-blue-100 text-blue-700">24×7 Available</Badge>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Tabs defaultValue="emergencies">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="emergencies">
              Emergencies ({emergencyRequests.length})
            </TabsTrigger>
            <TabsTrigger value="appointments">
              Appointments ({appointments.length})
            </TabsTrigger>
            <TabsTrigger value="doctors">
              Doctors ({affiliatedDoctors.length})
            </TabsTrigger>
            <TabsTrigger value="profile">
              Hospital Profile
            </TabsTrigger>
          </TabsList>

          {/* Emergencies Tab */}
          <TabsContent value="emergencies">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  Active Emergency Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                {emergencyRequests.length === 0 ? (
                  <div className="text-center py-12">
                    <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No active emergency requests</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {emergencyRequests.map((emergency) => (
                      <motion.div
                        key={emergency.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-gray-900">
                                {emergency.patient_name}
                              </h3>
                              <Badge className="bg-red-100 text-red-700 capitalize">
                                {emergency.emergency_type?.replace(/_/g, ' ')}
                              </Badge>
                              <Badge className={
                                emergency.status === 'pending' 
                                  ? 'bg-amber-100 text-amber-700'
                                  : 'bg-blue-100 text-blue-700'
                              }>
                                {emergency.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-700 mb-2">
                              <strong>Symptoms:</strong> {emergency.symptoms}
                            </p>
                            <p className="text-sm text-gray-700 mb-2">
                              <strong>Description:</strong> {emergency.situation_description}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <Phone className="w-4 h-4" />
                                {emergency.contact_phone}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {emergency.location?.address || 'Location shared'}
                              </span>
                            </div>
                          </div>
                        </div>
                        {emergency.status === 'pending' && (
                          <div className="flex gap-2 mt-4">
                            <Button
                              onClick={() => acknowledgeEmergency.mutate(emergency.id)}
                              className="bg-green-500 hover:bg-green-600"
                              size="sm"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Acknowledge & Dispatch
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(`tel:${emergency.contact_phone}`)}
                            >
                              <Phone className="w-4 h-4 mr-2" />
                              Call Patient
                            </Button>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appointments Tab */}
          <TabsContent value="appointments">
            <Card>
              <CardHeader>
                <CardTitle>All Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                {appointments.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No appointments yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {appointments.slice(0, 10).map((apt) => (
                      <div key={apt.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <Users className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{apt.patient_name}</p>
                            <p className="text-sm text-gray-500">
                              {format(new Date(apt.appointment_date), 'MMM dd, yyyy')} at {apt.appointment_time}
                            </p>
                            <p className="text-xs text-gray-400">Dr. {apt.doctor_name}</p>
                          </div>
                        </div>
                        <Badge className={
                          apt.status === 'completed' ? 'bg-green-100 text-green-700' :
                          apt.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                          'bg-amber-100 text-amber-700'
                        }>
                          {apt.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Doctors Tab */}
          <TabsContent value="doctors">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Affiliated Doctors</CardTitle>
                  <Button 
                    size="sm"
                    onClick={() => navigate(createPageUrl('DoctorOnboarding'))}
                    className="bg-teal-500 hover:bg-teal-600"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Doctor
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {affiliatedDoctors.length === 0 ? (
                  <div className="text-center py-12">
                    <Stethoscope className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No doctors affiliated yet</p>
                    <Button onClick={() => navigate(createPageUrl('DoctorOnboarding'))}>
                      Add First Doctor
                    </Button>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {affiliatedDoctors.map((doctor) => (
                      <div key={doctor.id} className="p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center">
                            <Stethoscope className="w-6 h-6 text-teal-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{doctor.name}</p>
                            <p className="text-sm text-gray-500 capitalize">
                              {doctor.specialization?.replace(/_/g, ' ')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span>₹{doctor.consultation_fee}</span>
                          <span>•</span>
                          <span>{doctor.experience_years} yrs exp</span>
                          {doctor.verified && (
                            <>
                              <span>•</span>
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Hospital Profile</CardTitle>
                  {!editMode && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setEditMode(true)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {editMode ? (
                  <div className="space-y-4">
                    <div>
                      <Label>Hospital Description</Label>
                      <Textarea
                        value={formData.description || ''}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        rows={3}
                        className="mt-1.5"
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Contact Phone</Label>
                        <Input
                          value={formData.contact?.phone || ''}
                          onChange={(e) => setFormData({
                            ...formData, 
                            contact: {...formData.contact, phone: e.target.value}
                          })}
                          className="mt-1.5"
                        />
                      </div>
                      <div>
                        <Label>Visiting Hours</Label>
                        <Input
                          value={formData.availability?.visiting_hours || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            availability: {...formData.availability, visiting_hours: e.target.value}
                          })}
                          className="mt-1.5"
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label>Facilities</Label>
                      <div className="grid md:grid-cols-3 gap-3">
                        {['emergency_ward', 'icu', 'ambulance', 'operation_theatre', 'diagnostic_lab', 'pharmacy', 'blood_bank'].map(facility => (
                          <div key={facility} className="flex items-center gap-2">
                            <Checkbox
                              checked={formData.facilities?.[facility] || false}
                              onCheckedChange={(checked) => setFormData({
                                ...formData,
                                facilities: {...formData.facilities, [facility]: checked}
                              })}
                            />
                            <Label className="capitalize cursor-pointer">
                              {facility.replace(/_/g, ' ')}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button
                        onClick={() => updateHospital.mutate(formData)}
                        disabled={updateHospital.isPending}
                        className="bg-teal-500 hover:bg-teal-600"
                      >
                        {updateHospital.isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          'Save Changes'
                        )}
                      </Button>
                      <Button variant="outline" onClick={() => setEditMode(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">About</h3>
                      <p className="text-gray-600">{hospital.description || 'No description'}</p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Type</p>
                        <p className="font-medium capitalize">{hospital.type?.replace(/_/g, ' ')}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Category</p>
                        <p className="font-medium capitalize">{hospital.category}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Contact</p>
                        <p className="font-medium">{hospital.contact?.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Visiting Hours</p>
                        <p className="font-medium">{hospital.availability?.visiting_hours || 'N/A'}</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-3">Facilities</h3>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(hospital.facilities || {})
                          .filter(([_, value]) => value)
                          .map(([key]) => (
                            <Badge key={key} variant="outline" className="capitalize">
                              {key.replace(/_/g, ' ')}
                            </Badge>
                          ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-3">Departments</h3>
                      <div className="flex flex-wrap gap-2">
                        {hospital.departments?.map(dept => (
                          <Badge key={dept} variant="outline" className="capitalize">
                            {dept.replace(/_/g, ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  );
}