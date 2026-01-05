import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Clock,
  Star,
  AlertCircle,
  CheckCircle,
  Building2,
  Users,
  Stethoscope,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PageTransition from '@/components/ui/PageTransition';

export default function HospitalDetails() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const hospitalId = urlParams.get('id');

  const { data: hospital } = useQuery({
    queryKey: ['hospital', hospitalId],
    queryFn: async () => {
      const hospitals = await base44.entities.Hospital.filter({ id: hospitalId });
      return hospitals[0];
    },
    enabled: !!hospitalId
  });

  if (!hospital) {
    return (
      <PageTransition className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Hospital not found</h2>
          <Button onClick={() => navigate(createPageUrl('NearbyHospitals'))}>
            Browse Hospitals
          </Button>
        </div>
      </PageTransition>
    );
  }

  const facilities = [
    { key: 'emergency_ward', label: 'Emergency Ward', icon: AlertCircle },
    { key: 'icu', label: 'ICU', icon: Building2 },
    { key: 'ambulance', label: 'Ambulance', icon: AlertCircle },
    { key: 'operation_theatre', label: 'OT', icon: Building2 },
    { key: 'diagnostic_lab', label: 'Diagnostic Lab', icon: CheckCircle },
    { key: 'pharmacy', label: 'Pharmacy', icon: CheckCircle },
    { key: 'blood_bank', label: 'Blood Bank', icon: CheckCircle }
  ];

  return (
    <PageTransition className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{hospital.name}</h1>
                    <p className="text-gray-600 capitalize">{hospital.type?.replace(/_/g, ' ')}</p>
                  </div>
                  <div className="flex gap-2">
                    {hospital.availability?.is_24x7 && (
                      <Badge className="bg-green-100 text-green-700">24×7</Badge>
                    )}
                    {hospital.facilities?.emergency_ward && (
                      <Badge className="bg-red-100 text-red-700">Emergency</Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                    <span className="font-semibold">{hospital.rating?.toFixed(1) || 'New'}</span>
                    <span className="text-gray-500 text-sm">({hospital.total_reviews || 0} reviews)</span>
                  </div>
                  <Badge variant="secondary" className="capitalize">
                    {hospital.category}
                  </Badge>
                </div>

                {hospital.description && (
                  <p className="text-gray-600 leading-relaxed">{hospital.description}</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-sm text-gray-600">
                      {hospital.address?.street}, {hospital.address?.area}<br />
                      {hospital.address?.city}, {hospital.address?.state} {hospital.address?.pincode}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-sm text-gray-600">{hospital.contact?.phone}</p>
                  </div>
                </div>
                {hospital.contact?.emergency_phone && (
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <div>
                      <p className="font-medium text-red-600">Emergency Hotline</p>
                      <p className="text-sm text-gray-600">{hospital.contact.emergency_phone}</p>
                    </div>
                  </div>
                )}
                {hospital.contact?.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-sm text-gray-600">{hospital.contact.email}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Departments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {hospital.departments?.map((dept, idx) => (
                    <Badge key={idx} variant="secondary" className="capitalize">
                      {dept.replace(/_/g, ' ')}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Facilities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {facilities.map(({ key, label, icon: Icon }) => (
                    <div 
                      key={key}
                      className={`flex items-center gap-2 ${
                        hospital.facilities?.[key] ? 'text-green-600' : 'text-gray-300'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-sm">{label}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {hospital.latitude && hospital.longitude && (
              <Card>
                <CardHeader>
                  <CardTitle>Location</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 rounded-xl overflow-hidden bg-gray-100">
                    <iframe
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      src={`https://www.openstreetmap.org/export/embed.html?bbox=${hospital.longitude-0.01},${hospital.latitude-0.01},${hospital.longitude+0.01},${hospital.latitude+0.01}&layer=mapnik&marker=${hospital.latitude},${hospital.longitude}`}
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6 space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Visiting Hours</p>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <p className="font-medium">{hospital.availability?.visiting_hours || 'Contact for details'}</p>
                  </div>
                </div>

                {hospital.availability?.emergency_hours && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Emergency Hours</p>
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-500" />
                      <p className="font-medium text-red-600">{hospital.availability.emergency_hours}</p>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t space-y-2">
                  {hospital.insurance_supported && (
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      Insurance Supported
                    </div>
                  )}
                  {hospital.cashless_available && (
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      Cashless Available
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t space-y-3">
                  <a href={`tel:${hospital.contact?.phone}`}>
                    <Button className="w-full" variant="outline">
                      <Phone className="w-4 h-4 mr-2" />
                      Call Hospital
                    </Button>
                  </a>
                  <Button className="w-full bg-teal-500 hover:bg-teal-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Appointment
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}