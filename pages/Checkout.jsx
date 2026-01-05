import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import {
  ShoppingCart,
  MapPin,
  CreditCard,
  CheckCircle,
  ArrowLeft,
  Loader2,
  Upload
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import PageTransition from '@/components/ui/PageTransition';
import { toast } from 'react-hot-toast';

export default function Checkout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [prescriptionFile, setPrescriptionFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [orderData, setOrderData] = useState({
    delivery_address: {
      name: '',
      phone: '',
      address_line1: '',
      address_line2: '',
      city: '',
      state: '',
      pincode: ''
    },
    payment_method: 'cod',
    prescription_url: ''
  });

  useEffect(() => {
    const loadUser = async () => {
      try {
        const isAuth = await base44.auth.isAuthenticated();
        if (isAuth) {
          const userData = await base44.auth.me();
          setUser(userData);
          setOrderData(prev => ({
            ...prev,
            delivery_address: {
              ...prev.delivery_address,
              name: userData.full_name || '',
              phone: userData.phone || userData.phone_number || ''
            }
          }));
        } else {
          base44.auth.redirectToLogin();
        }
      } catch (e) {
        base44.auth.redirectToLogin();
      }
    };
    loadUser();

    // Get cart from localStorage
    const savedCart = localStorage.getItem('swasthai_cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    } else {
      navigate(createPageUrl('Pharmacy'));
    }
  }, [navigate]);

  const handlePrescriptionUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setOrderData(prev => ({ ...prev, prescription_url: file_url }));
      setPrescriptionFile(file.name);
      toast.success('Prescription uploaded');
    } catch (error) {
      toast.error('Failed to upload prescription');
    }
    setUploading(false);
  };

  const createOrder = useMutation({
    mutationFn: (data) => base44.entities.MedicineOrder.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      localStorage.removeItem('swasthai_cart');
      toast.success('Order placed successfully!');
      navigate(createPageUrl('OrderConfirmation'));
    }
  });

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = subtotal >= 499 ? 0 : 40;
  const total = subtotal + deliveryFee;

  const handlePlaceOrder = () => {
    if (!orderData.delivery_address.name || !orderData.delivery_address.address_line1) {
      toast.error('Please fill all delivery details');
      return;
    }

    const requiresPrescription = cart.some(item => item.prescription_required);
    if (requiresPrescription && !orderData.prescription_url) {
      toast.error('Please upload prescription for prescription medicines');
      return;
    }

    createOrder.mutate({
      order_number: `ORD${Date.now()}`,
      items: cart.map(item => ({
        medicine_id: item.id,
        medicine_name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      subtotal,
      delivery_fee: deliveryFee,
      total_amount: total,
      status: 'pending',
      payment_status: orderData.payment_method === 'cod' ? 'pending' : 'paid',
      payment_method: orderData.payment_method,
      delivery_address: orderData.delivery_address,
      prescription_url: orderData.prescription_url,
      estimated_delivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
    });
  };

  const requiresPrescription = cart.some(item => item.prescription_required);

  return (
    <PageTransition className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Cart
        </Button>

        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-teal-500" />
                Delivery Address
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Full Name *</Label>
                    <Input
                      value={orderData.delivery_address.name}
                      onChange={(e) => setOrderData(prev => ({
                        ...prev,
                        delivery_address: { ...prev.delivery_address, name: e.target.value }
                      }))}
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label>Phone Number *</Label>
                    <Input
                      value={orderData.delivery_address.phone}
                      onChange={(e) => setOrderData(prev => ({
                        ...prev,
                        delivery_address: { ...prev.delivery_address, phone: e.target.value }
                      }))}
                      className="mt-1.5"
                    />
                  </div>
                </div>
                <div>
                  <Label>Address Line 1 *</Label>
                  <Input
                    value={orderData.delivery_address.address_line1}
                    onChange={(e) => setOrderData(prev => ({
                      ...prev,
                      delivery_address: { ...prev.delivery_address, address_line1: e.target.value }
                    }))}
                    placeholder="House/Flat No., Building Name"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label>Address Line 2</Label>
                  <Input
                    value={orderData.delivery_address.address_line2}
                    onChange={(e) => setOrderData(prev => ({
                      ...prev,
                      delivery_address: { ...prev.delivery_address, address_line2: e.target.value }
                    }))}
                    placeholder="Street, Area, Landmark"
                    className="mt-1.5"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>City *</Label>
                    <Input
                      value={orderData.delivery_address.city}
                      onChange={(e) => setOrderData(prev => ({
                        ...prev,
                        delivery_address: { ...prev.delivery_address, city: e.target.value }
                      }))}
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label>State *</Label>
                    <Input
                      value={orderData.delivery_address.state}
                      onChange={(e) => setOrderData(prev => ({
                        ...prev,
                        delivery_address: { ...prev.delivery_address, state: e.target.value }
                      }))}
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label>Pincode *</Label>
                    <Input
                      value={orderData.delivery_address.pincode}
                      onChange={(e) => setOrderData(prev => ({
                        ...prev,
                        delivery_address: { ...prev.delivery_address, pincode: e.target.value }
                      }))}
                      className="mt-1.5"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Prescription Upload */}
            {requiresPrescription && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-amber-900 mb-2">
                  Prescription Required
                </h2>
                <p className="text-sm text-amber-700 mb-4">
                  Your cart contains prescription medicines. Please upload a valid prescription.
                </p>
                <div className="border-2 border-dashed border-amber-300 rounded-xl p-4 text-center">
                  <input
                    type="file"
                    id="prescription"
                    className="hidden"
                    accept="image/*,.pdf"
                    onChange={handlePrescriptionUpload}
                  />
                  <label htmlFor="prescription" className="cursor-pointer">
                    {uploading ? (
                      <Loader2 className="w-8 h-8 mx-auto text-amber-600 animate-spin" />
                    ) : prescriptionFile ? (
                      <div className="text-green-600">
                        <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-sm">{prescriptionFile}</p>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 mx-auto text-amber-600 mb-2" />
                        <p className="text-sm text-amber-800">Click to upload prescription</p>
                      </>
                    )}
                  </label>
                </div>
              </div>
            )}

            {/* Payment Method */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-teal-500" />
                Payment Method
              </h2>
              <RadioGroup 
                value={orderData.payment_method}
                onValueChange={(value) => setOrderData(prev => ({ ...prev, payment_method: value }))}
              >
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors hover:border-teal-500">
                    <RadioGroupItem value="cod" />
                    <div className="flex-1">
                      <p className="font-medium">Cash on Delivery</p>
                      <p className="text-sm text-gray-500">Pay when you receive</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors hover:border-teal-500">
                    <RadioGroupItem value="upi" />
                    <div className="flex-1">
                      <p className="font-medium">UPI</p>
                      <p className="text-sm text-gray-500">PhonePe, Google Pay, Paytm</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors hover:border-teal-500">
                    <RadioGroupItem value="card" />
                    <div className="flex-1">
                      <p className="font-medium">Credit/Debit Card</p>
                      <p className="text-sm text-gray-500">Visa, Mastercard, Rupay</p>
                    </div>
                  </label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.name} x {item.quantity}
                    </span>
                    <span className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className={deliveryFee === 0 ? 'text-green-600' : ''}>
                    {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                  </span>
                </div>
                {subtotal < 499 && (
                  <p className="text-xs text-gray-500">
                    Add ₹{(499 - subtotal).toFixed(2)} more for free delivery
                  </p>
                )}
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Total</span>
                  <span className="text-teal-600">₹{total.toFixed(2)}</span>
                </div>
              </div>

              <Button
                onClick={handlePlaceOrder}
                disabled={createOrder.isPending}
                className="w-full mt-6 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
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
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}