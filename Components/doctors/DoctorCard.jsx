import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  Star, 
  MapPin, 
  Video, 
  Building2,
  Clock,
  Languages,
  BadgeCheck,
  Calendar
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const specializationColors = {
  general_physician: 'bg-blue-100 text-blue-700',
  cardiologist: 'bg-rose-100 text-rose-700',
  dermatologist: 'bg-purple-100 text-purple-700',
  orthopedic: 'bg-amber-100 text-amber-700',
  pediatrician: 'bg-pink-100 text-pink-700',
  gynecologist: 'bg-fuchsia-100 text-fuchsia-700',
  neurologist: 'bg-indigo-100 text-indigo-700',
  psychiatrist: 'bg-teal-100 text-teal-700',
  ent: 'bg-emerald-100 text-emerald-700',
  ophthalmologist: 'bg-cyan-100 text-cyan-700',
  dentist: 'bg-sky-100 text-sky-700',
  ayurveda: 'bg-green-100 text-green-700',
  homeopathy: 'bg-lime-100 text-lime-700',
};

export default function DoctorCard({ doctor, index = 0 }) {
  const specColor = specializationColors[doctor.specialization] || 'bg-gray-100 text-gray-700';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      <div className="p-6">
        <div className="flex gap-4">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            {doctor.profile_image ? (
              <img 
                src={doctor.profile_image} 
                alt={doctor.name}
                className="w-20 h-20 rounded-2xl object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-100 to-emerald-100 flex items-center justify-center">
                <span className="text-2xl font-bold text-teal-600">
                  {doctor.name?.charAt(0)}
                </span>
              </div>
            )}
            {doctor.verified && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center">
                <BadgeCheck className="w-4 h-4 text-white" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-gray-900 truncate">
                  Dr. {doctor.name}
                </h3>
                <p className="text-sm text-gray-500">{doctor.qualification}</p>
              </div>
              <Badge className={`${specColor} text-xs font-medium`}>
                {doctor.specialization?.replace(/_/g, ' ')}
              </Badge>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {doctor.experience_years} yrs
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                {doctor.rating?.toFixed(1) || 'New'}
              </span>
              {doctor.total_reviews > 0 && (
                <span className="text-gray-400">
                  ({doctor.total_reviews} reviews)
                </span>
              )}
            </div>

            <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
              <Building2 className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{doctor.hospital_name}</span>
            </div>

            {doctor.location && (
              <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span>{doctor.location}</span>
              </div>
            )}
          </div>
        </div>

        {/* Tags */}
        <div className="mt-4 flex flex-wrap gap-2">
          {doctor.is_video_consultation && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
              <Video className="w-3 h-3" />
              Video Consult
            </span>
          )}
          {doctor.is_clinic_visit && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium">
              <Building2 className="w-3 h-3" />
              Clinic Visit
            </span>
          )}
          {doctor.languages?.length > 0 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
              <Languages className="w-3 h-3" />
              {doctor.languages.slice(0, 2).join(', ')}
            </span>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500">Consultation Fee</p>
          <p className="text-xl font-bold text-gray-900">₹{doctor.consultation_fee}</p>
        </div>
        <div className="flex gap-2">
          <Link to={createPageUrl(`DoctorDetails?id=${doctor.id}`)} className="flex-1">
            <Button variant="outline" className="w-full">
              View Profile
            </Button>
          </Link>
          <Link to={createPageUrl(`BookAppointment?doctorId=${doctor.id}`)}>
            <Button className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600">
              <Calendar className="w-4 h-4 mr-2" />
              Book
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}