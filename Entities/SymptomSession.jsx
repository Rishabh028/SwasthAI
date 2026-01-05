export default 
{
  "name": "SymptomSession",
  "type": "object",
  "properties": {
    "session_id": {
      "type": "string"
    },
    "symptoms": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "duration": {
      "type": "string"
    },
    "severity": {
      "type": "string",
      "enum": [
        "mild",
        "moderate",
        "severe"
      ]
    },
    "additional_info": {
      "type": "object",
      "properties": {
        "age": {
          "type": "number"
        },
        "gender": {
          "type": "string"
        },
        "existing_conditions": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "medications": {
          "type": "array",
          "items": {
            "type": "string"
          }
        }
      }
    },
    "ai_assessment": {
      "type": "object",
      "properties": {
        "possible_conditions": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "name": {
                "type": "string"
              },
              "probability": {
                "type": "string"
              },
              "description": {
                "type": "string"
              }
            }
          }
        },
        "urgency_level": {
          "type": "string"
        },
        "recommended_specialist": {
          "type": "string"
        },
        "general_advice": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "when_to_seek_emergency": {
          "type": "array",
          "items": {
            "type": "string"
          }
        }
      }
    },
    "status": {
      "type": "string",
      "enum": [
        "in_progress",
        "completed",
        "converted_to_appointment"
      ],
      "default": "in_progress"
    },
    "converted_appointment_id": {
      "type": "string"
    }
  },
  "required": [
    "symptoms"
  ]
};
