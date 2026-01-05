import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import {
  MapPin,
  Search,
  Filter,
  Map,
  List,
  Navigation,
  Heart,
  Star,
  Phone,
  Clock,
  AlertCircle
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PageTransition from '@/components/ui/PageTransition';
import { SkeletonList } from '@/components/ui/SkeletonLoader';
import { toast } from 'react-hot-toast';

const departments = [
  { value: 'cardiology', label: 'Cardiology', icon: '❤️' },
  { value: 'orthopedic', label: 'Orthopedic', icon: '🦴' },
  { value: 'pediatrics', label: 'Pediatrics', icon: '👶' },
  { value: 'gynecology', label: 'Gynecology', icon: '🤰' },
  { value: 'neurology', label: 'Neurology', icon: '🧠' },
  { value: 'emergency', label: 'Emergency', icon: '🚨' }
];

export default function NearbyHospitals() {
  const [userLocation, setUserLocation] = useState(null);
  const [search, setSearch] = useState('');
  const [radius, setRadius] = useState('5');
  const [filters, setFilters] = useState({
    type: 'all',
    departments: [],
    emergency: false,
    is_24x7: false,
    category: 'all'
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => {
          toast.error('Location access denied. Using default location.');
          setUserLocation({ lat: 28.6139, lng: 77.2090 }); // Delhi
        }
      );
    }
  }, []);

  const { data: hospitals = [], isLoading } = useQuery({
    queryKey: ['hospitals'],
    queryFn: () => base44.entities.Hospital.filter({ verified: true, is_active: true })
  });

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const filteredHospitals = useMemo(() => {
    return hospitals
      .map(hospital => ({
        ...hospital,
        distance: userLocation 
          ? calculateDistance(userLocation.lat, userLocation.lng, hospital.latitude, hospital.longitude)
          : 0
      }))
      .filter(hospital => {
        if (userLocation && hospital.distance > parseFloat(radius)) return false;
        if (search && !hospital.name?.toLowerCase().includes(search.toLowerCase())) return false;
        if (filters.type !== 'all' && hospital.type !== filters.type) return false;
        if (filters.emergency && !hospital.facilities?.emergency_ward) return false;
        if (filters.is_24x7 && !hospital.availability?.is_24x7) return false;
        if (filters.category !== 'all' && hospital.category !== filters.category) return false;
        if (filters.departments.length > 0) {
          const hasSomeDepts = filters.departments.some(dept => 
            hospital.departments?.includes(dept)
          );
          if (!hasSomeDepts) return false;
        }
        return true;
      })
      .sort((a, b) => a.distance - b.distance);
  }, [hospitals, userLocation, radius, search, filters]);

  const HospitalCard = ({ hospital }) => (
    <Link to={createPageUrl(`HospitalDetails?id=${hospital.id}`)}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-lg transition-all cursor-pointer"
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 mb-1">{hospital.name}</h3>
            <p className="text-sm text-gray-500 capitalize">{hospital.type?.replace(/_/g, ' ')}</p>
          </div>
          <Badge variant={hospital.availability?.is_24x7 ? 'default' : 'secondary'} className="bg-green-100 text-green-700">
            {hospital.availability?.is_24x7 ? '24×7' : 'Limited Hours'}
          </Badge>
        </div>

        <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4 text-teal-500" />
            {hospital.distance?.toFixed(1)} km
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            {hospital.rating?.toFixed(1) || 'New'}
          </div>
          {hospital.facilities?.emergency_ward && (
            <Badge className="bg-red-100 text-red-700 text-xs">
              <AlertCircle className="w-3 h-3 mr-1" />
              Emergency
            </Badge>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          {hospital.departments?.slice(0, 3).map((dept, idx) => (
            <Badge key={idx} variant="secondary" className="text-xs capitalize">
              {dept.replace(/_/g, ' ')}
            </Badge>
          ))}
          {hospital.departments?.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{hospital.departments.length - 3} more
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Button size="sm" variant="outline" className="flex-1" onClick={(e) => {
            e.preventDefault();
            window.open(`tel:${hospital.contact?.phone}`);
          }}>
            <Phone className="w-4 h-4 mr-2" />
            Call
          </Button>
          <Button size="sm" className="flex-1 bg-teal-500 hover:bg-teal-600">
            View Details
          </Button>
        </div>
      </motion.div>
    </Link>
  );

  return (
    <PageTransition className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Nearby Hospitals & Clinics</h1>
            <p className="text-gray-500 mt-1">Find healthcare facilities near you</p>
          </div>
          <Button onClick={() => {
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition((position) => {
                setUserLocation({
                  lat: position.coords.latitude,
                  lng: position.coords.longitude
                });
                toast.success('Location updated');
              });
            }
          }}>
            <Navigation className="w-4 h-4 mr-2" />
            Update Location
          </Button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search hospitals..."
                className="pl-10"
              />
            </div>
            <Select value={radius} onValueChange={setRadius}>
              <SelectTrigger className="w-full md:w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">Within 2km</SelectItem>
                <SelectItem value="5">Within 5km</SelectItem>
                <SelectItem value="10">Within 10km</SelectItem>
                <SelectItem value="20">Within 20km</SelectItem>
              </SelectContent>
            </Select>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filter Hospitals</SheetTitle>
                </SheetHeader>
                <div className="space-y-6 mt-6">
                  <div>
                    <Label className="mb-3 block">Type</Label>
                    <Select value={filters.type} onValueChange={(value) => setFilters(f => ({...f, type: value}))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="hospital">Hospital</SelectItem>
                        <SelectItem value="clinic">Clinic</SelectItem>
                        <SelectItem value="nursing_home">Nursing Home</SelectItem>
                        <SelectItem value="specialty_center">Specialty Center</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="mb-3 block">Category</Label>
                    <Select value={filters.category} onValueChange={(value) => setFilters(f => ({...f, category: value}))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="government">Government</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Checkbox 
                        checked={filters.emergency}
                        onCheckedChange={(checked) => setFilters(f => ({...f, emergency: checked}))}
                      />
                      <Label>Emergency Services</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox 
                        checked={filters.is_24x7}
                        onCheckedChange={(checked) => setFilters(f => ({...f, is_24x7: checked}))}
                      />
                      <Label>24×7 Available</Label>
                    </div>
                  </div>

                  <div>
                    <Label className="mb-3 block">Departments</Label>
                    <div className="space-y-2">
                      {departments.map((dept) => (
                        <div key={dept.value} className="flex items-center gap-2">
                          <Checkbox 
                            checked={filters.departments.includes(dept.value)}
                            onCheckedChange={(checked) => {
                              setFilters(f => ({
                                ...f,
                                departments: checked 
                                  ? [...f.departments, dept.value]
                                  : f.departments.filter(d => d !== dept.value)
                              }));
                            }}
                          />
                          <Label>{dept.icon} {dept.label}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {isLoading ? (
          <SkeletonList count={6} />
        ) : filteredHospitals.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl">
            <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No hospitals found</h3>
            <p className="text-gray-500">Try adjusting your filters or search radius</p>
          </div>
        ) : (
          <div>
            <p className="text-sm text-gray-600 mb-4">
              Found {filteredHospitals.length} hospitals within {radius}km
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {filteredHospitals.map((hospital) => (
                <HospitalCard key={hospital.id} hospital={hospital} />
              ))}
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
}