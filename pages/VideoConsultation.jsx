import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import VideoCallInterface from '@/components/appointments/VideoCallInterface';

export default function VideoConsultation() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const meetingLink = urlParams.get('link');
  const patientName = urlParams.get('patient');
  const doctorName = urlParams.get('doctor');

  useEffect(() => {
    if (!meetingLink) {
      navigate(createPageUrl('MyAppointments'));
    }
  }, [meetingLink, navigate]);

  if (!meetingLink) return null;

  return (
    <VideoCallInterface 
      meetingLink={meetingLink}
      patientName={patientName}
      doctorName={doctorName}
    />
  );
}