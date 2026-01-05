import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  ChevronDown,
  Stethoscope,
  Brain,
  Pill,
  TestTube,
  FileText,
  Heart,
  User,
  LogOut,
  Settings,
  Bell,
  Building2,
  AlertCircle
} from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import NotificationPanel from '../notifications/NotificationPanel';

const navItems = [
  { 
    label: 'Services', 
    children: [
      { label: 'AI Symptom Checker', href: 'SymptomChecker', icon: Brain },
      { label: 'Find Doctors', href: 'Doctors', icon: Stethoscope },
      { label: 'Nearby Hospitals', href: 'MyNearbyHospitals', icon: Building2 },
      { label: 'Pharmacy', href: 'Pharmacy', icon: Pill },
      { label: 'Lab Tests', href: 'LabTests', icon: TestTube },
      { label: 'Health Records', href: 'HealthRecords', icon: FileText },
      { label: 'Health Coach', href: 'HealthCoach', icon: Heart },
    ]
  },
  { label: 'Doctors', href: 'Doctors' },
  { label: 'Hospitals', href: 'MyNearbyHospitals' },
  { label: 'Forum', href: 'Forum' },
  { label: 'Articles', href: 'Articles' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();

  const { data: unreadNotifications = [] } = useQuery({
    queryKey: ['unreadNotifications', user?.email],
    queryFn: () => base44.entities.Notification.filter({ 
      recipient_email: user?.email, 
      is_read: false 
    }),
    enabled: !!user?.email,
    refetchInterval: 30000
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuth = await base44.auth.isAuthenticated();
        if (isAuth) {
          const userData = await base44.auth.me();
          setUser(userData);
        }
      } catch (e) {
        console.log('Not authenticated');
      }
    };
    checkAuth();
  }, []);

  const handleLogout = () => {
    base44.auth.logout();
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/80 backdrop-blur-lg shadow-sm' 
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to={createPageUrl('Home')} className="flex items-center gap-2 flex-shrink-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 whitespace-nowrap">
                SwasthAI
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                item.children ? (
                  <DropdownMenu key={item.label}>
                    <DropdownMenuTrigger className="flex items-center gap-1 px-4 py-2 text-gray-600 hover:text-teal-600 font-medium transition-colors">
                      {item.label}
                      <ChevronDown className="w-4 h-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56">
                      {item.children.map((child) => (
                        <DropdownMenuItem key={child.href} asChild>
                          <Link 
                            to={createPageUrl(child.href)}
                            className="flex items-center gap-3 cursor-pointer"
                          >
                            <child.icon className="w-4 h-4 text-teal-600" />
                            {child.label}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link
                    key={item.href}
                    to={createPageUrl(item.href)}
                    className="px-4 py-2 text-gray-600 hover:text-teal-600 font-medium transition-colors"
                  >
                    {item.label}
                  </Link>
                )
              ))}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              <Link to={createPageUrl('EmergencyAssistance')} className="hidden md:block">
                <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  🚨 Emergency
                </Button>
              </Link>
              {user ? (
                <>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="relative"
                    onClick={() => setIsNotificationOpen(true)}
                  >
                    <Bell className="w-5 h-5 text-gray-600" />
                    {unreadNotifications.length > 0 && (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full" />
                    )}
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-colors">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center text-white font-semibold">
                        {user.full_name?.[0] || user.email?.[0]?.toUpperCase()}
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <div className="px-3 py-2">
                        <p className="font-medium text-gray-900">{user.full_name || 'User'}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to={createPageUrl('Profile')} className="flex items-center gap-2 cursor-pointer">
                          <User className="w-4 h-4" />
                          My Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to={createPageUrl('MyAppointments')} className="flex items-center gap-2 cursor-pointer">
                          <Stethoscope className="w-4 h-4" />
                          My Appointments
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to={createPageUrl('MyOrders')} className="flex items-center gap-2 cursor-pointer">
                          <Pill className="w-4 h-4" />
                          Medicine Orders
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to={createPageUrl('MyLabTests')} className="flex items-center gap-2 cursor-pointer">
                          <TestTube className="w-4 h-4" />
                          Lab Test History
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to={createPageUrl('HealthRecords')} className="flex items-center gap-2 cursor-pointer">
                          <FileText className="w-4 h-4" />
                          Health Records
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to={createPageUrl('DoctorDashboard')} className="flex items-center gap-2 cursor-pointer text-teal-600">
                          <Stethoscope className="w-4 h-4" />
                          Doctor Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to={createPageUrl('HospitalDashboard')} className="flex items-center gap-2 cursor-pointer text-purple-600">
                          <Building2 className="w-4 h-4" />
                          Hospital Dashboard
                        </Link>
                      </DropdownMenuItem>
                      {user.role === 'admin' && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link to={createPageUrl('AdminDashboard')} className="flex items-center gap-2 cursor-pointer text-purple-600">
                              <Settings className="w-4 h-4" />
                              Admin Dashboard
                            </Link>
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={handleLogout}
                        className="flex items-center gap-2 cursor-pointer text-rose-600"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <Link to={createPageUrl('RegisterChoice')}>
                  <Button 
                    className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white"
                  >
                    Login / Sign Up
                  </Button>
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="w-6 h-6 text-gray-700" />
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-50 lg:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed top-0 right-0 bottom-0 w-80 bg-white z-50 lg:hidden overflow-y-auto"
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-8">
                  <Link to={createPageUrl('Home')} className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-bold text-gray-900">SwasthAI</span>
                  </Link>
                  <button 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="w-6 h-6 text-gray-700" />
                  </button>
                </div>

                <nav className="space-y-2">
                  {navItems.map((item) => (
                    item.children ? (
                      <div key={item.label} className="space-y-1">
                        <p className="px-4 py-2 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                          {item.label}
                        </p>
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            to={createPageUrl(child.href)}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-teal-50 text-gray-700 hover:text-teal-600 transition-colors"
                          >
                            <child.icon className="w-5 h-5" />
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <Link
                        key={item.href}
                        to={createPageUrl(item.href)}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block px-4 py-3 rounded-xl hover:bg-teal-50 text-gray-700 hover:text-teal-600 font-medium transition-colors"
                      >
                        {item.label}
                      </Link>
                    )
                    ))}

                    <Link
                    to={createPageUrl('EmergencyAssistance')}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 font-medium transition-colors mt-4"
                    >
                    <AlertCircle className="w-5 h-5" />
                    🚨 Emergency Assistance
                    </Link>

                    <Link
                    to={createPageUrl('RegisterChoice')}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 font-medium transition-colors mt-2"
                    >
                    <Building2 className="w-5 h-5" />
                    Register as Provider
                    </Link>
                    </nav>

                {!user && (
                  <div className="mt-8 p-4 bg-gray-50 rounded-xl">
                    <p className="text-gray-600 mb-4">Sign in to access all features</p>
                    <Button 
                      onClick={() => base44.auth.redirectToLogin()}
                      className="w-full bg-gradient-to-r from-teal-500 to-emerald-500"
                    >
                      Login / Sign Up
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <NotificationPanel 
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        userEmail={user?.email}
      />
    </>
  );
}