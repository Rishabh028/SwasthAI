import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import {
  Calendar,
  Users,
  Star,
  Clock,
  Video,
  CheckCircle,
  Settings,
  DollarSign,
  TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import PageTransition from '@/components/ui/PageTransition';
import AvailabilityManager from '@/components/doctors/AvailabilityManager';
import DoctorAIInsights from '@/components/dashboard/DoctorAllnsights';
import { toast } from 'react-hot-toast';

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  const updateAvailability = useMutation({
    mutationFn: (availability) => 
      base44.entities.DoctorProfile.update(profile.id, { availability }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctorProfile'] });
      toast.success('Availability updated successfully');
    }
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const userData = await base44.auth.me();
        setUser(userData);
        
        const profiles = await base44.entities.DoctorProfile.filter({ 
          doctor_user_email: userData.email 
        });
        
        if (profiles.length === 0) {
          navigate(createPageUrl('DoctorOnboarding'));
          return;
        }
        
        setProfile(profiles[0]);
      } catch (e) {
        base44.auth.redirectToLogin();
      }
    };
    loadData();
  }, [navigate]);

  const { data: appointments = [] } = useQuery({
    queryKey: ['doctorAppointments', user?.email],
    queryFn: async () => {
      if (!profile) return [];
      const doctors = await base44.entities.Doctor.filter({ name: user?.full_name });
      if (doctors.length === 0) return [];
      return base44.entities.Appointment.filter({ doctor_id: doctors[0].id }, '-appointment_date');
    },
    enabled: !!profile && !!user
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ['doctorReviews', profile?.id],
    queryFn: () => base44.entities.DoctorReview.filter({ doctor_id: profile?.id }),
    enabled: !!profile
  });

  const todayAppointments = appointments.filter(apt => 
    format(new Date(apt.appointment_date), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
  );

  const stats = [
    {
      title: 'Today\'s Appointments',
      value: todayAppointments.length,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Total Patients',
      value: appointments.length,
      icon: Users,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50'
    },
    {
      title: 'Average Rating',
      value: profile?.rating?.toFixed(1) || '0.0',
      icon: Star,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50'
    },
    {
      title: 'Total Reviews',
      value: reviews.length,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  if (!profile) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <PageTransition className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Doctor Dashboard
            </h1>
            <p className="text-gray-500 mt-1">Welcome back, Dr. {user?.full_name}!</p>
          </div>
          <Badge className={
            profile.verification_status === 'verified' 
              ? 'bg-green-100 text-green-700'
              : 'bg-amber-100 text-amber-700'
          }>
            {profile.verification_status === 'verified' ? 'Verified' : 'Pending Verification'}
          </Badge>
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

        <Tabs defaultValue="appointments">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="appointments">
            <Card>
              <CardHeader>
                <CardTitle>Today's Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                {todayAppointments.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No appointments today
                  </div>
                ) : (
                  <div className="space-y-4">
                    {todayAppointments.map((apt) => (
                      <div 
                        key={apt.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                            <Users className="w-5 h-5 text-teal-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{apt.patient_name}</p>
                            <p className="text-sm text-gray-500">{apt.appointment_time}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge>{apt.consultation_type}</Badge>
                          {apt.consultation_type === 'video' && (
                            <Video className="w-5 h-5 text-blue-500" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights">
            <DoctorAIInsights 
              doctorEmail={user?.email}
              specialization={profile?.specialization}
            />
          </TabsContent>

          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <CardTitle>Patient Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                {reviews.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No reviews yet
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium text-gray-900">{review.patient_name}</p>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: review.rating }).map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{review.review}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Specialization</p>
                        <p className="font-medium capitalize">{profile.specialization?.replace(/_/g, ' ')}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Experience</p>
                        <p className="font-medium">{profile.experience_years} years</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Consultation Fee</p>
                        <p className="font-medium">₹{profile.consultation_fee}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Hospital</p>
                        <p className="font-medium">{profile.hospital_name || 'Not set'}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <AvailabilityManager 
                availability={profile.availability || []}
                onSave={(availability) => updateAvailability.mutate(availability)}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  );
}