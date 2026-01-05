import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './layout.jsx';

// Import all pages
import ABDM from '@/pages/ABDM.jsx';
import About from '@/pages/About.jsx';
import AdminDashboard from '@/pages/AdminDashboard.jsx';
import ArticleRead from '@/pages/ArticleRead.jsx';
import Articles from '@/pages/Articles.jsx';
import BookAppointment from '@/pages/BookAppointment.jsx';
import BookLabTest from '@/pages/BookLabTest.jsx';
import Careers from '@/pages/Careers.jsx';
import Checkout from '@/pages/Checkout.jsx';
import Contact from '@/pages/Contact.jsx';
import CreatePost from '@/pages/CreatePost.jsx';
import DoctorAppointments from '@/pages/DoctorAppointments.jsx';
import DoctorDashboard from '@/pages/DoctorDashboard.jsx';
import DoctorDetails from '@/pages/DoctorDetails.jsx';
import DoctorOnboarding from '@/pages/DoctorOnboarding.jsx';
import Doctors from '@/pages/Doctors.jsx';
import EmergencyAssistance from '@/pages/EmergencyAssistance.jsx';
import ForDoctors from '@/pages/ForDoctors.jsx';
import ForPartners from '@/pages/ForPartners.jsx';
import Forum from '@/pages/Forum.jsx';
import ForumPost from '@/pages/ForumPost.jsx';
import HealthCoach from '@/pages/HealthCoach.jsx';
import HealthRecords from '@/pages/HealthRecords.jsx';
import Help from '@/pages/Help.jsx';
import Home from '@/pages/Home.jsx';
import HospitalDashboard from '@/pages/HospitalDashboard.jsx';
import HospitalDetails from '@/pages/HospitalDetails.jsx';
import HospitalRegistration from '@/pages/HospitalRegistration.jsx';
import LabPartnerDashboard from '@/pages/LabPartnerDashboard.jsx';
import LabPartnerOnboarding from '@/pages/LabPartnerOnboarding.jsx';
import LabTests from '@/pages/LabTests.jsx';
import MyAppointments from '@/pages/MyAppointments.jsx';
import MyLabTests from '@/pages/MyLabTests.jsx';
import NearbyHospitals from '@/pages/NearbyHospitals.jsx';
import MyOrders from '@/pages/MyOrders.jsx';
import OrderConfirmation from '@/pages/OrderConfirmation.jsx';
import Pharmacy from '@/pages/Pharmacy.jsx';
import Privacy from '@/pages/Privacy.jsx';
import Profile from '@/pages/Profile.jsx';
import Refund from '@/pages/Refund.jsx';
import RegisterChoice from '@/pages/RegisterChoice.jsx';
import SymptomChecker from '@/pages/SymptomChecker.jsx';
import Telemedicine from '@/pages/Telemedicine.jsx';
import Terms from '@/pages/Terms.jsx';
import VideoConsultation from '@/pages/VideoConsultation.jsx';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
      retry: 1,
      throwOnError: false,
    },
  },
});

// Router wrapper to get current page
function AppRoutes() {
  const location = useLocation();
  const [currentPageName, setCurrentPageName] = useState('Home');

  useEffect(() => {
    // Map routes to page names
    const pathToPageName = {
      '/': 'Home',
      '/home': 'Home',
      '/abdm': 'ABDM',
      '/about': 'About',
      '/admin-dashboard': 'AdminDashboard',
      '/article-read': 'ArticleRead',
      '/articles': 'Articles',
      '/book-appointment': 'BookAppointment',
      '/book-lab-test': 'BookLabTest',
      '/careers': 'Careers',
      '/checkout': 'Checkout',
      '/contact': 'Contact',
      '/create-post': 'CreatePost',
      '/doctor-appointments': 'DoctorAppointments',
      '/doctor-dashboard': 'DoctorDashboard',
      '/doctor-details': 'DoctorDetails',
      '/doctor-onboarding': 'DoctorOnboarding',
      '/doctors': 'Doctors',
      '/emergency-assistance': 'EmergencyAssistance',
      '/for-doctors': 'ForDoctors',
      '/for-partners': 'ForPartners',
      '/forum': 'Forum',
      '/forum-post': 'ForumPost',
      '/health-coach': 'HealthCoach',
      '/health-records': 'HealthRecords',
      '/help': 'Help',
      '/hospital-dashboard': 'HospitalDashboard',
      '/hospital-details': 'HospitalDetails',
      '/hospital-registration': 'HospitalRegistration',
      '/lab-partner-dashboard': 'LabPartnerDashboard',
      '/lab-partner-onboarding': 'LabPartnerOnboarding',
      '/lab-tests': 'LabTests',
      '/my-appointments': 'MyAppointments',
      '/my-labs': 'MyLabTests',
      '/my-nearby-hospitals': 'NearbyHospitals',
      '/my-orders': 'MyOrders',
      '/order-confirmation': 'OrderConfirmation',
      '/pharmacy': 'Pharmacy',
      '/privacy': 'Privacy',
      '/profile': 'Profile',
      '/refund': 'Refund',
      '/register-choice': 'RegisterChoice',
      '/symptom-checker': 'SymptomChecker',
      '/telemedicine': 'Telemedicine',
      '/terms': 'Terms',
      '/video-consultation': 'VideoConsultation',
    };

    // Get the page name from current path
    const pageName = pathToPageName[location.pathname] || 'Home';
    setCurrentPageName(pageName);
  }, [location.pathname]);

  return (
    <Layout currentPageName={currentPageName}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/abdm" element={<ABDM />} />
        <Route path="/about" element={<About />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/article-read" element={<ArticleRead />} />
        <Route path="/article-read/:id" element={<ArticleRead />} />
        <Route path="/articles" element={<Articles />} />
        <Route path="/book-appointment" element={<BookAppointment />} />
        <Route path="/book-lab-test" element={<BookLabTest />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/doctor-appointments" element={<DoctorAppointments />} />
        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
        <Route path="/doctor-details" element={<DoctorDetails />} />
        <Route path="/doctor-details/:id" element={<DoctorDetails />} />
        <Route path="/doctor-onboarding" element={<DoctorOnboarding />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/emergency-assistance" element={<EmergencyAssistance />} />
        <Route path="/for-doctors" element={<ForDoctors />} />
        <Route path="/for-partners" element={<ForPartners />} />
        <Route path="/forum" element={<Forum />} />
        <Route path="/forum-post" element={<ForumPost />} />
        <Route path="/forum-post/:id" element={<ForumPost />} />
        <Route path="/health-coach" element={<HealthCoach />} />
        <Route path="/health-records" element={<HealthRecords />} />
        <Route path="/help" element={<Help />} />
        <Route path="/hospital-dashboard" element={<HospitalDashboard />} />
        <Route path="/hospital-details" element={<HospitalDetails />} />
        <Route path="/hospital-details/:id" element={<HospitalDetails />} />
        <Route path="/hospital-registration" element={<HospitalRegistration />} />
        <Route path="/lab-partner-dashboard" element={<LabPartnerDashboard />} />
        <Route path="/lab-partner-onboarding" element={<LabPartnerOnboarding />} />
        <Route path="/lab-tests" element={<LabTests />} />
        <Route path="/my-appointments" element={<MyAppointments />} />
        <Route path="/my-labs" element={<MyLabTests />} />
        <Route path="/my-nearby-hospitals" element={<NearbyHospitals />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
        <Route path="/pharmacy" element={<Pharmacy />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/refund" element={<Refund />} />
        <Route path="/register-choice" element={<RegisterChoice />} />
        <Route path="/symptom-checker" element={<SymptomChecker />} />
        <Route path="/telemedicine" element={<Telemedicine />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/video-consultation" element={<VideoConsultation />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </Layout>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AppRoutes />
      </Router>
    </QueryClientProvider>
  );
}