import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Loader2, Send, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import { base44 } from '@/api/base44Client';

export default function SmartSymptomInput({ onSubmit, isProcessing, userEmail }) {
  const [symptoms, setSymptoms] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [error, setError] = useState(null);
  const [voiceAvailable, setVoiceAvailable] = useState(true);
  const [interimTranscript, setInterimTranscript] = useState('');
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);
  const sessionIdRef = useRef(`voice-${Date.now()}`);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setVoiceAvailable(true);
    } else {
      setVoiceAvailable(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    };
  }, []);

  const toggleVoiceInput = async () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      toast.error('Voice input not supported in this browser');
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      setInterimTranscript('');
      return;
    }

    // Create new recognition instance
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onstart = () => {
      setIsListening(true);
      toast.success('🎤 Listening... speak now');
    };

    recognitionRef.current.onresult = (event) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcript + ' ';
        } else {
          interim += transcript;
        }
      }

      if (final) {
        setSymptoms(prev => (prev ? prev + ' ' : '') + final);
        setInterimTranscript('');
        
        // Save to database
        if (userEmail) {
          base44.entities.SymptomSession.create({
            session_id: sessionIdRef.current,
            symptoms: final.split(/\s+/).filter(s => s.length > 2),
            duration: 'voice_input',
            severity: 'moderate',
            additional_info: {
              input_mode: 'voice',
              language: 'en-US',
              user_email: userEmail
            },
            status: 'in_progress'
          }).catch(e => console.log('Save failed:', e));
        }
      } else {
        setInterimTranscript(interim);
      }
    };

    recognitionRef.current.onerror = (event) => {
      setIsListening(false);
      setInterimTranscript('');
      
      if (event.error === 'not-allowed') {
        toast.error('Microphone access denied. Check browser permissions.');
      } else if (event.error === 'no-speech') {
        toast.info('No speech detected. Try again.');
      }
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
      setInterimTranscript('');
    };

    try {
      sessionIdRef.current = `voice-${Date.now()}`;
      await recognitionRef.current.start();
    } catch (e) {
      toast.error('Could not start microphone');
      setIsListening(false);
    }
  };

  const handleSubmit = async () => {
    if (!symptoms.trim()) {
      toast.error('Please describe your symptoms');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    }

    // Save final submission to database
    try {
      await base44.entities.SymptomSession.create({
        session_id: sessionIdRef.current,
        symptoms: symptoms.split(/\s+/).filter(s => s.length > 2),
        duration: 'pending_analysis',
        severity: 'moderate',
        additional_info: {
          input_mode: isListening ? 'voice' : 'text',
          language: 'en-US',
          character_count: symptoms.length,
          word_count: symptoms.split(/\s+/).length,
          user_email: userEmail
        },
        status: 'completed'
      });
    } catch (e) {
      console.log('Session save failed:', e);
    }

    onSubmit({
      symptoms: symptoms.trim(),
      inputMode: isListening ? 'voice' : 'text',
      timestamp: new Date().toISOString(),
      language: 'en-US',
      sessionId: sessionIdRef.current
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="relative">
      {/* Input Container */}
      <motion.div
        animate={{
          boxShadow: isFocused
            ? '0 0 0 3px rgba(20, 184, 166, 0.1)'
            : '0 1px 3px rgba(0, 0, 0, 0.1)',
        }}
        className="relative bg-white rounded-2xl border-2 border-gray-200 transition-all"
      >
        <textarea
          ref={textareaRef}
          value={symptoms + (interimTranscript ? ' ' + interimTranscript : '')}
          onChange={(e) => setSymptoms(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyPress={handleKeyPress}
          placeholder="Describe how you're feeling (e.g., I have had a headache for 2 days with mild fever)"
          className="w-full px-6 py-4 pr-32 text-base resize-none focus:outline-none bg-transparent rounded-2xl min-h-[120px] max-h-[300px]"
          style={{ lineHeight: '1.6' }}
          rows={3}
          disabled={isProcessing}
          aria-label="Symptom description"
        />
        {interimTranscript && (
          <div className="absolute bottom-16 left-6 text-sm text-gray-400 italic">
            {interimTranscript}
          </div>
        )}

        {/* Voice Button */}
        <div className="absolute right-4 bottom-4 flex items-center gap-2">
          <AnimatePresence>
            {isListening && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="flex items-center gap-2 bg-red-50 px-3 py-1.5 rounded-full"
              >
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-xs font-medium text-red-700">Listening...</span>
              </motion.div>
            )}
          </AnimatePresence>

          {voiceAvailable && (
            <Button
              type="button"
              onClick={toggleVoiceInput}
              disabled={isProcessing}
              className={`rounded-full w-12 h-12 p-0 ${
                isListening
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                  : 'bg-teal-500 hover:bg-teal-600'
              }`}
              aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
            >
              {isListening ? (
                <MicOff className="w-5 h-5 text-white" />
              ) : (
                <Mic className="w-5 h-5 text-white" />
              )}
            </Button>
          )}

          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isProcessing || !symptoms.trim()}
            className="rounded-full w-12 h-12 p-0 bg-teal-600 hover:bg-teal-700"
            aria-label="Submit symptoms"
          >
            {isProcessing ? (
              <Loader2 className="w-5 h-5 text-white animate-spin" />
            ) : (
              <Send className="w-5 h-5 text-white" />
            )}
          </Button>
        </div>
      </motion.div>

      {/* Character Count */}
      <div className="flex items-center justify-between mt-2 px-2">
        <div className="text-xs text-gray-500">
          {symptoms.length > 0 && `${symptoms.length} characters`}
        </div>
        {error && (
          <div className="flex items-center gap-1 text-xs text-red-600">
            <AlertCircle className="w-3 h-3" />
            {error}
          </div>
        )}
      </div>

      {/* Help Text */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: isFocused ? 1 : 0.6, y: 0 }}
        className="mt-3 text-sm text-gray-500 text-center"
      >
        💡 Be specific: include duration, severity, and when symptoms started
      </motion.div>
    </div>
  );
}