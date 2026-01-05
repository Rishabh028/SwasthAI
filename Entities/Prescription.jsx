export default 
{
  "name": "Prescription",
  "type": "object",
  "properties": {
    "appointment_id": {
      "type": "string"
    },
    "patient_email": {
      "type": "string"
    },
    "patient_name": {
      "type": "string"
    },
    "doctor_email": {
      "type": "string"
    },
    "doctor_name": {
      "type": "string"
    },
    "doctor_qualification": {
      "type": "string"
    },
    "doctor_registration": {
      "type": "string",
      "description": "NMC/Medical registration number"
    },
    "diagnosis": {
      "type": "string"
    },
    "symptoms": {
      "type": "string"
    },
    "medicines": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "medicine_id": {
            "type": "string"
          },
          "medicine_name": {
            "type": "string"
          },
          "dosage": {
            "type": "string"
          },
          "frequency": {
            "type": "string"
          },
          "duration": {
            "type": "string"
          },
          "instructions": {
            "type": "string"
          },
          "quantity": {
            "type": "number"
          }
        }
      }
    },
    "tests_recommended": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "special_instructions": {
      "type": "string"
    },
    "follow_up_date": {
      "type": "string",
      "format": "date"
    },
    "digital_signature": {
      "type": "string",
      "description": "Doctor ID + timestamp hash"
    },
    "prescription_number": {
      "type": "string",
      "description": "Unique prescription identifier"
    },
    "issued_at": {
      "type": "string",
      "format": "date-time"
    },
    "pdf_url": {
      "type": "string"
    },
    "shared_with_pharmacies": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "status": {
      "type": "string",
      "enum": [
        "draft",
        "issued",
        "dispensed"
      ],
      "default": "issued"
    }
  },
  "required": [
    "patient_email",
    "doctor_email",
    "medicines"
  ]
};
