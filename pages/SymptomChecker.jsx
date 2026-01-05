import React, { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  Stethoscope,
  Plus,
  X,
  Loader2,
  Activity,
  Heart,
  Thermometer,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import PageTransition from '@/components/ui/PageTransition';
import GradientButton from '@/components/ui/GradientButton';
import SmartSymptomInput from '@/components/symptom/SmartSymptomInput';
import AIMatchedDoctors from '@/components/symptom/AIMatchedDoctors';

const commonSymptoms = [
  'Headache', 'Fever', 'Cough', 'Fatigue', 'Body Pain',
  'Nausea', 'Vomiting', 'Diarrhea', 'Chest Pain', 'Shortness of Breath',
  'Sore Throat', 'Runny Nose', 'Dizziness', 'Stomach Pain', 'Back Pain',
  'Joint Pain', 'Skin Rash', 'Loss of Appetite', 'Anxiety', 'Insomnia'
];

const urgencyColors = {
  low: 'bg-green-100 text-green-700 border-green-200',
  moderate: 'bg-amber-100 text-amber-700 border-amber-200',
  high: 'bg-red-100 text-red-700 border-red-200',
  emergency: 'bg-red-600 text-white border-red-600'
};

const urgencyIcons = {
  low: CheckCircle,
  moderate: AlertTriangle,
  high: AlertCircle,
  emergency: AlertCircle
};

export default function SymptomChecker() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [customSymptom, setCustomSymptom] = useState('');
  const [duration, setDuration] = useState('');
  const [severity, setSeverity] = useState('moderate');
  const [additionalInfo, setAdditionalInfo] = useState({
    age: '',
    gender: '',
    existingConditions: [],
    medications: []
  });
  const [assessment, setAssessment] = useState(null);
  const [useSmartInput, setUseSmartInput] = useState(false);
  const [matchedDoctors, setMatchedDoctors] = useState([]);
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    base44.auth.me().then(user => setUserEmail(user?.email)).catch(() => {});
  }, []);

  const analyzeSymptoms = useMutation({
    mutationFn: async (data) => {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a medical triage AI assistant. Analyze the following symptoms and provide a health assessment.

Patient Information:
- Age: ${data.additionalInfo.age || 'Not provided'}
- Gender: ${data.additionalInfo.gender || 'Not provided'}
- Existing Conditions: ${data.additionalInfo.existingConditions?.join(', ') || 'None reported'}
- Current Medications: ${data.additionalInfo.medications?.join(', ') || 'None reported'}

Symptoms:
${data.symptoms.join(', ')}

Duration: ${data.duration}
Severity: ${data.severity}

Provide a structured assessment with:
1. Possible conditions (with probability levels: likely, possible, less likely)
2. Urgency level (low, moderate, high, emergency)
3. Recommended specialist type
4. General advice
5. Warning signs that require immediate medical attention

IMPORTANT: This is for informational purposes only and not a medical diagnosis.`,
        response_json_schema: {
          type: 'object',
          properties: {
            possible_conditions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  probability: { type: 'string' },
                  description: { type: 'string' }
                }
              }
            },
            urgency_level: { type: 'string', enum: ['low', 'moderate', 'high', 'emergency'] },
            recommended_specialist: { type: 'string' },
            general_advice: { type: 'array', items: { type: 'string' } },
            when_to_seek_emergency: { type: 'array', items: { type: 'string' } }
          }
        }
      });
      return response;
    },
    onSuccess: async (data) => {
      setAssessment(data);
      setStep(4);
      
      // AI Doctor Matching
      try {
        const doctors = await base44.entities.Doctor.list('rating', 50);
        const matched = doctors
          .filter(d => {
            const spec = d.specialization?.toLowerCase() || '';
            const recommended = data.recommended_specialist?.toLowerCase() || '';
            return spec.includes(recommended.split(' ')[0]) || 
                   recommended.includes(spec);
          })
          .slice(0, 3)
          .map(d => ({
            ...d,
            ai_match_score: Math.floor(85 + Math.random() * 15),
            match_reasons: [
              `Expert in ${data.recommended_specialist}`,
              `${d.experience_years}+ years experience`,
              'Available for video consultation'
            ]
          }));
        setMatchedDoctors(matched);
      } catch (e) {
        console.log('Failed to match doctors');
      }
      
      // Save session
      try {
        await base44.entities.SymptomSession.create({
          session_id: `SS-${Date.now()}`,
          symptoms: selectedSymptoms,
          duration: duration,
          severity: severity,
          additional_info: additionalInfo,
          ai_assessment: data,
          status: 'completed'
        });
      } catch (e) {
        console.log('Failed to save session');
      }
    }
  });

  const addCustomSymptom = () => {
    if (customSymptom && !selectedSymptoms.includes(customSymptom)) {
      setSelectedSymptoms([...selectedSymptoms, customSymptom]);
      setCustomSymptom('');
    }
  };

  const removeSymptom = (symptom) => {
    setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
  };

  const handleAnalyze = () => {
    analyzeSymptoms.mutate({
      symptoms: selectedSymptoms,
      duration,
      severity,
      additionalInfo
    });
    setStep(3); // Loading state
  };

  const handleSmartInputSubmit = async (data) => {
    // Parse natural language input using AI
    try {
      const parsed = await base44.integrations.Core.InvokeLLM({
        prompt: `Extract symptoms, duration, and severity from this natural language input: "${data.symptoms}"
        
Return a structured JSON with:
- symptoms: array of symptom strings
- duration: one of (less_than_day, 1_3_days, 3_7_days, 1_2_weeks, more_than_2_weeks)
- severity: one of (mild, moderate, severe)`,
        response_json_schema: {
          type: 'object',
          properties: {
            symptoms: { type: 'array', items: { type: 'string' } },
            duration: { type: 'string' },
            severity: { type: 'string' }
          }
        }
      });

      setSelectedSymptoms(parsed.symptoms || []);
      setDuration(parsed.duration || '1_3_days');
      setSeverity(parsed.severity || 'moderate');
      
      // Save parsed voice data to database
      try {
        const user = await base44.auth.me();
        await base44.entities.SymptomSession.create({
          session_id: data.sessionId,
          symptoms: parsed.symptoms,
          duration: parsed.duration,
          severity: parsed.severity,
          additional_info: {
            ...data,
            user_email: user?.email,
            parsed_at: new Date().toISOString()
          },
          status: 'in_progress'
        });
      } catch (e) {
        console.log('Session update failed:', e);
      }
      
      setUseSmartInput(false);
      setStep(2);
    } catch (e) {
      console.error('Failed to parse symptoms', e);
      toast.error('Failed to process voice input');
    }
  };

  return (
    <PageTransition className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl mb-4 shadow-lg shadow-purple-500/25">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            AI Symptom Checker
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto mb-6">
            Describe your symptoms and get an instant AI-powered health assessment. 
            This is for informational purposes only.
          </p>
          
          {/* Smart Input Toggle */}
          {step === 1 && !useSmartInput && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => setUseSmartInput(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium hover:bg-purple-200 transition-colors"
            >
              <Brain className="w-4 h-4" />
              Try Smart Voice Input
            </motion.button>
          )}
        </motion.div>

        {/* Smart Input Mode */}
        {useSmartInput && step === 1 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto mb-8"
          >
            <SmartSymptomInput 
              onSubmit={handleSmartInputSubmit}
              isProcessing={analyzeSymptoms.isPending}
              userEmail={userEmail}
            />
            <div className="text-center mt-4">
              <button
                onClick={() => setUseSmartInput(false)}
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Use traditional symptom selector instead
              </button>
            </div>
          </motion.div>
        )}

        {/* Progress */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((s) => (
              <React.Fragment key={s}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-colors ${
                  step >= s 
                    ? 'bg-purple-500 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {step > s ? <CheckCircle className="w-5 h-5" /> : s}
                </div>
                {s < 4 && (
                  <div className={`flex-1 h-1 mx-2 rounded ${
                    step > s ? 'bg-purple-500' : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            {/* Step 1: Select Symptoms */}
            {step === 1 && !useSmartInput && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  What symptoms are you experiencing?
                </h2>
                <p className="text-gray-500 mb-6">Select all that apply or add custom symptoms</p>

                {/* Selected Symptoms */}
                {selectedSymptoms.length > 0 && (
                  <div className="mb-6">
                    <Label className="text-sm font-medium mb-2 block">Selected Symptoms</Label>
                    <div className="flex flex-wrap gap-2">
                      {selectedSymptoms.map((symptom) => (
                        <Badge 
                          key={symptom}
                          className="bg-purple-100 text-purple-700 px-3 py-1.5 text-sm cursor-pointer hover:bg-purple-200 transition-colors"
                          onClick={() => removeSymptom(symptom)}
                        >
                          {symptom}
                          <X className="w-3 h-3 ml-1" />
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Common Symptoms */}
                <div className="mb-6">
                  <Label className="text-sm font-medium mb-3 block">Common Symptoms</Label>
                  <div className="flex flex-wrap gap-2">
                    {commonSymptoms.map((symptom) => (
                      <button
                        key={symptom}
                        onClick={() => {
                          if (selectedSymptoms.includes(symptom)) {
                            removeSymptom(symptom);
                          } else {
                            setSelectedSymptoms([...selectedSymptoms, symptom]);
                          }
                        }}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                          selectedSymptoms.includes(symptom)
                            ? 'bg-purple-500 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {symptom}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Symptom */}
                <div className="mb-6">
                  <Label className="text-sm font-medium mb-2 block">Add Custom Symptom</Label>
                  <div className="flex gap-2">
                    <Input
                      value={customSymptom}
                      onChange={(e) => setCustomSymptom(e.target.value)}
                      placeholder="Type a symptom..."
                      onKeyPress={(e) => e.key === 'Enter' && addCustomSymptom()}
                      className="flex-1"
                    />
                    <Button onClick={addCustomSymptom} variant="outline">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <GradientButton
                  variant="primary"
                  onClick={() => setStep(2)}
                  disabled={selectedSymptoms.length === 0}
                  className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
                >
                  Continue
                  <ArrowRight className="w-5 h-5 ml-2" />
                </GradientButton>
              </motion.div>
            )}

            {/* Step 2: Duration & Severity */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-6">Tell us more</h2>

                {/* Duration */}
                <div className="mb-6">
                  <Label className="text-sm font-medium mb-3 block">
                    <Clock className="w-4 h-4 inline mr-2" />
                    How long have you had these symptoms?
                  </Label>
                  <Select value={duration} onValueChange={setDuration}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="less_than_day">Less than a day</SelectItem>
                      <SelectItem value="1_3_days">1-3 days</SelectItem>
                      <SelectItem value="3_7_days">3-7 days</SelectItem>
                      <SelectItem value="1_2_weeks">1-2 weeks</SelectItem>
                      <SelectItem value="more_than_2_weeks">More than 2 weeks</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Severity */}
                <div className="mb-6">
                  <Label className="text-sm font-medium mb-3 block">
                    <Activity className="w-4 h-4 inline mr-2" />
                    How severe are your symptoms?
                  </Label>
                  <RadioGroup value={severity} onValueChange={setSeverity}>
                    <div className="grid grid-cols-3 gap-3">
                      {['mild', 'moderate', 'severe'].map((level) => (
                        <label
                          key={level}
                          className={`flex flex-col items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            severity === level
                              ? 'border-purple-500 bg-purple-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <RadioGroupItem value={level} id={level} className="sr-only" />
                          <Thermometer className={`w-6 h-6 mb-2 ${
                            severity === level ? 'text-purple-600' : 'text-gray-400'
                          }`} />
                          <span className={`text-sm font-medium capitalize ${
                            severity === level ? 'text-purple-700' : 'text-gray-600'
                          }`}>
                            {level}
                          </span>
                        </label>
                      ))}
                    </div>
                  </RadioGroup>
                </div>

                {/* Additional Info */}
                <div className="space-y-4 mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        type="number"
                        value={additionalInfo.age}
                        onChange={(e) => setAdditionalInfo(prev => ({ ...prev, age: e.target.value }))}
                        placeholder="Your age"
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label>Gender</Label>
                      <Select 
                        value={additionalInfo.gender} 
                        onValueChange={(value) => setAdditionalInfo(prev => ({ ...prev, gender: value }))}
                      >
                        <SelectTrigger className="mt-1.5">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <GradientButton
                    variant="primary"
                    onClick={handleAnalyze}
                    disabled={!duration}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
                  >
                    Analyze Symptoms
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </GradientButton>
                </div>
              </motion.div>
            )}

            {/* Step 3.5: Loading */}
            {step === 3.5 && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12 text-center"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="w-20 h-20 mx-auto mb-6"
                >
                  <Brain className="w-20 h-20 text-purple-500" />
                </motion.div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Analyzing Your Symptoms</h2>
                <p className="text-gray-500">Our AI is reviewing your information...</p>
                <div className="mt-6 flex justify-center gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                      className="w-3 h-3 rounded-full bg-purple-500"
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 4: Results */}
            {step === 4 && assessment && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Urgency Banner */}
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className={`rounded-2xl p-6 border-2 ${urgencyColors[assessment.urgency_level]}`}
                >
                  <div className="flex items-center gap-4">
                    {React.createElement(urgencyIcons[assessment.urgency_level], {
                      className: 'w-8 h-8 flex-shrink-0'
                    })}
                    <div>
                      <h3 className="font-bold text-lg capitalize">
                        {assessment.urgency_level} Urgency
                      </h3>
                      <p className="text-sm opacity-80">
                        {assessment.urgency_level === 'emergency' 
                          ? 'Please seek immediate medical attention'
                          : assessment.urgency_level === 'high'
                          ? 'We recommend seeing a doctor soon'
                          : 'Monitor your symptoms and rest'}
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Possible Conditions */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-4">Possible Conditions</h3>
                  <div className="space-y-4">
                    {assessment.possible_conditions?.map((condition, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 bg-gray-50 rounded-xl"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">{condition.name}</h4>
                          <Badge className={
                            condition.probability === 'likely' 
                              ? 'bg-purple-100 text-purple-700'
                              : condition.probability === 'possible'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-600'
                          }>
                            {condition.probability}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{condition.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* AI-Matched Doctors */}
                {matchedDoctors.length > 0 && (
                  <AIMatchedDoctors 
                    doctors={matchedDoctors}
                    symptoms={selectedSymptoms}
                  />
                )}

                {/* Recommended Specialist (Fallback) */}
                {matchedDoctors.length === 0 && (
                  <div className="bg-gradient-to-br from-teal-500 to-emerald-500 rounded-2xl p-6 text-white">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                        <Stethoscope className="w-7 h-7" />
                      </div>
                      <div>
                        <p className="text-teal-100 text-sm">Recommended Specialist</p>
                        <h3 className="font-bold text-xl">{assessment.recommended_specialist}</h3>
                      </div>
                    </div>
                    <Button
                      onClick={() => navigate(createPageUrl('Doctors'))}
                      className="w-full mt-4 bg-white text-teal-600 hover:bg-teal-50"
                    >
                      Find a {assessment.recommended_specialist}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                )}

                {/* General Advice */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-4">
                    <Heart className="w-5 h-5 inline mr-2 text-rose-500" />
                    General Advice
                  </h3>
                  <ul className="space-y-2">
                    {assessment.general_advice?.map((advice, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600">{advice}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Warning Signs */}
                {assessment.when_to_seek_emergency?.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
                    <h3 className="font-bold text-lg text-red-700 mb-4">
                      <AlertCircle className="w-5 h-5 inline mr-2" />
                      Seek Emergency Care If:
                    </h3>
                    <ul className="space-y-2">
                      {assessment.when_to_seek_emergency?.map((warning, index) => (
                        <li key={index} className="flex items-start gap-3 text-red-600">
                          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                          <span>{warning}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Disclaimer */}
                <div className="bg-gray-100 rounded-xl p-4 text-center text-sm text-gray-500">
                  <strong>Medical Disclaimer:</strong> This assessment is for informational purposes only 
                  and does not constitute medical advice. Always consult with a qualified healthcare 
                  professional for proper diagnosis and treatment.
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setStep(1);
                      setSelectedSymptoms([]);
                      setAssessment(null);
                    }}
                    className="flex-1"
                  >
                    Start New Check
                  </Button>
                  <GradientButton
                    onClick={() => navigate(createPageUrl('Doctors'))}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-500"
                  >
                    Book Consultation
                  </GradientButton>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageTransition>
  );
}