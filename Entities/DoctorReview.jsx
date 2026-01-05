export default 
{
  "name": "DoctorReview",
  "type": "object",
  "properties": {
    "doctor_id": {
      "type": "string"
    },
    "patient_email": {
      "type": "string"
    },
    "patient_name": {
      "type": "string"
    },
    "appointment_id": {
      "type": "string"
    },
    "rating": {
      "type": "number",
      "minimum": 1,
      "maximum": 5
    },
    "review": {
      "type": "string"
    },
    "would_recommend": {
      "type": "boolean",
      "default": true
    }
  },
  "required": [
    "doctor_id",
    "patient_email",
    "rating"
  ]
};