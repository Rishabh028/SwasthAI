export default 
{
  "name": "VideoConsultation",
  "type": "object",
  "properties": {
    "appointment_id": {
      "type": "string",
      "description": "Reference to appointment"
    },
    "session_token": {
      "type": "string",
      "description": "Secure session token for video room"
    },
    "room_id": {
      "type": "string",
      "description": "Unique video room identifier"
    },
    "doctor_email": {
      "type": "string"
    },
    "patient_email": {
      "type": "string"
    },
    "status": {
      "type": "string",
      "enum": [
        "scheduled",
        "active",
        "ended",
        "failed"
      ],
      "default": "scheduled"
    },
    "started_at": {
      "type": "string",
      "format": "date-time"
    },
    "ended_at": {
      "type": "string",
      "format": "date-time"
    },
    "duration_minutes": {
      "type": "number"
    },
    "participants_joined": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "connection_quality": {
      "type": "string",
      "enum": [
        "excellent",
        "good",
        "fair",
        "poor"
      ]
    },
    "call_metadata": {
      "type": "object",
      "description": "Non-sensitive call metrics"
    }
  },
  "required": [
    "appointment_id",
    "doctor_email",
    "patient_email"
  ]
};
