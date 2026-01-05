import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import {
  Users,
  Stethoscope,
  TestTube,
  FileText,
  CheckCircle,
  XCircle,
  Eye,
  TrendingUp,
  Building2,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import PageTransition from '@/components/ui/PageTransition';
import { toast } from 'react-hot-toast';

export default function AdminDashboard() {
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await base44.auth.me();
        if (userData.role !== 'admin') {
          window.location.href = '/';
          return;
        }
        setUser(userData);
      } catch (e) {
        base44.auth.redirectToLogin();
      }
    };
    loadUser();
  }, []);

  const { data: doctorProfiles = [] } = useQuery({
    queryKey: ['pendingDoctors'],
    queryFn: () => base44.entities.DoctorProfile.filter({ verification_status: 'pending' }),
    enabled: !!user
  });

  const { data: labPartners = [] } = useQuery({
    queryKey: ['pendingLabs'],
    queryFn: () => base44.entities.LabPartner.filter({ verification_status: 'pending' }),
    enabled: !!user
  });

  const { data: hospitalRegistrations = [] } = useQuery({
    queryKey: ['pendingHospitals'],
    queryFn: () => base44.entities.HospitalRegistration.filter({ verification_status: 'pending' }),
    enabled: !!user
  });

  const { data: emergencyRequests = [] } = useQuery({
    queryKey: ['emergencyRequests'],
    queryFn: () => base44.entities.EmergencyRequest.filter({ status: ['pending', 'acknowledged', 'ambulance_dispatched'] }, '-created_date', 20),
    enabled: !!user
  });

  const { data: allUsers = [] } = useQuery({
    queryKey: ['allUsers'],
    queryFn: () => base44.entities.User.list(),
    enabled: !!user
  });

  const verifyDoctor = useMutation({
    mutationFn: async ({ id, status, profile }) => {
      await base44.entities.DoctorProfile.update(id, { 
        verification_status: status,
        is_active: status === 'verified'
      });
      
      if (status === 'verified') {
        // Get user details
        const users = await base44.entities.User.filter({ email: profile.doctor_user_email });
        const user = users[0];
        
        // Create public Doctor listing
        await base44.entities.Doctor.create({
          name: user?.full_name || profile.doctor_user_email.split('@')[0],
          specialization: profile.specialization,
          qualification: profile.qualification,
          experience_years: profile.experience_years,
          consultation_fee: profile.consultation_fee,
          rating: profile.rating || 0,
          total_reviews: profile.total_reviews || 0,
          hospital_name: profile.hospital_name,
          location: profile.clinic_address?.city || 'Not specified',
          latitude: profile.clinic_address?.latitude || 28.6139,
          longitude: profile.clinic_address?.longitude || 77.2090,
          languages: profile.languages || ['English', 'Hindi'],
          available_days: profile.availability?.map(a => a.day) || [],
          available_slots: profile.availability?.flatMap(a => 
            a.slots?.map(s => s.time) || []
          ) || [],
          profile_image: profile.profile_image || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400',
          is_video_consultation: profile.is_video_consultation,
          is_clinic_visit: profile.is_clinic_visit,
          bio: profile.bio,
          verified: true
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingDoctors'] });
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      toast.success('Doctor verification updated and listing published');
    }
  });

  const verifyLab = useMutation({
    mutationFn: ({ id, status }) => 
      base44.entities.LabPartner.update(id, { 
        verification_status: status,
        is_active: status === 'verified',
        is_published: status === 'verified'
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingLabs'] });
      queryClient.invalidateQueries({ queryKey: ['labs'] });
      toast.success('Lab verified and published successfully');
    }
  });

  const verifyHospital = useMutation({
    mutationFn: async ({ id, status, registration }) => {
      await base44.entities.HospitalRegistration.update(id, { 
        verification_status: status,
        rejection_reason: status === 'rejected' ? 'Documents not verified' : null
      });
      
      if (status === 'verified') {
        const hospitalListing = await base44.entities.Hospital.create({
          name: registration.hospital_name,
          type: registration.hospital_type,
          description: `${registration.hospital_type.replace(/_/g, ' ')} with ${registration.total_doctors || 0} doctors`,
          address: registration.address,
          latitude: registration.latitude || 28.6139,
          longitude: registration.longitude || 77.2090,
          contact: {
            phone: registration.contact_phone,
            email: registration.contact_email,
            emergency_phone: registration.contact_phone
          },
          departments: registration.departments || [],
          facilities: {
            emergency_ward: registration.has_emergency_services || false,
            icu: registration.has_icu || false,
            ambulance: registration.has_ambulance || false,
            diagnostic_lab: true,
            pharmacy: true
          },
          availability: {
            is_24x7: registration.is_24x7 || false,
            visiting_hours: registration.visiting_hours || '9:00 AM - 6:00 PM'
          },
          category: 'private',
          insurance_supported: registration.insurance_supported || false,
          rating: 4.0,
          total_reviews: 0,
          total_doctors: registration.total_doctors || 0,
          verified: true,
          is_active: true,
          is_published: true,
          owner_email: registration.owner_email,
          registration_id: id,
          registration_certificate: registration.registration_certificate_url,
          trade_license: registration.trade_license_url
        });
        
        // Update registration with listing ID
        await base44.entities.HospitalRegistration.update(id, {
          hospital_listing_id: hospitalListing.id
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingHospitals'] });
      queryClient.invalidateQueries({ queryKey: ['hospitals'] });
      toast.success('Hospital verified and published successfully');
    }
  });

  if (!user || user.role !== 'admin') return null;

  const stats = [
    { title: 'Total Users', value: allUsers.length, icon: Users, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { title: 'Pending Doctors', value: doctorProfiles.length, icon: Stethoscope, color: 'text-teal-600', bgColor: 'bg-teal-50' },
    { title: 'Pending Hospitals', value: hospitalRegistrations.length, icon: Building2, color: 'text-purple-600', bgColor: 'bg-purple-50' },
    { title: 'Active Emergencies', value: emergencyRequests.length, icon: AlertCircle, color: 'text-red-600', bgColor: 'bg-red-50' }
  ];

  return (
    <PageTransition className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage verifications and platform operations</p>
        </div>

        {/* Stats */}
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

        <Tabs defaultValue="doctors">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="doctors">
              Doctors ({doctorProfiles.length})
            </TabsTrigger>
            <TabsTrigger value="hospitals">
              Hospitals ({hospitalRegistrations.length})
            </TabsTrigger>
            <TabsTrigger value="labs">
              Labs ({labPartners.length})
            </TabsTrigger>
            <TabsTrigger value="emergencies">
              Emergencies ({emergencyRequests.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="doctors">
            <Card>
              <CardHeader>
                <CardTitle>Pending Doctor Verifications</CardTitle>
              </CardHeader>
              <CardContent>
                {doctorProfiles.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No pending verifications
                  </div>
                ) : (
                  <div className="space-y-4">
                    {doctorProfiles.map((doctor) => (
                      <div 
                        key={doctor.id}
                        className="flex items-start justify-between p-4 bg-gray-50 rounded-xl"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{doctor.doctor_user_email}</p>
                          <p className="text-sm text-gray-500 capitalize">
                            {doctor.specialization?.replace(/_/g, ' ')} • {doctor.experience_years} years
                          </p>
                          <p className="text-sm text-gray-500">NMC: {doctor.nmc_registration}</p>
                          {doctor.verification_documents?.length > 0 && (
                            <div className="flex gap-2 mt-2">
                              {doctor.verification_documents.map((doc, idx) => (
                                <a
                                  key={idx}
                                  href={doc}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-teal-600 hover:underline flex items-center gap-1"
                                >
                                  <Eye className="w-3 h-3" />
                                  Doc {idx + 1}
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => verifyDoctor.mutate({ id: doctor.id, status: 'verified', profile: doctor })}
                            className="bg-green-500 hover:bg-green-600"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Verify
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => verifyDoctor.mutate({ id: doctor.id, status: 'rejected', profile: doctor })}
                            className="border-red-500 text-red-600 hover:bg-red-50"
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hospitals">
            <Card>
              <CardHeader>
                <CardTitle>Pending Hospital Verifications</CardTitle>
              </CardHeader>
              <CardContent>
                {hospitalRegistrations.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No pending verifications
                  </div>
                ) : (
                  <div className="space-y-4">
                    {hospitalRegistrations.map((hospital) => (
                      <div 
                        key={hospital.id}
                        className="flex items-start justify-between p-4 bg-gray-50 rounded-xl"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{hospital.hospital_name}</p>
                          <p className="text-sm text-gray-500 capitalize">
                            {hospital.hospital_type?.replace(/_/g, ' ')} • {hospital.contact_phone}
                          </p>
                          <p className="text-sm text-gray-500">{hospital.owner_email}</p>
                          {hospital.registration_certificate_url && (
                            <a
                              href={hospital.registration_certificate_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-teal-600 hover:underline flex items-center gap-1 mt-2"
                            >
                              <Eye className="w-3 h-3" />
                              View Documents
                            </a>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => verifyHospital.mutate({ id: hospital.id, status: 'verified', registration: hospital })}
                            className="bg-green-500 hover:bg-green-600"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Verify
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => verifyHospital.mutate({ id: hospital.id, status: 'rejected', registration: hospital })}
                            className="border-red-500 text-red-600 hover:bg-red-50"
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="labs">
            <Card>
              <CardHeader>
                <CardTitle>Pending Lab Verifications</CardTitle>
              </CardHeader>
              <CardContent>
                {labPartners.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No pending verifications
                  </div>
                ) : (
                  <div className="space-y-4">
                    {labPartners.map((lab) => (
                      <div 
                        key={lab.id}
                        className="flex items-start justify-between p-4 bg-gray-50 rounded-xl"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{lab.lab_name}</p>
                          <p className="text-sm text-gray-500">{lab.partner_user_email}</p>
                          <p className="text-sm text-gray-500">License: {lab.license_number}</p>
                          {lab.nabl_accredited && (
                            <Badge className="mt-1 bg-green-100 text-green-700">NABL Accredited</Badge>
                          )}
                          {lab.verification_documents?.length > 0 && (
                            <div className="flex gap-2 mt-2">
                              {lab.verification_documents.map((doc, idx) => (
                                <a
                                  key={idx}
                                  href={doc}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-teal-600 hover:underline flex items-center gap-1"
                                >
                                  <Eye className="w-3 h-3" />
                                  Doc {idx + 1}
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => verifyLab.mutate({ id: lab.id, status: 'verified' })}
                            className="bg-green-500 hover:bg-green-600"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Verify
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => verifyLab.mutate({ id: lab.id, status: 'rejected' })}
                            className="border-red-500 text-red-600 hover:bg-red-50"
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

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
                  <div className="text-center py-8 text-gray-500">
                    No active emergency requests
                  </div>
                ) : (
                  <div className="space-y-4">
                    {emergencyRequests.map((emergency) => (
                      <div 
                        key={emergency.id}
                        className="p-4 bg-red-50 border border-red-200 rounded-xl"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-medium text-gray-900">{emergency.patient_name}</p>
                            <p className="text-sm text-gray-600 capitalize">
                              {emergency.emergency_type?.replace(/_/g, ' ')} Emergency
                            </p>
                          </div>
                          <Badge className={
                            emergency.status === 'pending' ? 'bg-red-100 text-red-700' :
                            emergency.status === 'acknowledged' ? 'bg-amber-100 text-amber-700' :
                            'bg-green-100 text-green-700'
                          }>
                            {emergency.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          <strong>Symptoms:</strong> {emergency.symptoms}
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                          <strong>Contact:</strong> {emergency.contact_phone}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Location:</strong> {emergency.location?.address || 'Location shared'}
                        </p>
                      </div>
                    ))}
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