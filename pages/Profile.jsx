import React, { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  Calendar,
  Droplet,
  Weight,
  Ruler,
  AlertCircle,
  Pill,
  Heart,
  Shield,
  MapPin,
  Plus,
  Save,
  Loader2,
  Link as LinkIcon
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import PageTransition from '@/components/ui/PageTransition';
import { toast } from 'react-hot-toast';

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    phone: '',
    date_of_birth: '',
    gender: '',
    blood_group: '',
    height_cm: '',
    weight_kg: '',
    allergies: [],
    chronic_conditions: [],
    current_medications: [],
    emergency_contact: { name: '', phone: '', relation: '' },
    abha_id: '',
    abha_linked: false,
    profile_image: ''
  });
  const [newAllergy, setNewAllergy] = useState('');
  const [newCondition, setNewCondition] = useState('');
  const [newMedication, setNewMedication] = useState('');

  useEffect(() => {
    const loadUser = async () => {
      try {
        const isAuth = await base44.auth.isAuthenticated();
        if (isAuth) {
          const userData = await base44.auth.me();
          setUser(userData);
          
          // Load profile data
          const profiles = await base44.entities.UserProfile.filter({ created_by: userData.email });
          if (profiles.length > 0) {
            setProfile(prev => ({ ...prev, ...profiles[0] }));
          }
        } else {
          base44.auth.redirectToLogin();
        }
      } catch (e) {
        base44.auth.redirectToLogin();
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const saveProfile = useMutation({
    mutationFn: async (data) => {
      const profiles = await base44.entities.UserProfile.filter({ created_by: user.email });
      if (profiles.length > 0) {
        return base44.entities.UserProfile.update(profiles[0].id, data);
      } else {
        return base44.entities.UserProfile.create(data);
      }
    },
    onSuccess: () => {
      toast.success('Profile updated successfully!');
    },
    onError: () => {
      toast.error('Failed to update profile');
    }
  });

  const handleSave = () => {
    saveProfile.mutate(profile);
  };

  const addItem = (type) => {
    if (type === 'allergy' && newAllergy) {
      setProfile(prev => ({
        ...prev,
        allergies: [...(prev.allergies || []), newAllergy]
      }));
      setNewAllergy('');
    } else if (type === 'condition' && newCondition) {
      setProfile(prev => ({
        ...prev,
        chronic_conditions: [...(prev.chronic_conditions || []), newCondition]
      }));
      setNewCondition('');
    } else if (type === 'medication' && newMedication) {
      setProfile(prev => ({
        ...prev,
        current_medications: [...(prev.current_medications || []), newMedication]
      }));
      setNewMedication('');
    }
  };

  const removeItem = (type, index) => {
    if (type === 'allergy') {
      setProfile(prev => ({
        ...prev,
        allergies: prev.allergies.filter((_, i) => i !== index)
      }));
    } else if (type === 'condition') {
      setProfile(prev => ({
        ...prev,
        chronic_conditions: prev.chronic_conditions.filter((_, i) => i !== index)
      }));
    } else if (type === 'medication') {
      setProfile(prev => ({
        ...prev,
        current_medications: prev.current_medications.filter((_, i) => i !== index)
      }));
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
      </div>
    );
  }

  return (
    <PageTransition className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-teal-500 to-emerald-500 rounded-3xl p-6 md:p-8 text-white mb-6"
        >
          <div className="flex items-center gap-6">
            <div className="relative group">
              {profile.profile_image ? (
                <img 
                  src={profile.profile_image} 
                  alt="Profile" 
                  className="w-20 h-20 rounded-2xl object-cover"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center">
                  <span className="text-3xl font-bold">
                    {user.full_name?.charAt(0) || user.email?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
              )}
              <input
                type="file"
                id="profile-pic"
                className="hidden"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files[0];
                  if (file) {
                    try {
                      const { file_url } = await base44.integrations.Core.UploadFile({ file });
                      setProfile(prev => ({ ...prev, profile_image: file_url }));
                      toast.success('Profile picture updated');
                    } catch (error) {
                      toast.error('Failed to upload image');
                    }
                  }
                }}
              />
              <label 
                htmlFor="profile-pic"
                className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <span className="text-white text-xs">Change</span>
              </label>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{user.full_name || 'User'}</h1>
              <p className="text-teal-100 flex items-center gap-2 mt-1">
                <Mail className="w-4 h-4" />
                {user.email}
              </p>
              {profile.abha_linked && (
                <Badge className="mt-2 bg-white/20 text-white">
                  <Shield className="w-3 h-3 mr-1" />
                  ABHA Linked
                </Badge>
              )}
            </div>
          </div>
        </motion.div>

        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="medical">Medical History</TabsTrigger>
            <TabsTrigger value="abha">ABHA</TabsTrigger>
          </TabsList>

          {/* Personal Info */}
          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Personal Information
                </CardTitle>
                <CardDescription>Update your personal and contact details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={profile.phone || ''}
                      onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+91 XXXXX XXXXX"
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input
                      id="dob"
                      type="date"
                      value={profile.date_of_birth || ''}
                      onChange={(e) => setProfile(prev => ({ ...prev, date_of_birth: e.target.value }))}
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label>Gender</Label>
                    <Select 
                      value={profile.gender || ''} 
                      onValueChange={(value) => setProfile(prev => ({ ...prev, gender: value }))}
                    >
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Blood Group</Label>
                    <Select 
                      value={profile.blood_group || ''} 
                      onValueChange={(value) => setProfile(prev => ({ ...prev, blood_group: value }))}
                    >
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="Select blood group" />
                      </SelectTrigger>
                      <SelectContent>
                        {bloodGroups.map((bg) => (
                          <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      value={profile.height_cm || ''}
                      onChange={(e) => setProfile(prev => ({ ...prev, height_cm: parseFloat(e.target.value) }))}
                      placeholder="170"
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      value={profile.weight_kg || ''}
                      onChange={(e) => setProfile(prev => ({ ...prev, weight_kg: parseFloat(e.target.value) }))}
                      placeholder="70"
                      className="mt-1.5"
                    />
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="border-t pt-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Phone className="w-5 h-5 text-red-500" />
                    Emergency Contact
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Name</Label>
                      <Input
                        value={profile.emergency_contact?.name || ''}
                        onChange={(e) => setProfile(prev => ({
                          ...prev,
                          emergency_contact: { ...prev.emergency_contact, name: e.target.value }
                        }))}
                        placeholder="Contact name"
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <Input
                        value={profile.emergency_contact?.phone || ''}
                        onChange={(e) => setProfile(prev => ({
                          ...prev,
                          emergency_contact: { ...prev.emergency_contact, phone: e.target.value }
                        }))}
                        placeholder="Phone number"
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label>Relation</Label>
                      <Input
                        value={profile.emergency_contact?.relation || ''}
                        onChange={(e) => setProfile(prev => ({
                          ...prev,
                          emergency_contact: { ...prev.emergency_contact, relation: e.target.value }
                        }))}
                        placeholder="e.g., Spouse, Parent"
                        className="mt-1.5"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Medical History */}
          <TabsContent value="medical">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-rose-500" />
                  Medical History
                </CardTitle>
                <CardDescription>Keep your medical information up to date for better care</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Allergies */}
                <div>
                  <Label className="flex items-center gap-2 mb-3">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    Allergies
                  </Label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {profile.allergies?.map((allergy, index) => (
                      <Badge 
                        key={index}
                        variant="secondary"
                        className="bg-red-50 text-red-700 cursor-pointer hover:bg-red-100"
                        onClick={() => removeItem('allergy', index)}
                      >
                        {allergy} ×
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newAllergy}
                      onChange={(e) => setNewAllergy(e.target.value)}
                      placeholder="Add allergy..."
                      onKeyPress={(e) => e.key === 'Enter' && addItem('allergy')}
                    />
                    <Button variant="outline" onClick={() => addItem('allergy')}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Chronic Conditions */}
                <div>
                  <Label className="flex items-center gap-2 mb-3">
                    <Heart className="w-4 h-4 text-purple-500" />
                    Chronic Conditions
                  </Label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {profile.chronic_conditions?.map((condition, index) => (
                      <Badge 
                        key={index}
                        variant="secondary"
                        className="bg-purple-50 text-purple-700 cursor-pointer hover:bg-purple-100"
                        onClick={() => removeItem('condition', index)}
                      >
                        {condition} ×
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newCondition}
                      onChange={(e) => setNewCondition(e.target.value)}
                      placeholder="Add condition (e.g., Diabetes, Hypertension)..."
                      onKeyPress={(e) => e.key === 'Enter' && addItem('condition')}
                    />
                    <Button variant="outline" onClick={() => addItem('condition')}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Current Medications */}
                <div>
                  <Label className="flex items-center gap-2 mb-3">
                    <Pill className="w-4 h-4 text-blue-500" />
                    Current Medications
                  </Label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {profile.current_medications?.map((medication, index) => (
                      <Badge 
                        key={index}
                        variant="secondary"
                        className="bg-blue-50 text-blue-700 cursor-pointer hover:bg-blue-100"
                        onClick={() => removeItem('medication', index)}
                      >
                        {medication} ×
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newMedication}
                      onChange={(e) => setNewMedication(e.target.value)}
                      placeholder="Add medication..."
                      onKeyPress={(e) => e.key === 'Enter' && addItem('medication')}
                    />
                    <Button variant="outline" onClick={() => addItem('medication')}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ABHA */}
          <TabsContent value="abha">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-indigo-500" />
                  ABHA (Ayushman Bharat Health Account)
                </CardTitle>
                <CardDescription>
                  Link your ABHA ID for unified health records across India
                </CardDescription>
              </CardHeader>
              <CardContent>
                {profile.abha_linked ? (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                    <Shield className="w-12 h-12 text-green-500 mx-auto mb-3" />
                    <h3 className="font-semibold text-green-800 mb-1">ABHA Account Linked</h3>
                    <p className="text-green-600 text-sm mb-2">Your ABHA ID: {profile.abha_id}</p>
                    <p className="text-gray-600 text-sm">
                      Your health records are now interoperable across ABDM network
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-gray-600">
                      ABHA (Ayushman Bharat Health Account) enables you to share your health records 
                      digitally with healthcare providers across India.
                    </p>
                    <div>
                      <Label htmlFor="abha">ABHA ID / Health ID</Label>
                      <Input
                        id="abha"
                        value={profile.abha_id || ''}
                        onChange={(e) => setProfile(prev => ({ ...prev, abha_id: e.target.value }))}
                        placeholder="Enter your 14-digit ABHA ID"
                        className="mt-1.5"
                      />
                    </div>
                    <Button 
                      onClick={() => {
                        if (profile.abha_id) {
                          setProfile(prev => ({ ...prev, abha_linked: true }));
                          toast.success('ABHA ID linked successfully!');
                        }
                      }}
                      className="bg-indigo-500 hover:bg-indigo-600"
                    >
                      <LinkIcon className="w-4 h-4 mr-2" />
                      Link ABHA Account
                    </Button>
                    <p className="text-sm text-gray-500">
                      Don't have an ABHA ID?{' '}
                      <a 
                        href="https://healthid.ndhm.gov.in/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:underline"
                      >
                        Create one here
                      </a>
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <div className="mt-6 flex justify-end">
          <Button 
            onClick={handleSave}
            disabled={saveProfile.isPending}
            className="bg-teal-500 hover:bg-teal-600"
          >
            {saveProfile.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Profile
          </Button>
        </div>
      </div>
    </PageTransition>
  );
}