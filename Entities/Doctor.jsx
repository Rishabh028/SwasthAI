export default {
  "name": "Doctor",
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "Full name of the doctor"
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
      ],
      "description": "Medical specialization"
    },
    "qualification": {
      "type": "string",
      "description": "Medical qualifications (MBBS, MD, etc.)"
    },
    "experience_years": {
      "type": "number",
      "description": "Years of experience"
    },
    "consultation_fee": {
      "type": "number",
      "description": "Consultation fee in INR"
    },
    "rating": {
      "type": "number",
      "description": "Average rating (1-5)"
    },
    "total_reviews": {
      "type": "number",
      "default": 0
    },
    "hospital_name": {
      "type": "string"
    },
    "location": {
      "type": "string",
      "description": "City/Area"
    },
    "latitude": {
      "type": "number"
    },
    "longitude": {
      "type": "number"
    },
    "languages": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "available_days": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "available_slots": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "profile_image": {
      "type": "string"
    },
    "is_video_consultation": {
      "type": "boolean",
      "default": true
    },
    "is_clinic_visit": {
      "type": "boolean",
      "default": true
    },
    "bio": {
      "type": "string"
    },
    "verified": {
      "type": "boolean",
      "default": false
    }
  },
  "required": [
    "name",
    "specialization",
    "qualification",
    "consultation_fee"
  ]
};