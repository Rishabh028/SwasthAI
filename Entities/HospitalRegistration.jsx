export default 
{
  "name": "HospitalRegistration",
  "type": "object",
  "properties": {
    "hospital_name": {
      "type": "string"
    },
    "hospital_type": {
      "type": "string",
      "enum": [
        "hospital",
        "clinic",
        "nursing_home",
        "specialty_center",
        "diagnostic_center"
      ]
    },
    "owner_email": {
      "type": "string"
    },
    "hospital_listing_id": {
      "type": "string",
      "description": "Reference to public Hospital listing entity"
    },
    "address": {
      "type": "object",
      "properties": {
        "street": {
          "type": "string"
        },
        "area": {
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
        }
      }
    },
    "latitude": {
      "type": "number"
    },
    "longitude": {
      "type": "number"
    },
    "contact_phone": {
      "type": "string"
    },
    "contact_email": {
      "type": "string"
    },
    "departments": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "total_doctors": {
      "type": "number"
    },
    "has_emergency_services": {
      "type": "boolean",
      "default": false
    },
    "has_icu": {
      "type": "boolean",
      "default": false
    },
    "has_ambulance": {
      "type": "boolean",
      "default": false
    },
    "is_24x7": {
      "type": "boolean",
      "default": false
    },
    "visiting_hours": {
      "type": "string"
    },
    "insurance_supported": {
      "type": "boolean",
      "default": false
    },
    "registration_certificate_url": {
      "type": "string"
    },
    "trade_license_url": {
      "type": "string"
    },
    "authorized_rep_id_url": {
      "type": "string"
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
    "rejection_reason": {
      "type": "string"
    }
  },
  "required": [
    "hospital_name",
    "hospital_type",
    "owner_email",
    "contact_phone"
  ]
};
