import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { TestTube, Package, TrendingUp, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import PageTransition from '@/components/ui/PageTransition';

export default function LabPartnerDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const userData = await base44.auth.me();
        setUser(userData);
        
        const profiles = await base44.entities.LabPartner.filter({ 
          partner_user_email: userData.email 
        });
        
        if (profiles.length === 0) {
          navigate(createPageUrl('LabPartnerOnboarding'));
          return;
        }
        
        setProfile(profiles[0]);
      } catch (e) {
        base44.auth.redirectToLogin();
      }
    };
    loadData();
  }, [navigate]);

  const { data: bookings = [] } = useQuery({
    queryKey: ['labBookings', profile?.lab_name],
    queryFn: () => base44.entities.LabBooking.filter({ lab_name: profile?.lab_name }, '-created_date'),
    enabled: !!profile
  });

  const stats = [
    { title: 'Total Bookings', value: bookings.length, icon: Package, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { title: 'Active Tests', value: bookings.filter(b => b.status === 'booked').length, icon: TestTube, color: 'text-teal-600', bgColor: 'bg-teal-50' },
    { title: 'Rating', value: profile?.rating?.toFixed(1) || '0.0', icon: TrendingUp, color: 'text-amber-600', bgColor: 'bg-amber-50' },
    { title: 'Reviews', value: profile?.total_reviews || 0, icon: Users, color: 'text-purple-600', bgColor: 'bg-purple-50' }
  ];

  if (!profile) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <PageTransition className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Lab Partner Dashboard</h1>
            <p className="text-gray-500 mt-1">Welcome, {profile.lab_name}!</p>
          </div>
          <Badge className={
            profile.verification_status === 'verified' 
              ? 'bg-green-100 text-green-700'
              : 'bg-amber-100 text-amber-700'
          }>
            {profile.verification_status === 'verified' ? 'Verified' : 'Pending Verification'}
          </Badge>
        </div>

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

        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            {bookings.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No bookings yet</div>
            ) : (
              <div className="space-y-4">
                {bookings.slice(0, 10).map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-medium text-gray-900">{booking.patient_name}</p>
                      <p className="text-sm text-gray-500">{booking.tests?.length || 0} test(s)</p>
                    </div>
                    <Badge className={
                      booking.status === 'report_ready' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    }>
                      {booking.status?.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  );
}