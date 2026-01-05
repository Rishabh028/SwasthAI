import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Video, VideoOff, Mic, MicOff, PhoneOff, 
  MonitorUp, Users, Clock, Wifi, WifiOff,
  FileText, Pill, AlertCircle, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'react-hot-toast';
import DoctorConsultationPanel from './DoctorConsultationPanel';

export default function VideoConsultationRoom({ 
  appointment, 
  userRole,
  onEnd,
  user 
}) {
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [showPanel, setShowPanel] = useState(userRole === 'doctor');
  const [callDuration, setCallDuration] = useState(0);
  const [connectionQuality, setConnectionQuality] = useState('excellent');
  const [callStatus, setCallStatus] = useState('connecting');
  const jitsiContainerRef = useRef(null);
  const jitsiApiRef = useRef(null);
  const timerRef = useRef(null);

  // Generate secure room name
  const roomName = `swasthai_${appointment.id}`.replace(/[^a-zA-Z0-9]/g, '');

  useEffect(() => {
    // Load Jitsi Meet API
    const script = document.createElement('script');
    script.src = 'https://meet.jit.si/external_api.js';
    script.async = true;
    script.onload = initializeJitsi;
    document.body.appendChild(script);

    return () => {
      if (jitsiApiRef.current) {
        jitsiApiRef.current.dispose();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      document.body.removeChild(script);
    };
  }, []);

  const initializeJitsi = () => {
    if (!window.JitsiMeetExternalAPI) return;

    const domain = 'meet.jit.si';
    const options = {
      roomName: roomName,
      width: '100%',
      height: '100%',
      parentNode: jitsiContainerRef.current,
      configOverwrite: {
        startWithAudioMuted: false,
        startWithVideoMuted: false,
        enableWelcomePage: false,
        prejoinPageEnabled: false,
        disableDeepLinking: true,
        enableE2EE: true, // End-to-end encryption
        p2p: { enabled: true }
      },
      interfaceConfigOverwrite: {
        SHOW_JITSI_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false,
        TOOLBAR_BUTTONS: [
          'microphone', 'camera', 'desktop', 
          'fullscreen', 'settings', 'stats'
        ],
        DEFAULT_BACKGROUND: '#1e293b',
        DISABLE_VIDEO_BACKGROUND: false,
      },
      userInfo: {
        email: user.email,
        displayName: userRole === 'doctor' 
          ? `Dr. ${appointment.doctor_name}` 
          : appointment.patient_name
      }
    };

    jitsiApiRef.current = new window.JitsiMeetExternalAPI(domain, options);

    // Event listeners
    jitsiApiRef.current.addEventListener('videoConferenceJoined', () => {
      setCallStatus('active');
      toast.success('Connected to consultation');
      
      // Start call timer
      timerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    });

    jitsiApiRef.current.addEventListener('readyToClose', handleEndCall);
    
    jitsiApiRef.current.addEventListener('audioMuteStatusChanged', (data) => {
      setIsAudioOn(!data.muted);
    });

    jitsiApiRef.current.addEventListener('videoMuteStatusChanged', (data) => {
      setIsVideoOn(!data.muted);
    });
  };

  const handleEndCall = async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    setCallStatus('ended');
    
    // Log consultation end
    if (onEnd) {
      await onEnd({
        duration: callDuration,
        ended_at: new Date().toISOString()
      });
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleToggleAudio = () => {
    if (jitsiApiRef.current) {
      jitsiApiRef.current.executeCommand('toggleAudio');
    }
  };

  const handleToggleVideo = () => {
    if (jitsiApiRef.current) {
      jitsiApiRef.current.executeCommand('toggleVideo');
    }
  };

  const handleLeaveCall = () => {
    if (window.confirm('Are you sure you want to end the consultation?')) {
      if (jitsiApiRef.current) {
        jitsiApiRef.current.executeCommand('hangup');
      }
      handleEndCall();
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900 z-50">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/50 to-transparent z-10 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
              {callStatus === 'active' ? 'Live' : 'Connecting...'}
            </Badge>
            {callStatus === 'active' && (
              <div className="flex items-center gap-2 text-white text-sm">
                <Clock className="w-4 h-4" />
                <span>{formatDuration(callDuration)}</span>
              </div>
            )}
            <Badge variant="outline" className="text-white border-white/30">
              {connectionQuality === 'excellent' ? <Wifi className="w-3 h-3 mr-1" /> : <WifiOff className="w-3 h-3 mr-1" />}
              {connectionQuality}
            </Badge>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right text-white">
              <p className="text-sm font-medium">
                {userRole === 'doctor' ? appointment.patient_name : `Dr. ${appointment.doctor_name}`}
              </p>
              <p className="text-xs text-gray-300">
                {appointment.consultation_type} consultation
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Video Container */}
      <div className={`h-full ${showPanel && userRole === 'doctor' ? 'pr-96' : ''} transition-all`}>
        <div ref={jitsiContainerRef} className="w-full h-full" />
      </div>

      {/* Doctor Panel Sidebar */}
      <AnimatePresence>
        {showPanel && userRole === 'doctor' && (
          <motion.div
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            transition={{ type: 'spring', damping: 25 }}
            className="absolute top-0 right-0 bottom-0 w-96 bg-white shadow-2xl overflow-y-auto"
          >
            <DoctorConsultationPanel 
              appointment={appointment}
              onClose={() => setShowPanel(false)}
              callDuration={callDuration}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Doctor Panel Toggle */}
      {userRole === 'doctor' && (
        <Button
          onClick={() => setShowPanel(!showPanel)}
          className="absolute bottom-24 right-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white"
          size="lg"
        >
          <FileText className="w-5 h-5 mr-2" />
          {showPanel ? 'Hide' : 'Show'} Patient Info
        </Button>
      )}

      {/* Controls Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent p-6">
        <div className="flex items-center justify-center gap-4">
          <Button
            size="lg"
            onClick={handleToggleAudio}
            className={`rounded-full w-14 h-14 ${isAudioOn ? 'bg-slate-700 hover:bg-slate-600' : 'bg-red-500 hover:bg-red-600'}`}
          >
            {isAudioOn ? <Mic className="w-5 h-5 text-white" /> : <MicOff className="w-5 h-5 text-white" />}
          </Button>

          <Button
            size="lg"
            onClick={handleToggleVideo}
            className={`rounded-full w-14 h-14 ${isVideoOn ? 'bg-slate-700 hover:bg-slate-600' : 'bg-red-500 hover:bg-red-600'}`}
          >
            {isVideoOn ? <Video className="w-5 h-5 text-white" /> : <VideoOff className="w-5 h-5 text-white" />}
          </Button>

          <Button
            size="lg"
            onClick={handleLeaveCall}
            className="bg-red-500 hover:bg-red-600 rounded-full w-16 h-16 shadow-lg"
          >
            <PhoneOff className="w-6 h-6 text-white" />
          </Button>
        </div>

        <div className="text-center mt-4 text-white/70 text-xs">
          <p>🔒 End-to-end encrypted • Secure consultation</p>
        </div>
      </div>

      {/* Connection Issues Alert */}
      {connectionQuality === 'poor' && (
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="absolute top-20 left-1/2 -translate-x-1/2 bg-amber-500 text-white px-6 py-3 rounded-full shadow-lg"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Poor connection detected</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}