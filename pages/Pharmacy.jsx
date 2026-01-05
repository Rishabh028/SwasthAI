import React, { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ShoppingCart,
  Plus,
  Minus,
  Pill,
  Package,
  Truck,
  Clock,
  Filter,
  X,
  BadgeCheck,
  Percent
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import PageTransition from '@/components/ui/PageTransition';
import { SkeletonList } from '@/components/ui/SkeletonLoader';
import { toast } from 'react-hot-toast';

const categories = [
  { value: 'all', label: 'All Categories' },
  { value: 'tablet', label: 'Tablets' },
  { value: 'capsule', label: 'Capsules' },
  { value: 'syrup', label: 'Syrups' },
  { value: 'cream', label: 'Creams & Ointments' },
  { value: 'drops', label: 'Drops' },
  { value: 'inhaler', label: 'Inhalers' },
];

export default function Pharmacy() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem('swasthai_cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const { data: medicines = [], isLoading } = useQuery({
    queryKey: ['medicines'],
    queryFn: () => base44.entities.Medicine.list('-created_date', 100),
  });

  const filteredMedicines = useMemo(() => {
    return medicines.filter(med => {
      if (search) {
        const searchLower = search.toLowerCase();
        const matchesSearch = 
          med.name?.toLowerCase().includes(searchLower) ||
          med.generic_name?.toLowerCase().includes(searchLower) ||
          med.manufacturer?.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }
      if (category !== 'all' && med.category !== category) return false;
      return true;
    });
  }, [medicines, search, category]);

  const addToCart = (medicine) => {
    const updatedCart = (() => {
      const existing = cart.find(item => item.id === medicine.id);
      if (existing) {
        return cart.map(item => 
          item.id === medicine.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...cart, { ...medicine, quantity: 1 }];
    })();
    setCart(updatedCart);
    localStorage.setItem('swasthai_cart', JSON.stringify(updatedCart));
    toast.success(`${medicine.name} added to cart`);
  };

  const updateQuantity = (medicineId, delta) => {
    const updatedCart = cart.map(item => {
      if (item.id === medicineId) {
        const newQuantity = item.quantity + delta;
        if (newQuantity <= 0) return null;
        return { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(Boolean);
    setCart(updatedCart);
    localStorage.setItem('swasthai_cart', JSON.stringify(updatedCart));
  };

  const removeFromCart = (medicineId) => {
    const updatedCart = cart.filter(item => item.id !== medicineId);
    setCart(updatedCart);
    localStorage.setItem('swasthai_cart', JSON.stringify(updatedCart));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <PageTransition className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-rose-500 to-pink-500 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-6">
              <Pill className="w-8 h-8" />
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Online Pharmacy
            </h1>
            <p className="text-rose-100 text-lg max-w-2xl mx-auto">
              Order medicines online and get them delivered to your doorstep. 
              Up to 25% off on all medicines!
            </p>
          </motion.div>

          {/* Features */}
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { icon: Truck, label: 'Free Delivery', desc: 'On orders above ₹499' },
              { icon: Clock, label: 'Same Day', desc: 'Express delivery' },
              { icon: BadgeCheck, label: '100% Genuine', desc: 'Verified medicines' },
              { icon: Percent, label: 'Best Prices', desc: 'Up to 25% off' },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center"
              >
                <feature.icon className="w-6 h-6 mx-auto mb-2" />
                <p className="font-medium text-sm">{feature.label}</p>
                <p className="text-xs text-rose-100">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="container mx-auto px-4 -mt-8 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 md:p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search medicines..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-12 rounded-xl"
              />
            </div>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full md:w-48 h-12 rounded-xl">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="container mx-auto px-4 pb-32">
        {isLoading ? (
          <SkeletonList count={8} />
        ) : filteredMedicines.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No medicines found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredMedicines.map((medicine, index) => (
              <motion.div
                key={medicine.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all overflow-hidden"
              >
                {/* Image */}
                <div className="aspect-square bg-gray-50 p-4 relative">
                  {medicine.image_url ? (
                    <img 
                      src={medicine.image_url} 
                      alt={medicine.name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Pill className="w-16 h-16 text-gray-200" />
                    </div>
                  )}
                  {medicine.discount_percent > 0 && (
                    <Badge className="absolute top-2 left-2 bg-green-500 text-white">
                      {medicine.discount_percent}% OFF
                    </Badge>
                  )}
                  {medicine.prescription_required && (
                    <Badge className="absolute top-2 right-2 bg-amber-100 text-amber-700">
                      Rx
                    </Badge>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 line-clamp-2 text-sm">
                    {medicine.name}
                  </h3>
                  {medicine.generic_name && (
                    <p className="text-xs text-gray-500 mt-1">{medicine.generic_name}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">{medicine.pack_size}</p>

                  <div className="mt-3 flex items-center justify-between">
                    <div>
                      <p className="text-lg font-bold text-gray-900">₹{medicine.price}</p>
                      {medicine.mrp > medicine.price && (
                        <p className="text-xs text-gray-400 line-through">₹{medicine.mrp}</p>
                      )}
                    </div>
                    <Button
                      size="sm"
                      onClick={() => addToCart(medicine)}
                      disabled={!medicine.in_stock}
                      className="bg-rose-500 hover:bg-rose-600"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  {!medicine.in_stock && (
                    <p className="text-xs text-red-500 mt-2">Out of Stock</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Floating Cart Button */}
      {cartItemCount > 0 && (
        <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
          <SheetTrigger asChild>
            <motion.button
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-rose-500 text-white px-6 py-4 rounded-2xl shadow-lg shadow-rose-500/30 flex items-center gap-4 z-50"
            >
              <div className="relative">
                <ShoppingCart className="w-6 h-6" />
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-white text-rose-500 text-xs font-bold rounded-full flex items-center justify-center">
                  {cartItemCount}
                </span>
              </div>
              <div className="text-left">
                <p className="text-sm font-medium">{cartItemCount} items</p>
                <p className="text-lg font-bold">₹{cartTotal.toFixed(2)}</p>
              </div>
              <span className="bg-white/20 px-3 py-1 rounded-lg text-sm">
                View Cart →
              </span>
            </motion.button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:w-96">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Your Cart ({cartItemCount} items)
              </SheetTitle>
            </SheetHeader>

            <div className="mt-6 flex-1 overflow-y-auto">
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-3 p-3 bg-gray-50 rounded-xl">
                      <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                        {item.image_url ? (
                          <img src={item.image_url} alt={item.name} className="w-12 h-12 object-contain" />
                        ) : (
                          <Pill className="w-8 h-8 text-gray-300" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-gray-900 line-clamp-1">
                          {item.name}
                        </h4>
                        <p className="text-sm text-gray-500">{item.pack_size}</p>
                        <div className="flex items-center justify-between mt-2">
                          <p className="font-bold text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</p>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-7 h-7 rounded-lg bg-white border flex items-center justify-center"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-7 h-7 rounded-lg bg-white border flex items-center justify-center"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="mt-6 border-t pt-4 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium">₹{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Delivery Fee</span>
                  <span className="font-medium text-green-600">FREE</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>₹{cartTotal.toFixed(2)}</span>
                </div>
                <Link to={createPageUrl('Checkout')}>
                  <Button className="w-full bg-rose-500 hover:bg-rose-600">
                    Proceed to Checkout
                  </Button>
                </Link>
              </div>
            )}
          </SheetContent>
        </Sheet>
      )}
    </PageTransition>
  );
}