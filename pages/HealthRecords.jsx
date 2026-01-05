import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import {
  FileText,
  Upload,
  Plus,
  Search,
  Filter,
  Calendar,
  Building2,
  User,
  Download,
  Eye,
  Trash2,
  X,
  Image,
  File,
  Loader2,
  FolderOpen,
  Pill,
  TestTube,
  Stethoscope,
  Syringe,
  Shield,
  Link as LinkIcon,
  Share2
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import PageTransition from '@/components/ui/PageTransition';
import { SkeletonList } from '@/components/ui/SkeletonLoader';
import { toast } from 'react-hot-toast';

const recordTypeIcons = {
  prescription: Pill,
  lab_report: TestTube,
  discharge_summary: FileText,
  vaccination: Syringe,
  imaging: Image,
  insurance: Shield,
  other: File
};

const recordTypeColors = {
  prescription: 'bg-blue-100 text-blue-600',
  lab_report: 'bg-amber-100 text-amber-600',
  discharge_summary: 'bg-purple-100 text-purple-600',
  vaccination: 'bg-green-100 text-green-600',
  imaging: 'bg-pink-100 text-pink-600',
  insurance: 'bg-indigo-100 text-indigo-600',
  other: 'bg-gray-100 text-gray-600'
};

const recordTypes = [
  { value: 'all', label: 'All Records' },
  { value: 'prescription', label: 'Prescriptions' },
  { value: 'lab_report', label: 'Lab Reports' },
  { value: 'discharge_summary', label: 'Discharge Summaries' },
  { value: 'vaccination', label: 'Vaccinations' },
  { value: 'imaging', label: 'X-rays & Scans' },
  { value: 'insurance', label: 'Insurance' },
  { value: 'other', label: 'Other' }
];

export default function HealthRecords() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [newRecord, setNewRecord] = useState({
    title: '',
    record_type: 'prescription',
    record_date: format(new Date(), 'yyyy-MM-dd'),
    doctor_name: '',
    hospital_name: '',
    notes: '',
    file_url: '',
    linked_records: [],
    shared_with: []
  });
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const isAuth = await base44.auth.isAuthenticated();
        if (isAuth) {
          setUser(await base44.auth.me());
        }
      } catch (e) {
        console.log('Not authenticated');
      }
    };
    loadUser();
  }, []);

  const { data: records = [], isLoading } = useQuery({
    queryKey: ['healthRecords'],
    queryFn: () => base44.entities.HealthRecord.list('-record_date', 100),
  });

  const createRecord = useMutation({
    mutationFn: (data) => base44.entities.HealthRecord.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['healthRecords'] });
      setIsUploadOpen(false);
      setNewRecord({
        title: '',
        record_type: 'prescription',
        record_date: format(new Date(), 'yyyy-MM-dd'),
        doctor_name: '',
        hospital_name: '',
        notes: '',
        file_url: ''
      });
      toast.success('Record uploaded successfully!');
    }
  });

  const deleteRecord = useMutation({
    mutationFn: (id) => base44.entities.HealthRecord.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['healthRecords'] });
      toast.success('Record deleted');
    }
  });

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setNewRecord(prev => ({ ...prev, file_url }));
      toast.success('File uploaded');

      // Extract data using OCR
      setExtracting(true);
      try {
        const extractedData = await base44.integrations.Core.ExtractDataFromUploadedFile({
          file_url,
          json_schema: {
            type: 'object',
            properties: {
              title: { type: 'string' },
              doctor_name: { type: 'string' },
              hospital_name: { type: 'string' },
              date: { type: 'string' },
              diagnosis: { type: 'string' },
              medications: { type: 'array', items: { type: 'string' } },
              notes: { type: 'string' }
            }
          }
        });

        if (extractedData.status === 'success' && extractedData.output) {
          const data = extractedData.output;
          setNewRecord(prev => ({
            ...prev,
            title: data.title || prev.title,
            doctor_name: data.doctor_name || prev.doctor_name,
            hospital_name: data.hospital_name || prev.hospital_name,
            record_date: data.date || prev.record_date,
            notes: data.diagnosis || data.notes || prev.notes,
            extracted_data: data
          }));
          toast.success('Data extracted from document');
        }
      } catch (error) {
        console.log('OCR extraction failed, continuing without extraction');
      }
      setExtracting(false);
    } catch (error) {
      toast.error('Failed to upload file');
    }
    setUploading(false);
  };

  const handleSubmit = () => {
    if (!newRecord.title || !newRecord.record_date) {
      toast.error('Please fill required fields');
      return;
    }
    createRecord.mutate({
      ...newRecord,
      linked_records: newRecord.linked_records || [],
      shared_with: newRecord.shared_with || []
    });
  };

  const filteredRecords = records.filter(record => {
    if (search) {
      const searchLower = search.toLowerCase();
      const matchesSearch = 
        record.title?.toLowerCase().includes(searchLower) ||
        record.doctor_name?.toLowerCase().includes(searchLower) ||
        record.hospital_name?.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }
    if (typeFilter !== 'all' && record.record_type !== typeFilter) return false;
    return true;
  });

  // Group records by month
  const groupedRecords = filteredRecords.reduce((groups, record) => {
    const month = format(new Date(record.record_date), 'MMMM yyyy');
    if (!groups[month]) groups[month] = [];
    groups[month].push(record);
    return groups;
  }, {});

  return (
    <PageTransition className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-500 to-green-500 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-6">
              <FileText className="w-8 h-8" />
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Health Records
            </h1>
            <p className="text-emerald-100 text-lg max-w-2xl mx-auto">
              Store all your medical records securely in one place. 
              Access them anytime, anywhere.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search, Filter & Upload */}
      <section className="container mx-auto px-4 -mt-8 relative z-10 mb-6">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 md:p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search records..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-12 rounded-xl"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-48 h-12 rounded-xl">
                <SelectValue placeholder="Record Type" />
              </SelectTrigger>
              <SelectContent>
                {recordTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
              <DialogTrigger asChild>
                <Button className="h-12 bg-emerald-500 hover:bg-emerald-600">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Record
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Upload Health Record</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4 mt-4">
                  {/* File Upload */}
                  <div>
                    <Label>Upload File</Label>
                    <div className="mt-1.5 border-2 border-dashed border-gray-200 rounded-xl p-6 text-center">
                      {newRecord.file_url ? (
                        <div className="space-y-2">
                          <div className="flex items-center justify-center gap-2">
                            <File className="w-8 h-8 text-emerald-500" />
                            <span className="text-sm text-gray-600">File uploaded</span>
                            <button 
                              onClick={() => setNewRecord(prev => ({ 
                                ...prev, 
                                file_url: '',
                                title: '',
                                doctor_name: '',
                                hospital_name: '',
                                notes: ''
                              }))}
                              className="text-red-500"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          {extracting && (
                            <div className="flex items-center justify-center gap-2 text-teal-600 text-sm">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Extracting data from document...
                            </div>
                          )}
                        </div>
                      ) : (
                        <>
                          <input
                            type="file"
                            id="file-upload"
                            className="hidden"
                            onChange={handleFileUpload}
                            accept="image/*,.pdf"
                          />
                          <label htmlFor="file-upload" className="cursor-pointer">
                            {uploading ? (
                              <Loader2 className="w-8 h-8 mx-auto text-gray-400 animate-spin" />
                            ) : (
                              <>
                                <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                                <p className="text-sm text-gray-500">Click to upload or drag & drop</p>
                                <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG up to 10MB</p>
                                <p className="text-xs text-teal-600 mt-2">✨ Auto-extract data with AI OCR</p>
                              </>
                            )}
                          </label>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        value={newRecord.title}
                        onChange={(e) => setNewRecord(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="e.g., Blood Test Report"
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label>Record Type *</Label>
                      <Select 
                        value={newRecord.record_type} 
                        onValueChange={(value) => setNewRecord(prev => ({ ...prev, record_type: value }))}
                      >
                        <SelectTrigger className="mt-1.5">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {recordTypes.slice(1).map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="record_date">Date *</Label>
                    <Input
                      id="record_date"
                      type="date"
                      value={newRecord.record_date}
                      onChange={(e) => setNewRecord(prev => ({ ...prev, record_date: e.target.value }))}
                      className="mt-1.5"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="doctor_name">Doctor Name</Label>
                      <Input
                        id="doctor_name"
                        value={newRecord.doctor_name}
                        onChange={(e) => setNewRecord(prev => ({ ...prev, doctor_name: e.target.value }))}
                        placeholder="Dr. Name"
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="hospital_name">Hospital/Clinic</Label>
                      <Input
                        id="hospital_name"
                        value={newRecord.hospital_name}
                        onChange={(e) => setNewRecord(prev => ({ ...prev, hospital_name: e.target.value }))}
                        placeholder="Hospital name"
                        className="mt-1.5"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="notes">Notes / Diagnosis</Label>
                    <Input
                      id="notes"
                      value={newRecord.notes}
                      onChange={(e) => setNewRecord(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Any additional notes..."
                      className="mt-1.5"
                    />
                  </div>

                  {/* Link Records */}
                  <div>
                    <Label>Link Related Records (Optional)</Label>
                    <Select 
                      onValueChange={(value) => {
                        if (!newRecord.linked_records?.includes(value)) {
                          setNewRecord(prev => ({
                            ...prev,
                            linked_records: [...(prev.linked_records || []), value]
                          }));
                        }
                      }}
                    >
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="Link a related record" />
                      </SelectTrigger>
                      <SelectContent>
                        {records.filter(r => r.id !== newRecord.id).map((record) => (
                          <SelectItem key={record.id} value={record.id}>
                            {record.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {newRecord.linked_records?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {newRecord.linked_records.map((recordId) => {
                          const linkedRecord = records.find(r => r.id === recordId);
                          return linkedRecord ? (
                            <Badge 
                              key={recordId}
                              className="bg-teal-50 text-teal-700 cursor-pointer"
                              onClick={() => setNewRecord(prev => ({
                                ...prev,
                                linked_records: prev.linked_records.filter(id => id !== recordId)
                              }))}
                            >
                              {linkedRecord.title} <X className="w-3 h-3 ml-1" />
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={handleSubmit}
                    disabled={createRecord.isPending || !newRecord.title || extracting}
                    className="w-full bg-emerald-500 hover:bg-emerald-600"
                  >
                    {createRecord.isPending ? 'Uploading...' : extracting ? 'Extracting Data...' : 'Upload Record'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </section>

      {/* Records Timeline */}
      <section className="container mx-auto px-4 pb-16">
        {isLoading ? (
          <SkeletonList count={4} />
        ) : filteredRecords.length === 0 ? (
          <div className="text-center py-16">
            <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No records found</h3>
            <p className="text-gray-500 mb-6">Start by uploading your first health record</p>
            <Button onClick={() => setIsUploadOpen(true)} className="bg-emerald-500 hover:bg-emerald-600">
              <Upload className="w-4 h-4 mr-2" />
              Upload Record
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedRecords).map(([month, monthRecords]) => (
              <div key={month}>
                <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  {month}
                </h3>
                <div className="space-y-3">
                  {monthRecords.map((record, index) => {
                    const IconComponent = recordTypeIcons[record.record_type] || recordTypeIcons.other;
                    const colorClass = recordTypeColors[record.record_type] || recordTypeColors.other;
                    
                    return (
                      <motion.div
                        key={record.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-5"
                      >
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 rounded-xl ${colorClass} flex items-center justify-center flex-shrink-0`}>
                            <IconComponent className="w-6 h-6" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <h4 className="font-semibold text-gray-900">{record.title}</h4>
                                <Badge variant="secondary" className="mt-1 capitalize">
                                  {record.record_type?.replace(/_/g, ' ')}
                                </Badge>
                              </div>
                              <span className="text-sm text-gray-500 flex-shrink-0">
                                {format(new Date(record.record_date), 'MMM d, yyyy')}
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
                              {record.doctor_name && (
                                <span className="flex items-center gap-1">
                                  <User className="w-4 h-4" />
                                  {record.doctor_name}
                                </span>
                              )}
                              {record.hospital_name && (
                                <span className="flex items-center gap-1">
                                  <Building2 className="w-4 h-4" />
                                  {record.hospital_name}
                                </span>
                              )}
                            </div>

                            {record.notes && (
                              <p className="text-sm text-gray-500 mt-2">{record.notes}</p>
                            )}

                            {/* Linked Records */}
                            {record.linked_records?.length > 0 && (
                              <div className="mt-3 flex flex-wrap gap-2">
                                <LinkIcon className="w-4 h-4 text-teal-500 mt-0.5" />
                                {record.linked_records.map((linkedId) => {
                                  const linked = records.find(r => r.id === linkedId);
                                  return linked ? (
                                    <Badge key={linkedId} variant="secondary" className="text-xs">
                                      {linked.title}
                                    </Badge>
                                  ) : null;
                                })}
                              </div>
                            )}

                            {/* Shared With */}
                            {record.shared_with?.length > 0 && (
                              <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                                <Share2 className="w-3 h-3" />
                                Shared with {record.shared_with.length} doctor(s)
                              </div>
                            )}

                            {/* Extracted Data Preview */}
                            {record.extracted_data && (
                              <div className="mt-3 p-3 bg-teal-50 rounded-lg">
                                <p className="text-xs text-teal-700 font-medium mb-1">AI Extracted Data:</p>
                                {record.extracted_data.diagnosis && (
                                  <p className="text-xs text-gray-600">
                                    <strong>Diagnosis:</strong> {record.extracted_data.diagnosis}
                                  </p>
                                )}
                                {record.extracted_data.medications?.length > 0 && (
                                  <p className="text-xs text-gray-600">
                                    <strong>Medications:</strong> {record.extracted_data.medications.join(', ')}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-2 flex-shrink-0">
                            {record.file_url && (
                              <a
                                href={record.file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                              >
                                <Eye className="w-5 h-5 text-gray-500" />
                              </a>
                            )}
                            <button
                              onClick={() => {
                                const doctors = ['Dr. Amit Patel', 'Dr. Priya Sharma'];
                                const selectedDoctor = doctors[0];
                                const updatedShared = [...(record.shared_with || []), selectedDoctor];
                                base44.entities.HealthRecord.update(record.id, {
                                  shared_with: updatedShared
                                }).then(() => {
                                  queryClient.invalidateQueries({ queryKey: ['healthRecords'] });
                                  toast.success(`Shared with ${selectedDoctor}`);
                                });
                              }}
                              className="p-2 hover:bg-teal-50 rounded-lg transition-colors"
                              title="Share with doctor"
                            >
                              <Share2 className="w-5 h-5 text-teal-500" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm('Delete this record?')) {
                                  deleteRecord.mutate(record.id);
                                }
                              }}
                              className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-5 h-5 text-red-500" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </PageTransition>
  );
}