import React from 'react';
import Navbar from '@/Components/layout/Navbar';
import Footer from '@/Components/layout/Footer';
import { Toaster } from 'react-hot-toast';

export default function Layout({ children, currentPageName }) {
  // Pages that should have a transparent navbar (hero pages)
  const heroPages = ['Home'];
  const isHeroPage = heroPages.includes(currentPageName);

  // Pages without footer
  const noFooterPages = ['SymptomChecker', 'HealthCoach', 'VideoConsultation'];
  const showFooter = !noFooterPages.includes(currentPageName);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        :root {
          --color-teal-50: #f0fdfa;
          --color-teal-100: #ccfbf1;
          --color-teal-200: #99f6e4;
          --color-teal-300: #5eead4;
          --color-teal-400: #2dd4bf;
          --color-teal-500: #14b8a6;
          --color-teal-600: #0d9488;
          --color-emerald-500: #10b981;
          --color-emerald-600: #059669;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      
      <Toaster 
        position="top-right"
        toastOptions={{
          className: 'rounded-lg',
          duration: 4000,
        }}
      />
      
      <Navbar />
      
      <main className={`flex-1 ${!isHeroPage ? 'pt-20' : ''}`}>
        {children}
      </main>
      
      {showFooter && <Footer />}
    </div>
  );
}