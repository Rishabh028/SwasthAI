import React from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  SlidersHorizontal, 
  X,
  Video,
  Building2,
  Star
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

const specializations = [
  { value: 'all', label: 'All Specializations' },
  { value: 'general_physician', label: 'General Physician' },
  { value: 'cardiologist', label: 'Cardiologist' },
  { value: 'dermatologist', label: 'Dermatologist' },
  { value: 'orthopedic', label: 'Orthopedic' },
  { value: 'pediatrician', label: 'Pediatrician' },
  { value: 'gynecologist', label: 'Gynecologist' },
  { value: 'neurologist', label: 'Neurologist' },
  { value: 'psychiatrist', label: 'Psychiatrist' },
  { value: 'ent', label: 'ENT Specialist' },
  { value: 'ophthalmologist', label: 'Ophthalmologist' },
  { value: 'dentist', label: 'Dentist' },
  { value: 'ayurveda', label: 'Ayurveda' },
  { value: 'homeopathy', label: 'Homeopathy' },
];

const languages = [
  'English',
  'Hindi',
  'Bengali',
  'Telugu',
  'Marathi',
  'Tamil',
  'Gujarati',
  'Urdu',
  'Kannada',
  'Malayalam',
  'Punjabi'
];

export default function DoctorFilters({ filters, setFilters, resultCount }) {
  const activeFilterCount = Object.entries(filters).filter(([key, value]) => {
    if (key === 'search' && value) return true;
    if (key === 'specialization' && value !== 'all') return true;
    if (key === 'consultationType' && value !== 'all') return true;
    if (key === 'priceRange' && (value[0] > 0 || value[1] < 5000)) return true;
    if (key === 'minRating' && value > 0) return true;
    if (key === 'languages' && value?.length > 0) return true;
    return false;
  }).length;

  const clearFilters = () => {
    setFilters({
      search: '',
      specialization: 'all',
      consultationType: 'all',
      priceRange: [0, 5000],
      minRating: 0,
      languages: [],
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search doctors, hospitals..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="pl-10 h-12 rounded-xl border-gray-200"
          />
        </div>

        {/* Specialization */}
        <Select
          value={filters.specialization}
          onValueChange={(value) => setFilters(prev => ({ ...prev, specialization: value }))}
        >
          <SelectTrigger className="w-full lg:w-52 h-12 rounded-xl">
            <SelectValue placeholder="Specialization" />
          </SelectTrigger>
          <SelectContent>
            {specializations.map((spec) => (
              <SelectItem key={spec.value} value={spec.value}>
                {spec.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Consultation Type */}
        <Select
          value={filters.consultationType}
          onValueChange={(value) => setFilters(prev => ({ ...prev, consultationType: value }))}
        >
          <SelectTrigger className="w-full lg:w-44 h-12 rounded-xl">
            <SelectValue placeholder="Consult Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="video">
              <span className="flex items-center gap-2">
                <Video className="w-4 h-4" /> Video
              </span>
            </SelectItem>
            <SelectItem value="clinic">
              <span className="flex items-center gap-2">
                <Building2 className="w-4 h-4" /> Clinic
              </span>
            </SelectItem>
          </SelectContent>
        </Select>

        {/* More Filters */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="h-12 rounded-xl relative">
              <SlidersHorizontal className="w-5 h-5 mr-2" />
              Filters
              {activeFilterCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-teal-500 text-white text-xs rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:w-96">
            <SheetHeader>
              <SheetTitle>Filter Doctors</SheetTitle>
            </SheetHeader>
            
            <div className="mt-6 space-y-6">
              {/* Price Range */}
              <div>
                <Label className="text-sm font-medium mb-4 block">
                  Consultation Fee: ₹{filters.priceRange[0]} - ₹{filters.priceRange[1]}
                </Label>
                <Slider
                  value={filters.priceRange}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, priceRange: value }))}
                  min={0}
                  max={5000}
                  step={100}
                  className="mt-2"
                />
              </div>

              {/* Min Rating */}
              <div>
                <Label className="text-sm font-medium mb-4 block">
                  Minimum Rating
                </Label>
                <div className="flex gap-2">
                  {[0, 3, 3.5, 4, 4.5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setFilters(prev => ({ ...prev, minRating: rating }))}
                      className={`flex items-center gap-1 px-3 py-2 rounded-lg border transition-colors ${
                        filters.minRating === rating 
                          ? 'border-teal-500 bg-teal-50 text-teal-700' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {rating > 0 && <Star className="w-4 h-4 fill-amber-400 text-amber-400" />}
                      <span className="text-sm font-medium">
                        {rating === 0 ? 'Any' : `${rating}+`}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Languages */}
              <div>
                <Label className="text-sm font-medium mb-4 block">
                  Languages Spoken
                </Label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {languages.map((language) => (
                    <div key={language} className="flex items-center gap-2">
                      <Checkbox 
                        id={`lang-${language}`}
                        checked={filters.languages?.includes(language)}
                        onCheckedChange={(checked) => {
                          setFilters(prev => ({
                            ...prev,
                            languages: checked 
                              ? [...(prev.languages || []), language]
                              : (prev.languages || []).filter(l => l !== language)
                          }));
                        }}
                      />
                      <Label htmlFor={`lang-${language}`} className="cursor-pointer">
                        {language}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              <Button 
                variant="outline" 
                className="w-full"
                onClick={clearFilters}
              >
                <X className="w-4 h-4 mr-2" />
                Clear All Filters
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Active Filters & Results */}
      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing <span className="font-semibold text-gray-900">{resultCount}</span> doctors
        </p>
        
        {activeFilterCount > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Active filters:</span>
            {filters.specialization !== 'all' && (
              <Badge variant="secondary" className="bg-teal-50 text-teal-700">
                {filters.specialization.replace(/_/g, ' ')}
                <button 
                  onClick={() => setFilters(prev => ({ ...prev, specialization: 'all' }))}
                  className="ml-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {filters.minRating > 0 && (
              <Badge variant="secondary" className="bg-amber-50 text-amber-700">
                {filters.minRating}+ Stars
                <button 
                  onClick={() => setFilters(prev => ({ ...prev, minRating: 0 }))}
                  className="ml-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {filters.languages?.length > 0 && filters.languages.map((lang) => (
              <Badge key={lang} variant="secondary" className="bg-blue-50 text-blue-700">
                {lang}
                <button 
                  onClick={() => setFilters(prev => ({
                    ...prev,
                    languages: prev.languages.filter(l => l !== lang)
                  }))}
                  className="ml-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}