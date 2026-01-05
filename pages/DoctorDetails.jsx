import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Star,
  MapPin,
  Building2,
  Clock,
  Video,
  Calendar,
  Languages,
  BadgeCheck,
  ThumbsUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PageTransition from '@/components/ui/PageTransition';
import { SkeletonCard } from '@/components/ui/SkeletonLoader';

export default function DoctorDetails() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const doctorId = urlParams.get('id');

  const { data: doctor, isLoading } = useQuery({
    queryKey: ['doctor', doctorId],
    queryFn: async () => {
      const doctors = await base44.entities.Doctor.filter({ id: doctorId });
      return doctors[0];
    },
    enabled: !!doctorId
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ['doctorReviews', doctorId],
    queryFn: () => base44.entities.DoctorReview.filter({ doctor_id: doctorId }),
    enabled: !!doctorId
  });

  if (isLoading) {
    return (
      <PageTransition className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-5xl">
          <SkeletonCard />
        </div>
      </PageTransition>
    );
  }

  if (!doctor) {
    return (
      <PageTransition className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center py-16">
          <h2 className="text-2xl font-bold mb-4">Doctor not found</h2>
          <Button onClick={() => navigate(createPageUrl('Doctors'))}>
            Browse Doctors
          </Button>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-6">
                  {doctor.profile_image ? (
                    <img 
                      src={doctor.profile_image} 
                      alt={doctor.name}
                      className="w-24 h-24 rounded-2xl object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-teal-100 to-emerald-100 flex items-center justify-center">
                      <span className="text-3xl font-bold text-teal-600">
                        {doctor.name?.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-1">
                          Dr. {doctor.name}
                          {doctor.verified && (
                            <BadgeCheck className="w-6 h-6 text-teal-500 inline ml-2" />
                          )}
                        </h1>
                        <p className="text-gray-600 capitalize">{doctor.specialization?.replace(/_/g, ' ')}</p>
                        <p className="text-sm text-gray-500">{doctor.qualification}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 mt-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                        <span className="font-semibold">{doctor.rating?.toFixed(1) || 'New'}</span>
                        <span className="text-gray-500 text-sm">({doctor.total_reviews || 0} reviews)</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">{doctor.experience_years} years exp</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* About */}
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  {doctor.bio || 'Experienced medical professional dedicated to providing quality healthcare.'}
                </p>
              </CardContent>
            </Card>

            {/* Location Map */}
            {doctor.latitude && doctor.longitude && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-teal-500" />
                    Location
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="font-medium text-gray-900">{doctor.hospital_name}</p>
                      <p className="text-sm text-gray-600">{doctor.location}</p>
                    </div>
                    <div className="h-64 rounded-xl overflow-hidden bg-gray-100">
                      <iframe
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        src={`https://www.openstreetmap.org/export/embed.html?bbox=${doctor.longitude-0.01},${doctor.latitude-0.01},${doctor.longitude+0.01},${doctor.latitude+0.01}&layer=mapnik&marker=${doctor.latitude},${doctor.longitude}`}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Reviews */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-500" />
                  Patient Reviews
                </CardTitle>
              </CardHeader>
              <CardContent>
                {reviews.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No reviews yet</p>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium text-gray-900">{review.patient_name}</p>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: review.rating }).map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{review.review}</p>
                        {review.would_recommend && (
                          <div className="flex items-center gap-1 mt-2 text-xs text-green-600">
                            <ThumbsUp className="w-3 h-3" />
                            Would recommend
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6 space-y-6">
                {/* Pricing */}
                <div>
                  <p className="text-sm text-gray-500 mb-1">Consultation Fee</p>
                  <p className="text-3xl font-bold text-teal-600">₹{doctor.consultation_fee}</p>
                </div>

                {/* Consultation Types */}
                <div>
                  <p className="text-sm text-gray-500 mb-3">Available For</p>
                  <div className="flex flex-col gap-2">
                    {doctor.is_video_consultation && (
                      <div className="flex items-center gap-2 text-sm">
                        <Video className="w-4 h-4 text-blue-500" />
                        <span>Video Consultation</span>
                      </div>
                    )}
                    {doctor.is_clinic_visit && (
                      <div className="flex items-center gap-2 text-sm">
                        <Building2 className="w-4 h-4 text-emerald-500" />
                        <span>Clinic Visit</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Languages */}
                {doctor.languages?.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-500 mb-3">Languages</p>
                    <div className="flex flex-wrap gap-2">
                      {doctor.languages.map((lang, idx) => (
                        <Badge key={idx} variant="secondary">
                          {lang}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Book Button */}
                <Button 
                  onClick={() => navigate(createPageUrl(`BookAppointment?doctorId=${doctor.id}`))}
                  className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Appointment
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}