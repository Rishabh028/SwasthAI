import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Package, Clock, CheckCircle, Truck, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PageTransition from '@/components/ui/PageTransition';
import { SkeletonList } from '@/components/ui/SkeletonLoader';

const statusColors = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-purple-100 text-purple-700',
  shipped: 'bg-indigo-100 text-indigo-700',
  out_for_delivery: 'bg-cyan-100 text-cyan-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700'
};

export default function MyOrders() {
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

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['orders', user?.email],
    queryFn: () => base44.entities.MedicineOrder.filter({ created_by: user?.email }, '-created_date'),
    enabled: !!user?.email
  });

  const activeOrders = orders.filter(o => !['delivered', 'cancelled'].includes(o.status));
  const pastOrders = orders.filter(o => ['delivered', 'cancelled'].includes(o.status));

  const OrderCard = ({ order }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-gray-500">Order #{order.order_number}</p>
          <p className="text-sm text-gray-500">{format(new Date(order.created_date), 'PPP')}</p>
        </div>
        <Badge className={statusColors[order.status]}>
          {order.status?.replace(/_/g, ' ')}
        </Badge>
      </div>

      <div className="space-y-2 mb-4">
        {order.items?.slice(0, 2).map((item, idx) => (
          <div key={idx} className="flex justify-between text-sm">
            <span className="text-gray-600">{item.medicine_name} x {item.quantity}</span>
            <span className="font-medium">₹{item.price * item.quantity}</span>
          </div>
        ))}
        {order.items?.length > 2 && (
          <p className="text-sm text-gray-500">+{order.items.length - 2} more items</p>
        )}
      </div>

      <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
        <span className="font-semibold">Total: ₹{order.total_amount}</span>
        {order.status === 'delivered' && (
          <CheckCircle className="w-5 h-5 text-green-500" />
        )}
        {['shipped', 'out_for_delivery'].includes(order.status) && (
          <Truck className="w-5 h-5 text-blue-500" />
        )}
      </div>
    </motion.div>
  );

  if (!user) return null;

  return (
    <PageTransition className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

        <Tabs defaultValue="active">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="active">Active ({activeOrders.length})</TabsTrigger>
            <TabsTrigger value="past">Past ({pastOrders.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            {isLoading ? (
              <SkeletonList count={3} />
            ) : activeOrders.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No active orders</h3>
                <p className="text-gray-500">Your active orders will appear here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeOrders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="past">
            {isLoading ? (
              <SkeletonList count={3} />
            ) : pastOrders.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl">
                <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No past orders</h3>
                <p className="text-gray-500">Your order history will appear here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pastOrders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  );
}