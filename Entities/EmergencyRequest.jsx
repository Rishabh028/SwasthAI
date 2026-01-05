export default 
{
  "name": "EmergencyRequest",
  "type": "object",
  "properties": {
    "request_number": {
      "type": "string"
    },
    "emergency_type": {
      "type": "string",
      "enum": [
        "medical",
        "accident",
        "cardiac",
        "pregnancy",
        "other"
      ]
    },
    "patient_name": {
      "type": "string"
    },
    "patient_age": {
      "type": "number"
    },
    "patient_gender": {
      "type": "string",
      "enum": [
        "male",
        "female",
        "other"
      ]
    },
    "symptoms": {
      "type": "string"
    },
    "situation_description": {
      "type": "string"
    },
    "location": {
      "type": "object",
      "properties": {
        "address": {
          "type": "string"
        },
        "latitude": {
          "type": "number"
        },
        "longitude": {
          "type": "number"
        }
      }
    },
    "contact_phone": {
      "type": "string"
    },
    "requester_email": {
      "type": "string"
    },
    "attached_media": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "status": {
      "type": "string",
      "enum": [
        "pending",
        "acknowledged",
        "ambulance_dispatched",
        "help_arrived",
        "completed",
        "cancelled"
      ],
      "default": "pending"
    },
    "acknowledged_by": {
      "type": "string"
    },
    "ambulance_eta": {
      "type": "string"
    },
    "nearby_hospitals_notified": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "priority": {
      "type": "string",
      "enum": [
        "low",
        "medium",
        "high",
        "critical"
      ],
      "default": "high"
    }
  },
  "required": [
    "emergency_type",
    "patient_name",
    "contact_phone",
    "location"
  ]
};
