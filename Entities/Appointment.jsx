export default {
  "name": "Appointment",
  "type": "object",
  "properties": {
    "doctor_id": {
      "type": "string",
      "description": "Reference to Doctor"
    },
    "patient_name": {
      "type": "string"
    },
    "patient_email": {
      "type": "string"
    },
    "patient_phone": {
      "type": "string"
    },
    "appointment_date": {
      "type": "string",
      "format": "date"
    },
    "appointment_time": {
      "type": "string"
    },
    "consultation_type": {
      "type": "string",
      "enum": [
        "video",
        "clinic",
        "chat"
      ],
      "default": "video"
    },
    "status": {
      "type": "string",
      "enum": [
        "pending",
        "confirmed",
        "rejected",
        "completed",
        "cancelled",
        "no_show"
      ],
      "default": "pending"
    },
    "symptoms": {
      "type": "string"
    },
    "notes": {
      "type": "string"
    },
    "doctor_notes": {
      "type": "string"
    },
    "rejection_reason": {
      "type": "string"
    },
    "prescription_url": {
      "type": "string"
    },
    "amount_paid": {
      "type": "number"
    },
    "payment_status": {
      "type": "string",
      "enum": [
        "pending",
        "paid",
        "refunded"
      ],
      "default": "pending"
    },
    "meeting_link": {
      "type": "string"
    },
    "doctor_name": {
      "type": "string"
    },
    "doctor_specialization": {
      "type": "string"
    }
  },
  "required": [
    "doctor_id",
    "patient_name",
    "appointment_date",
    "appointment_time"
  ]
};
