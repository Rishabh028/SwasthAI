export default 
{
  "name": "DoctorProfile",
  "type": "object",
  "properties": {
    "doctor_user_email": {
      "type": "string",
      "description": "Email of the doctor (linked to User entity)"
    },
    "doctor_listing_id": {
      "type": "string",
      "description": "Reference to public Doctor listing entity"
    },
    "nmc_registration": {
      "type": "string",
      "description": "National Medical Commission registration number"
    },
    "verification_status": {
      "type": "string",
      "enum": [
        "pending",
        "verified",
        "rejected"
      ],
      "default": "pending"
    },
    "verification_documents": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "specialization": {
      "type": "string",
      "enum": [
        "general_physician",
        "cardiologist",
        "dermatologist",
        "orthopedic",
        "pediatrician",
        "gynecologist",
        "neurologist",
        "psychiatrist",
        "ent",
        "ophthalmologist",
        "dentist",
        "ayurveda",
        "homeopathy"
      ]
    },
    "qualification": {
      "type": "string"
    },
    "experience_years": {
      "type": "number"
    },
    "consultation_fee": {
      "type": "number"
    },
    "hospital_name": {
      "type": "string"
    },
    "clinic_address": {
      "type": "object",
      "properties": {
        "address_line1": {
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
        "latitude": {
          "type": "number"
        },
        "longitude": {
          "type": "number"
        }
      }
    },
    "availability": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "day": {
            "type": "string"
          },
          "slots": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "time": {
                  "type": "string"
                },
                "type": {
                  "type": "string",
                  "enum": [
                    "video",
                    "clinic",
                    "both"
                  ]
                },
                "max_patients": {
                  "type": "number"
                }
              }
            }
          }
        }
      }
    },
    "is_video_consultation": {
      "type": "boolean",
      "default": true
    },
    "is_clinic_visit": {
      "type": "boolean",
      "default": true
    },
    "languages": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "bio": {
      "type": "string"
    },
    "profile_image": {
      "type": "string"
    },
    "is_active": {
      "type": "boolean",
      "default": false
    },
    "is_published": {
      "type": "boolean",
      "default": false
    },
    "rating": {
      "type": "number",
      "default": 0
    },
    "total_reviews": {
      "type": "number",
      "default": 0
    }
  },
  "required": [
    "doctor_user_email",
    "nmc_registration",
    "specialization",
    "qualification"
  ]
};