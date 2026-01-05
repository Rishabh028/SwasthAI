import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  PhoneOff, 
  MessageSquare,
  Settings,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function VideoCallInterface({ meetingLink, patientName, doctorName }) {
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);

  return (
    <div className="fixed inset-0 bg-slate-900 z-50">
      {/* Video Grid */}
      <div className="h-full p-4 flex flex-col">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Remote Video */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-slate-800 rounded-2xl overflow-hidden"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 bg-teal-500 rounded-full flex items-center justify-center">
                <span className="text-3xl text-white font-bold">
                  {doctorName?.charAt(0) || 'D'}
                </span>
              </div>
            </div>
            <div className="absolute bottom-4 left-4">
              <p className="text-white font-medium">{doctorName || 'Doctor'}</p>
            </div>
          </motion.div>

          {/* Local Video */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-slate-800 rounded-2xl overflow-hidden"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-3xl text-white font-bold">
                  {patientName?.charAt(0) || 'Y'}
                </span>
              </div>
            </div>
            <div className="absolute bottom-4 left-4">
              <p className="text-white font-medium">You</p>
            </div>
          </motion.div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <Button
            size="lg"
            variant={isAudioOn ? 'secondary' : 'destructive'}
            onClick={() => setIsAudioOn(!isAudioOn)}
            className="rounded-full w-14 h-14"
          >
            {isAudioOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </Button>

          <Button
            size="lg"
            variant={isVideoOn ? 'secondary' : 'destructive'}
            onClick={() => setIsVideoOn(!isVideoOn)}
            className="rounded-full w-14 h-14"
          >
            {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </Button>

          <Button
            size="lg"
            className="bg-red-500 hover:bg-red-600 rounded-full w-14 h-14"
          >
            <PhoneOff className="w-5 h-5" />
          </Button>

          <Button
            size="lg"
            variant="secondary"
            className="rounded-full w-14 h-14"
          >
            <MessageSquare className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Info Banner */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-800/90 backdrop-blur-sm rounded-full px-6 py-3 text-white">
        <p className="text-sm">
          This is a demo video call interface. 
          <a href={meetingLink} target="_blank" rel="noopener noreferrer" className="ml-2 underline">
            Join actual meeting →
          </a>
        </p>
      </div>
    </div>
  );
}