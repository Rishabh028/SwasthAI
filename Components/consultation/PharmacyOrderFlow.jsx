import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, MapPin, Phone, Clock, CheckCircle,
  Building2, Star, Package, Truck, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'react-hot-toast';

export default function PharmacyOrderFlow({ prescription, onClose, onBack }) {
  const queryClient = useQueryClient();
  const [step, setStep] = useState(1);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [deliveryAddress, setDeliveryAddress] = useState({
    address_line1: '',
    city: '',
    pincode: ''
  });

  // Mock pharmacy data (in production, this would come from a Pharmacy entity)
  const pharmacies = [
    {
      id: '1',
      name: 'MedPlus Pharmacy',
      address: '123 MG Road, Bangalore',
      phone: '+91 98765 43210',
      rating: 4.5,
      delivery_time: '30-45 mins',
      distance: '1.2 km'
    },
    {
      id: '2', 
      name: 'Apollo Pharmacy',
      address: '456 Indiranagar, Bangalore',
      phone: '+91 98765 43211',
      rating: 4.7,
      delivery_time: '45-60 mins',
      distance: '2.5 km'
    },
    {
      id: '3',
      name: 'Wellness Forever',
      address: '789 Koramangala, Bangalore',
      phone: '+91 98765 43212',
      rating: 4.3,
      delivery_time: '60-90 mins',
      distance: '3.8 km'
    }
  ];

  const createOrder = useMutation({
    mutationFn: async (orderData) => {
      const orderNumber = `ORD${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
      
      const order = await base44.entities.PharmacyOrder.create({
        prescription_id: prescription.id,
        patient_email: prescription.patient_email,
        patient_name: prescription.patient_name,
        patient_phone: orderData.phone,
        pharmacy_name: selectedPharmacy.name,
        pharmacy_id: selectedPharmacy.id,
        medicines: prescription.medicines.map(m => ({
          medicine_name: m.medicine_name,
          quantity: m.quantity,
          price: 0 // Would be filled by pharmacy
        })),
        total_amount: 0, // Would be calculated by pharmacy
        delivery_address: deliveryAddress,
        order_number: orderNumber,
        placed_at: new Date().toISOString(),
        estimated_delivery: '60 mins',
        status: 'placed'
      });

      // Create notification
      await base44.entities.Notification.create({
        recipient_email: prescription.patient_email,
        title: 'Medicine Order Placed',
        message: `Your order ${orderNumber} has been placed at ${selectedPharmacy.name}. We'll notify you once it's confirmed.`,
        type: 'order',
        link: 'MyOrders',
        priority: 'medium'
      });

      return order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pharmacyOrders'] });
      setStep(3);
    }
  });

  const handlePlaceOrder = () => {
    if (!deliveryAddress.address_line1 || !deliveryAddress.city || !deliveryAddress.pincode) {
      toast.error('Please fill in all address fields');
      return;
    }
    createOrder.mutate({ phone: '' });
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <div className="flex items-center gap-3">
            {step > 1 && step < 3 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => step === 2 ? setStep(1) : onBack()}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            )}
            <div>
              <DialogTitle>Order Medicines</DialogTitle>
              <p className="text-sm text-gray-500 mt-1">
                {step === 1 && 'Select a nearby pharmacy'}
                {step === 2 && 'Enter delivery details'}
                {step === 3 && 'Order confirmed'}
              </p>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1" style={{ maxHeight: 'calc(90vh - 180px)' }}>
          <div className="p-6">
            {/* Step 1: Select Pharmacy */}
            {step === 1 && (
              <div className="space-y-4">
                <RadioGroup value={selectedPharmacy?.id} onValueChange={(id) => {
                  setSelectedPharmacy(pharmacies.find(p => p.id === id));
                }}>
                  {pharmacies.map((pharmacy) => (
                    <motion.div
                      key={pharmacy.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedPharmacy?.id === pharmacy.id
                          ? 'border-teal-500 bg-teal-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedPharmacy(pharmacy)}
                    >
                      <div className="flex items-start gap-3">
                        <RadioGroupItem value={pharmacy.id} className="mt-1" />
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-semibold">{pharmacy.name}</h4>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex items-center gap-1">
                                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                  <span className="text-sm">{pharmacy.rating}</span>
                                </div>
                                <span className="text-gray-300">•</span>
                                <span className="text-sm text-gray-500">{pharmacy.distance}</span>
                              </div>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              <Clock className="w-3 h-3 mr-1" />
                              {pharmacy.delivery_time}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                            <MapPin className="w-4 h-4" />
                            <span>{pharmacy.address}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="w-4 h-4" />
                            <span>{pharmacy.phone}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </RadioGroup>

                {/* Medicine Summary */}
                <div className="bg-gray-50 rounded-lg p-4 mt-6">
                  <h4 className="font-semibold mb-3">Medicines to Order</h4>
                  <div className="space-y-2">
                    {prescription.medicines.map((med, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <span>{med.medicine_name}</span>
                        <Badge variant="outline">Qty: {med.quantity}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Delivery Address */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="bg-teal-50 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <Building2 className="w-5 h-5 text-teal-600 mt-0.5" />
                    <div>
                      <p className="font-medium">{selectedPharmacy.name}</p>
                      <p className="text-sm text-gray-600 mt-1">{selectedPharmacy.address}</p>
                      <Badge className="mt-2 bg-teal-100 text-teal-700">
                        <Clock className="w-3 h-3 mr-1" />
                        {selectedPharmacy.delivery_time}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Delivery Address *</Label>
                  <Textarea
                    value={deliveryAddress.address_line1}
                    onChange={(e) => setDeliveryAddress({...deliveryAddress, address_line1: e.target.value})}
                    placeholder="Flat/House No., Building Name, Street"
                    rows={2}
                    className="mt-1.5"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>City *</Label>
                    <Input
                      value={deliveryAddress.city}
                      onChange={(e) => setDeliveryAddress({...deliveryAddress, city: e.target.value})}
                      placeholder="City"
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label>Pincode *</Label>
                    <Input
                      value={deliveryAddress.pincode}
                      onChange={(e) => setDeliveryAddress({...deliveryAddress, pincode: e.target.value})}
                      placeholder="Pincode"
                      maxLength={6}
                      className="mt-1.5"
                    />
                  </div>
                </div>

                <div className="bg-amber-50 rounded-lg p-4 text-sm">
                  <p className="text-amber-900">
                    <strong>Note:</strong> The pharmacy will call you to confirm availability and final pricing before delivery.
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Confirmation */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Order Placed!</h3>
                <p className="text-gray-600 mb-6">
                  Your medicine order has been sent to {selectedPharmacy.name}
                </p>
                <div className="bg-gray-50 rounded-lg p-4 text-left max-w-md mx-auto mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Package className="w-5 h-5 text-teal-600" />
                    <div>
                      <p className="font-medium">What happens next?</p>
                    </div>
                  </div>
                  <ol className="space-y-2 text-sm text-gray-600">
                    <li>1. Pharmacy will verify prescription</li>
                    <li>2. You'll receive a call for confirmation</li>
                    <li>3. Medicines will be prepared</li>
                    <li>4. Delivery within {selectedPharmacy.delivery_time}</li>
                  </ol>
                </div>
                <Button onClick={onClose} className="bg-teal-500 hover:bg-teal-600">
                  View My Orders
                </Button>
              </motion.div>
            )}
          </div>
        </ScrollArea>

        {/* Footer Actions */}
        {step < 3 && (
          <div className="p-6 pt-4 border-t flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            {step === 1 && (
              <Button
                onClick={() => setStep(2)}
                disabled={!selectedPharmacy}
                className="flex-1 bg-teal-500 hover:bg-teal-600"
              >
                Continue to Delivery
              </Button>
            )}
            {step === 2 && (
              <Button
                onClick={handlePlaceOrder}
                disabled={createOrder.isPending}
                className="flex-1 bg-teal-500 hover:bg-teal-600"
              >
                {createOrder.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Place Order
                  </>
                )}
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}