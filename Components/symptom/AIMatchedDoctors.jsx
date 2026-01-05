import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  Sparkles, Star, Calendar, Video, Building2, 
  TrendingUp, Shield, CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export default function AIMatchedDoctors({ doctors, symptoms, matchScore }) {
  if (!doctors || doctors.length === 0) return null;

  return (
    <div className="space-y-4">
      {/* AI Match Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-100"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-purple-900">AI-Matched Doctors</h3>
            <p className="text-sm text-purple-700">
              Based on your symptoms, we recommend these specialists
            </p>
          </div>
        </div>
      </motion.div>

      {/* Doctor Cards */}
      <div className="space-y-3">
        {doctors.map((doctor, index) => (
          <motion.div
            key={doctor.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="overflow-hidden hover:shadow-lg transition-all border-2 border-transparent hover:border-teal-100">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Doctor Avatar */}
                  <div className="relative">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-teal-100 to-emerald-100 flex items-center justify-center flex-shrink-0">
                      {doctor.profile_image ? (
                        <img 
                          src={doctor.profile_image} 
                          alt={doctor.name}
                          className="w-full h-full object-cover rounded-xl"
                        />
                      ) : (
                        <span className="text-2xl font-bold text-teal-600">
                          {doctor.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    {doctor.ai_match_score >= 90 && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                        <Sparkles className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Doctor Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">Dr. {doctor.name}</h4>
                        <p className="text-sm text-gray-500 capitalize">
                          {doctor.specialization?.replace(/_/g, ' ')}
                        </p>
                      </div>
                      <Badge className="bg-purple-100 text-purple-700">
                        {doctor.ai_match_score}% Match
                      </Badge>
                    </div>

                    {/* Match Reasons */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {doctor.match_reasons?.map((reason, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          {reason}
                        </Badge>
                      ))}
                    </div>

                    {/* Stats */}
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-3">
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4 text-teal-500" />
                        {doctor.experience_years} yrs
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                        {doctor.rating?.toFixed(1)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Building2 className="w-4 h-4 text-gray-400" />
                        {doctor.hospital_name}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Link 
                        to={createPageUrl(`DoctorDetails?id=${doctor.id}`)}
                        className="flex-1"
                      >
                        <Button variant="outline" size="sm" className="w-full">
                          View Profile
                        </Button>
                      </Link>
                      <Link 
                        to={createPageUrl(`BookAppointment?doctorId=${doctor.id}`)}
                        className="flex-1"
                      >
                        <Button size="sm" className="w-full bg-teal-500 hover:bg-teal-600">
                          <Video className="w-4 h-4 mr-2" />
                          Book Now
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Trust Badge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center py-4"
      >
        <div className="inline-flex items-center gap-2 text-sm text-gray-500">
          <Shield className="w-4 h-4 text-teal-500" />
          <span>AI recommendations based on symptoms, expertise & availability</span>
        </div>
      </motion.div>
    </div>
  );
}