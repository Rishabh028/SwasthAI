import React, { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import {
  Search,
  TestTube,
  Droplet,
  Clock,
  Home,
  BadgeCheck,
  ChevronRight,
  Heart,
  Activity,
  Thermometer,
  Beaker,
  ShoppingCart,
  X,
  Plus
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

const categoryIcons = {
  blood: Droplet,
  cardiac: Heart,
  diabetes: Activity,
  thyroid: Thermometer,
  full_body: Beaker,
  default: TestTube
};

const categories = [
  { value: 'all', label: 'All Tests' },
  { value: 'blood', label: 'Blood Tests' },
  { value: 'diabetes', label: 'Diabetes' },
  { value: 'thyroid', label: 'Thyroid' },
  { value: 'cardiac', label: 'Cardiac' },
  { value: 'full_body', label: 'Full Body Checkup' },
  { value: 'vitamin', label: 'Vitamins' },
  { value: 'liver', label: 'Liver' },
  { value: 'kidney', label: 'Kidney' },
];

const popularPackages = [
  {
    id: 'fullbody',
    name: 'Full Body Checkup',
    tests: 80,
    price: 999,
    mrp: 2500,
    icon: Beaker,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'diabetes',
    name: 'Diabetes Screening',
    tests: 15,
    price: 499,
    mrp: 1200,
    icon: Activity,
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'heart',
    name: 'Heart Health Package',
    tests: 20,
    price: 1299,
    mrp: 3000,
    icon: Heart,
    color: 'from-rose-500 to-red-500'
  },
  {
    id: 'thyroid',
    name: 'Thyroid Profile',
    tests: 8,
    price: 399,
    mrp: 900,
    icon: Thermometer,
    color: 'from-amber-500 to-orange-500'
  }
];

export default function LabTests() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem('swasthai_lab_cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const { data: tests = [], isLoading } = useQuery({
    queryKey: ['labTests'],
    queryFn: () => base44.entities.LabTest.list('-popular', 100),
  });

  const filteredTests = useMemo(() => {
    return tests.filter(test => {
      if (search) {
        const searchLower = search.toLowerCase();
        const matchesSearch = 
          test.name?.toLowerCase().includes(searchLower) ||
          test.code?.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }
      if (category !== 'all' && test.category !== category) return false;
      return true;
    });
  }, [tests, search, category]);

  const addToCart = (test) => {
    if (cart.find(item => item.id === test.id)) {
      toast.info('Test already in cart');
      return;
    }
    const updatedCart = [...cart, test];
    setCart(updatedCart);
    localStorage.setItem('swasthai_lab_cart', JSON.stringify(updatedCart));
    toast.success(`${test.name} added to cart`);
  };

  const removeFromCart = (testId) => {
    const updatedCart = cart.filter(item => item.id !== testId);
    setCart(updatedCart);
    localStorage.setItem('swasthai_lab_cart', JSON.stringify(updatedCart));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <PageTransition className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-amber-500 to-orange-500 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-6">
              <TestTube className="w-8 h-8" />
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Lab Tests & Health Checkups
            </h1>
            <p className="text-amber-100 text-lg max-w-2xl mx-auto">
              Book diagnostic tests with free home sample collection. 
              Get reports within 24-48 hours.
            </p>
          </motion.div>

          {/* Features */}
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { icon: Home, label: 'Home Collection', desc: 'Free sample pickup' },
              { icon: Clock, label: 'Fast Reports', desc: 'Within 24-48 hours' },
              { icon: BadgeCheck, label: 'NABL Labs', desc: 'Certified partners' },
              { icon: TestTube, label: '500+ Tests', desc: 'Available' },
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
                <p className="text-xs text-amber-100">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Packages */}
      <section className="container mx-auto px-4 -mt-8 relative z-10 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Popular Health Packages</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {popularPackages.map((pkg, index) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-gradient-to-br ${pkg.color} rounded-2xl p-5 text-white cursor-pointer hover:scale-105 transition-transform`}
              onClick={() => addToCart({ id: pkg.id, name: pkg.name, price: pkg.price })}
            >
              <pkg.icon className="w-8 h-8 mb-3 opacity-80" />
              <h3 className="font-bold mb-1">{pkg.name}</h3>
              <p className="text-sm opacity-80 mb-3">{pkg.tests} tests included</p>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold">₹{pkg.price}</span>
                <span className="text-sm line-through opacity-60">₹{pkg.mrp}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Search & Filter */}
      <section className="container mx-auto px-4 mb-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search tests..."
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

      {/* Tests Grid */}
      <section className="container mx-auto px-4 pb-32">
        {isLoading ? (
          <SkeletonList count={6} />
        ) : filteredTests.length === 0 ? (
          <div className="text-center py-16">
            <TestTube className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No tests found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredTests.map((test, index) => {
              const IconComponent = categoryIcons[test.category] || categoryIcons.default;
              return (
                <motion.div
                  key={test.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-5"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-6 h-6 text-amber-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-semibold text-gray-900">{test.name}</h3>
                          {test.code && (
                            <p className="text-sm text-gray-500">Code: {test.code}</p>
                          )}
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-xl font-bold text-gray-900">₹{test.price}</p>
                          {test.mrp > test.price && (
                            <p className="text-sm text-gray-400 line-through">₹{test.mrp}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-gray-500">
                        {test.parameters_count && (
                          <span className="flex items-center gap-1">
                            <Beaker className="w-4 h-4" />
                            {test.parameters_count} parameters
                          </span>
                        )}
                        {test.report_time && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {test.report_time}
                          </span>
                        )}
                        {test.fasting_required && (
                          <Badge variant="secondary" className="bg-amber-50 text-amber-700">
                            Fasting Required
                          </Badge>
                        )}
                        {test.home_collection && (
                          <Badge variant="secondary" className="bg-green-50 text-green-700">
                            <Home className="w-3 h-3 mr-1" />
                            Home Collection
                          </Badge>
                        )}
                      </div>

                      {test.description && (
                        <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                          {test.description}
                        </p>
                      )}
                    </div>
                    <Button
                      onClick={() => addToCart(test)}
                      className="bg-amber-500 hover:bg-amber-600 flex-shrink-0"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      {/* Floating Cart Button */}
      {cart.length > 0 && (
        <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
          <SheetTrigger asChild>
            <motion.button
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-amber-500 text-white px-6 py-4 rounded-2xl shadow-lg shadow-amber-500/30 flex items-center gap-4 z-50"
            >
              <div className="relative">
                <ShoppingCart className="w-6 h-6" />
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-white text-amber-500 text-xs font-bold rounded-full flex items-center justify-center">
                  {cart.length}
                </span>
              </div>
              <div className="text-left">
                <p className="text-sm font-medium">{cart.length} tests</p>
                <p className="text-lg font-bold">₹{cartTotal}</p>
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
                Your Cart ({cart.length} tests)
              </SheetTitle>
            </SheetHeader>

            <div className="mt-6 flex-1 overflow-y-auto">
              <div className="space-y-3">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <TestTube className="w-8 h-8 text-amber-500" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-gray-900 line-clamp-1">
                        {item.name}
                      </h4>
                      <p className="text-sm font-bold text-gray-900">₹{item.price}</p>
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
            </div>

            <div className="mt-6 border-t pt-4 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium">₹{cartTotal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Home Collection</span>
                <span className="font-medium text-green-600">FREE</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>₹{cartTotal}</span>
              </div>
              <Link to={createPageUrl('BookLabTest')}>
                <Button className="w-full bg-amber-500 hover:bg-amber-600">
                  Book Now
                </Button>
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </PageTransition>
  );
}