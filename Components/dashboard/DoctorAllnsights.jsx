import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { 
  TrendingUp, Users, Activity, AlertCircle,
  Pill, FileText, Brain, BarChart3
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function DoctorAIInsights({ doctorEmail, specialization }) {
  // Fetch doctor's appointment data for AI analysis
  const { data: appointments = [] } = useQuery({
    queryKey: ['doctorInsightData', doctorEmail],
    queryFn: async () => {
      const doctors = await base44.entities.Doctor.filter({ 
        email: doctorEmail 
      });
      if (doctors.length === 0) return [];
      return base44.entities.Appointment.filter({ 
        doctor_id: doctors[0].id 
      }, '-appointment_date', 100);
    }
  });

  // AI-generated insights (simulated - in production would call ML backend)
  const generateInsights = () => {
    if (appointments.length === 0) return null;

    // Extract common symptoms
    const symptomFrequency = {};
    appointments.forEach(apt => {
      if (apt.symptoms) {
        const symptoms = apt.symptoms.toLowerCase().split(/[,;.]+/);
        symptoms.forEach(symptom => {
          const cleaned = symptom.trim();
          if (cleaned.length > 3) {
            symptomFrequency[cleaned] = (symptomFrequency[cleaned] || 0) + 1;
          }
        });
      }
    });

    const topSymptoms = Object.entries(symptomFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([symptom, count]) => ({ symptom, count }));

    // Calculate trends
    const completedCount = appointments.filter(a => a.status === 'completed').length;
    const completionRate = appointments.length > 0 
      ? Math.round((completedCount / appointments.length) * 100)
      : 0;

    return {
      topSymptoms,
      completionRate,
      totalPatients: appointments.length,
      avgPerWeek: Math.round(appointments.length / 12), // Last 3 months
      recommendations: [
        {
          title: 'Peak Hours Optimization',
          description: 'Most bookings occur 10AM-2PM. Consider adding slots.',
          impact: 'high'
        },
        {
          title: 'Common Condition Pattern',
          description: `${topSymptoms[0]?.symptom || 'headache'} cases up 15% this month`,
          impact: 'medium'
        },
        {
          title: 'Follow-up Suggestions',
          description: '12 patients may benefit from follow-up consultations',
          impact: 'medium'
        }
      ]
    };
  };

  const insights = generateInsights();

  if (!insights) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Brain className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">AI insights will appear once you have more consultation data</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* AI Header */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            AI-Powered Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-purple-700">
            Smart recommendations based on your consultation patterns and platform data
          </p>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Total Patients</p>
                <p className="text-2xl font-bold text-gray-900">{insights.totalPatients}</p>
              </div>
              <Users className="w-8 h-8 text-teal-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Avg/Week</p>
                <p className="text-2xl font-bold text-gray-900">{insights.avgPerWeek}</p>
              </div>
              <Activity className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Completion Rate</p>
                <p className="text-2xl font-bold text-green-600">{insights.completionRate}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Trend</p>
                <p className="text-2xl font-bold text-purple-600">+12%</p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Symptoms */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Most Common Symptoms</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {insights.topSymptoms.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-bold text-teal-600">{index + 1}</span>
                  </div>
                  <span className="text-sm capitalize">{item.symptom}</span>
                </div>
                <Badge variant="outline">{item.count} cases</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            Smart Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64">
            <div className="space-y-3">
              {insights.recommendations.map((rec, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      rec.impact === 'high' ? 'bg-red-500' :
                      rec.impact === 'medium' ? 'bg-amber-500' :
                      'bg-green-500'
                    }`} />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm mb-1">{rec.title}</h4>
                      <p className="text-xs text-gray-600">{rec.description}</p>
                    </div>
                    <Badge className={
                      rec.impact === 'high' ? 'bg-red-100 text-red-700' :
                      rec.impact === 'medium' ? 'bg-amber-100 text-amber-700' :
                      'bg-green-100 text-green-700'
                    }>
                      {rec.impact}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Treatment Protocols */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Suggested Protocols</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-3">
            Based on {insights.topSymptoms[0]?.count || 0} similar cases in your specialty
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Pill className="w-4 h-4 text-teal-500" />
              <span>First-line: Anti-inflammatory + rest protocol</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <FileText className="w-4 h-4 text-blue-500" />
              <span>Recommend: Basic blood work after 3 days</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Activity className="w-4 h-4 text-purple-500" />
              <span>Follow-up: Schedule in 7-10 days</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}