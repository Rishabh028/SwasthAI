import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { 
  TestTube, 
  Calendar, 
  Download, 
  Eye, 
  Clock,
  CheckCircle,
  Home
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PageTransition from '@/components/ui/PageTransition';
import { SkeletonList } from '@/components/ui/SkeletonLoader';

const statusColors = {
  booked: 'bg-blue-100 text-blue-700',
  sample_collected: 'bg-purple-100 text-purple-700',
  processing: 'bg-amber-100 text-amber-700',
  report_ready: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700'
};

export default function MyLabTests() {
  const [user, setUser] = useState(null);

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

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['myLabBookings', user?.email],
    queryFn: () => base44.entities.LabBooking.filter({ created_by: user?.email }, '-created_date'),
    enabled: !!user?.email
  });

  const activeBookings = bookings.filter(b => !['report_ready', 'cancelled'].includes(b.status));
  const completedBookings = bookings.filter(b => ['report_ready', 'cancelled'].includes(b.status));

  const BookingCard = ({ booking }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="font-semibold text-gray-900">Booking #{booking.booking_number}</p>
          <p className="text-sm text-gray-500">{format(new Date(booking.created_date), 'PPP')}</p>
        </div>
        <Badge className={statusColors[booking.status]}>
          {booking.status?.replace(/_/g, ' ')}
        </Badge>
      </div>

      <div className="space-y-2 mb-4">
        <p className="text-sm text-gray-600">
          <span className="font-medium">Patient:</span> {booking.patient_name}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Tests:</span> {booking.tests?.length || 0} test(s)
        </p>
        <p className="text-sm text-gray-600 flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Collection: {format(new Date(booking.collection_date), 'PPP')} • {booking.collection_slot}
        </p>
        <p className="text-sm text-gray-600 flex items-center gap-2">
          <Home className="w-4 h-4" />
          {booking.collection_type === 'home' ? 'Home Collection' : 'Lab Visit'}
        </p>
      </div>

      <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
        <span className="font-bold text-gray-900">₹{booking.total_amount}</span>
        {booking.report_url && (
          <a 
            href={booking.report_url} 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <Button size="sm" className="bg-green-500 hover:bg-green-600">
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </Button>
          </a>
        )}
      </div>
    </motion.div>
  );

  if (!user) return null;

  return (
    <PageTransition className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">My Lab Tests</h1>

        <Tabs defaultValue="active">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="active">
              Active ({activeBookings.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({completedBookings.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            {isLoading ? (
              <SkeletonList count={3} />
            ) : activeBookings.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl">
                <TestTube className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No active bookings</h3>
                <p className="text-gray-500">Your active lab test bookings will appear here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed">
            {isLoading ? (
              <SkeletonList count={3} />
            ) : completedBookings.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl">
                <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No completed tests</h3>
                <p className="text-gray-500">Your completed lab tests will appear here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {completedBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  );
}