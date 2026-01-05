import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import PageTransition from '@/components/ui/PageTransition';
import { SkeletonList } from '@/components/ui/SkeletonLoader';
import DoctorCard from '@/components/doctors/DoctorCard';
import DoctorFilters from '@/components/doctors/DoctorFilters';
import { motion } from 'framer-motion';
import { Stethoscope, Search } from 'lucide-react';

export default function Doctors() {
  const [filters, setFilters] = useState({
    search: '',
    specialization: 'all',
    consultationType: 'all',
    priceRange: [0, 5000],
    minRating: 0,
    languages: [],
  });

  const { data: doctors = [], isLoading } = useQuery({
    queryKey: ['doctors'],
    queryFn: () => base44.entities.Doctor.filter({ verified: true }, '-rating', 100),
  });

  const filteredDoctors = useMemo(() => {
    return doctors.filter(doctor => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = 
          doctor.name?.toLowerCase().includes(searchLower) ||
          doctor.hospital_name?.toLowerCase().includes(searchLower) ||
          doctor.specialization?.toLowerCase().includes(searchLower) ||
          doctor.location?.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Specialization filter
      if (filters.specialization !== 'all' && doctor.specialization !== filters.specialization) {
        return false;
      }

      // Consultation type filter
      if (filters.consultationType === 'video' && !doctor.is_video_consultation) {
        return false;
      }
      if (filters.consultationType === 'clinic' && !doctor.is_clinic_visit) {
        return false;
      }

      // Price range filter
      if (doctor.consultation_fee < filters.priceRange[0] || doctor.consultation_fee > filters.priceRange[1]) {
        return false;
      }

      // Rating filter
      if (filters.minRating > 0 && (doctor.rating || 0) < filters.minRating) {
        return false;
      }

      // Language filter
      if (filters.languages?.length > 0) {
        const doctorLanguages = doctor.languages || [];
        const hasAnyLanguage = filters.languages.some(lang => 
          doctorLanguages.some(docLang => 
            docLang.toLowerCase().includes(lang.toLowerCase())
          )
        );
        if (!hasAnyLanguage) return false;
      }

      return true;
    });
  }, [doctors, filters]);

  return (
    <PageTransition className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-600 to-emerald-600 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-6">
              <Stethoscope className="w-8 h-8" />
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Find & Book Doctors
            </h1>
            <p className="text-teal-100 text-lg max-w-2xl mx-auto">
              Connect with 500+ verified specialists across 30+ medical fields. 
              Book video consultations or clinic visits instantly.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters & Results */}
      <section className="container mx-auto px-4 -mt-8 relative z-10 pb-16">
        <DoctorFilters 
          filters={filters} 
          setFilters={setFilters} 
          resultCount={filteredDoctors.length}
        />

        {isLoading ? (
          <SkeletonList count={6} />
        ) : filteredDoctors.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No doctors found
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Try adjusting your search criteria or filters to find more doctors.
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredDoctors.map((doctor, index) => (
              <DoctorCard key={doctor.id} doctor={doctor} index={index} />
            ))}
          </div>
        )}
      </section>
    </PageTransition>
  );
}