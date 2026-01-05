import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  Heart, 
  Mail, 
  Phone, 
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube
} from 'lucide-react';

const footerLinks = {
  services: [
    { label: 'AI Symptom Checker', href: 'SymptomChecker' },
    { label: 'Find Doctors', href: 'Doctors' },
    { label: 'Pharmacy', href: 'Pharmacy' },
    { label: 'Lab Tests', href: 'LabTests' },
    { label: 'Health Records', href: 'HealthRecords' },
    { label: 'Health Coach', href: 'HealthCoach' },
  ],
  company: [
    { label: 'About Us', href: 'About' },
    { label: 'For Doctors', href: 'ForDoctors' },
    { label: 'For Partners', href: 'ForPartners' },
    { label: 'Careers', href: 'Careers' },
    { label: 'Contact Us', href: 'Contact' },
  ],
  legal: [
    { label: 'Privacy Policy', href: 'Privacy' },
    { label: 'Terms of Service', href: 'Terms' },
    { label: 'Refund Policy', href: 'Refund' },
    { label: 'ABDM Compliance', href: 'ABDM' },
  ],
};

const socialLinks = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Youtube, href: '#', label: 'YouTube' },
];

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-gray-300">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to={createPageUrl('Home')} className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">SwasthAI</span>
            </Link>
            <p className="text-gray-400 mb-6 max-w-sm">
              Your Personal Health Navigator. Intelligent healthcare connecting you to doctors, 
              labs, pharmacies, and health records — all in one place.
            </p>
            <div className="space-y-3">
              <a href="mailto:support@swasthai.com" className="flex items-center gap-3 text-gray-400 hover:text-teal-400 transition-colors">
                <Mail className="w-5 h-5" />
                support@swasthai.com
              </a>
              <a href="tel:+911800000000" className="flex items-center gap-3 text-gray-400 hover:text-teal-400 transition-colors">
                <Phone className="w-5 h-5" />
                1800-000-0000 (Toll Free)
              </a>
              <p className="flex items-center gap-3 text-gray-400">
                <MapPin className="w-5 h-5 flex-shrink-0" />
                Bengaluru, Karnataka, India
              </p>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-6">Services</h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link 
                    to={createPageUrl(link.href)}
                    className="text-gray-400 hover:text-teal-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-6">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link 
                    to={createPageUrl(link.href)}
                    className="text-gray-400 hover:text-teal-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-6">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link 
                    to={createPageUrl(link.href)}
                    className="text-gray-400 hover:text-teal-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} SwasthAI. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-gray-400 hover:bg-teal-500 hover:text-white transition-all"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-slate-950">
        <div className="container mx-auto px-4 py-4">
          <p className="text-xs text-gray-500 text-center">
            <strong>Medical Disclaimer:</strong> SwasthAI provides health information and AI-powered assessments 
            for informational purposes only. It is not a substitute for professional medical advice, diagnosis, 
            or treatment. Always seek the advice of your physician or other qualified health provider with any 
            questions you may have regarding a medical condition.
          </p>
        </div>
      </div>
    </footer>
  );
}