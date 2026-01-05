import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Plus, X, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const timeSlots = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM',
  '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM'
];

export default function AvailabilityManager({ availability = [], onSave }) {
  const [schedule, setSchedule] = useState(
    days.reduce((acc, day) => {
      const existing = availability.find(a => a.day === day);
      acc[day] = existing?.slots || [];
      return acc;
    }, {})
  );

  const toggleSlot = (day, slot) => {
    setSchedule(prev => ({
      ...prev,
      [day]: prev[day].includes(slot)
        ? prev[day].filter(s => s !== slot)
        : [...prev[day], slot]
    }));
  };

  const handleSave = () => {
    const formattedAvailability = Object.entries(schedule)
      .filter(([_, slots]) => slots.length > 0)
      .map(([day, slots]) => ({ day, slots }));
    onSave(formattedAvailability);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Manage Availability
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {days.map((day) => (
            <div key={day} className="border-b border-gray-100 pb-4 last:border-0">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">{day}</h3>
                <Badge variant="secondary">
                  {schedule[day].length} slots
                </Badge>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {timeSlots.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => toggleSlot(day, slot)}
                    className={`px-2 py-1.5 text-xs rounded-lg border transition-all ${
                      schedule[day].includes(slot)
                        ? 'border-teal-500 bg-teal-50 text-teal-700 font-medium'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <Button onClick={handleSave} className="w-full mt-6 bg-teal-500 hover:bg-teal-600">
          <Save className="w-4 h-4 mr-2" />
          Save Availability
        </Button>
      </CardContent>
    </Card>
  );
}