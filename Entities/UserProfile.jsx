export default 
{
  "name": "UserProfile",
  "type": "object",
  "properties": {
    "phone": {
      "type": "string"
    },
    "date_of_birth": {
      "type": "string",
      "format": "date"
    },
    "gender": {
      "type": "string",
      "enum": [
        "male",
        "female",
        "other"
      ]
    },
    "blood_group": {
      "type": "string",
      "enum": [
        "A+",
        "A-",
        "B+",
        "B-",
        "AB+",
        "AB-",
        "O+",
        "O-"
      ]
    },
    "height_cm": {
      "type": "number"
    },
    "weight_kg": {
      "type": "number"
    },
    "allergies": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "chronic_conditions": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "current_medications": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "emergency_contact": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string"
        },
        "phone": {
          "type": "string"
        },
        "relation": {
          "type": "string"
        }
      }
    },
    "addresses": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "label": {
            "type": "string"
          },
          "address_line1": {
            "type": "string"
          },
          "address_line2": {
            "type": "string"
          },
          "city": {
            "type": "string"
          },
          "state": {
            "type": "string"
          },
          "pincode": {
            "type": "string"
          },
          "is_default": {
            "type": "boolean"
          }
        }
      }
    },
    "abha_id": {
      "type": "string",
      "description": "Ayushman Bharat Health Account ID"
    },
    "abha_linked": {
      "type": "boolean",
      "default": false
    },
    "preferred_language": {
      "type": "string",
      "default": "en"
    },
    "notification_preferences": {
      "type": "object",
      "properties": {
        "sms": {
          "type": "boolean",
          "default": true
        },
        "email": {
          "type": "boolean",
          "default": true
        },
        "push": {
          "type": "boolean",
          "default": true
        },
        "whatsapp": {
          "type": "boolean",
          "default": false
        }
      }
    }
  },
  "required": []
};
