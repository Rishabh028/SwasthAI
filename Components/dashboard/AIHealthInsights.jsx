import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import {
  Brain,
  AlertCircle,
  CheckCircle,
  TestTube,
  TrendingUp,
  X,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';

const priorityColors = {
  low: 'bg-blue-100 text-blue-700 border-blue-200',
  medium: 'bg-amber-100 text-amber-700 border-amber-200',
  high: 'bg-orange-100 text-orange-700 border-orange-200',
  urgent: 'bg-red-100 text-red-700 border-red-200'
};

const priorityIcons = {
  low: CheckCircle,
  medium: AlertCircle,
  high: AlertCircle,
  urgent: AlertCircle
};

export default function AIHealthInsights({ userEmail }) {
  const queryClient = useQueryClient();

  const { data: insights = [], isLoading } = useQuery({
    queryKey: ['healthInsights', userEmail],
    queryFn: () => base44.entities.HealthInsight.filter({ 
      user_email: userEmail, 
      is_dismissed: false 
    }, '-created_date'),
    enabled: !!userEmail
  });

  const dismissInsight = useMutation({
    mutationFn: (insightId) => 
      base44.entities.HealthInsight.update(insightId, { is_dismissed: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['healthInsights'] });
      toast.success('Insight dismissed');
    }
  });

  const generateInsights = useMutation({
    mutationFn: async () => {
      const records = await base44.entities.HealthRecord.filter({ created_by: userEmail });
      
      if (records.length === 0) {
        throw new Error('No health records found');
      }

      const analysisPrompt = `Analyze the following health records and provide personalized health recommendations:

${records.map(r => `
- ${r.title} (${r.record_type})
  Date: ${r.record_date}
  Doctor: ${r.doctor_name || 'N/A'}
  Notes: ${r.notes || 'N/A'}
  Extracted Data: ${r.extracted_data ? JSON.stringify(r.extracted_data) : 'N/A'}
`).join('\n')}

Provide 3-5 actionable insights in JSON format with the following structure:
{
  "insights": [
    {
      "type": "recommendation" | "alert" | "test_suggestion" | "lifestyle_tip",
      "title": "Brief title",
      "description": "Detailed explanation",
      "priority": "low" | "medium" | "high" | "urgent",
      "suggested_tests": ["test1", "test2"] (optional)
    }
  ]
}`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: analysisPrompt,
        response_json_schema: {
          type: 'object',
          properties: {
            insights: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  type: { type: 'string' },
                  title: { type: 'string' },
                  description: { type: 'string' },
                  priority: { type: 'string' },
                  suggested_tests: { type: 'array', items: { type: 'string' } }
                }
              }
            }
          }
        }
      });

      // Create insights in database
      const createdInsights = await Promise.all(
        response.insights.map(insight =>
          base44.entities.HealthInsight.create({
            user_email: userEmail,
            insight_type: insight.type,
            title: insight.title,
            description: insight.description,
            priority: insight.priority || 'medium',
            suggested_tests: insight.suggested_tests || [],
            related_records: records.map(r => r.id)
          })
        )
      );

      return createdInsights;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['healthInsights'] });
      toast.success('AI insights generated successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to generate insights');
    }
  });

  const unreadInsights = insights.filter(i => !i.is_read);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-500" />
            AI Health Insights
          </CardTitle>
          <Button
            size="sm"
            variant="outline"
            onClick={() => generateInsights.mutate()}
            disabled={generateInsights.isPending}
            className="text-purple-600 border-purple-200 hover:bg-purple-50"
          >
            {generateInsights.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Generate Insights
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
          </div>
        ) : insights.length === 0 ? (
          <div className="text-center py-8">
            <Brain className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-4">
              Upload health records to get personalized AI insights
            </p>
            <Button
              onClick={() => generateInsights.mutate()}
              disabled={generateInsights.isPending}
              className="bg-purple-500 hover:bg-purple-600"
            >
              <Brain className="w-4 h-4 mr-2" />
              Generate Insights
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {insights.map((insight, index) => {
              const PriorityIcon = priorityIcons[insight.priority];
              return (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-4 rounded-xl border-2 ${priorityColors[insight.priority]}`}
                >
                  <div className="flex items-start gap-3">
                    <PriorityIcon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-semibold text-sm">{insight.title}</h4>
                        <button
                          onClick={() => dismissInsight.mutate(insight.id)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs opacity-90 mb-2">
                        {insight.description}
                      </p>
                      {insight.suggested_tests?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {insight.suggested_tests.map((test, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              <TestTube className="w-3 h-3 mr-1" />
                              {test}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}