export default 
{
  "name": "Hospital",
  "type": "object",
  "properties": {
    "name": {
      "type": "string"
    },
    "type": {
      "type": "string",
      "enum": [
        "hospital",
        "clinic",
        "nursing_home",
        "specialty_center",
        "diagnostic_center"
      ]
    },
    "description": {
      "type": "string"
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
    "contact": {
      "type": "object",
      "properties": {
        "phone": {
          "type": "string"
        },
        "emergency_phone": {
          "type": "string"
        },
        "email": {
          "type": "string"
        }
      }
    },
    "departments": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "cardiology",
          "orthopedic",
          "pediatrics",
          "gynecology",
          "neurology",
          "dermatology",
          "ent",
          "ophthalmology",
          "emergency",
          "icu",
          "general_medicine"
        ]
      }
    },
    "facilities": {
      "type": "object",
      "properties": {
        "emergency_ward": {
          "type": "boolean",
          "default": false
        },
        "icu": {
          "type": "boolean",
          "default": false
        },
        "ambulance": {
          "type": "boolean",
          "default": false
        },
        "operation_theatre": {
          "type": "boolean",
          "default": false
        },
        "diagnostic_lab": {
          "type": "boolean",
          "default": false
        },
        "pharmacy": {
          "type": "boolean",
          "default": false
        },
        "blood_bank": {
          "type": "boolean",
          "default": false
        }
      }
    },
    "availability": {
      "type": "object",
      "properties": {
        "is_24x7": {
          "type": "boolean",
          "default": false
        },
        "visiting_hours": {
          "type": "string"
        },
        "emergency_hours": {
          "type": "string"
        }
      }
    },
    "category": {
      "type": "string",
      "enum": [
        "government",
        "private"
      ],
      "default": "private"
    },
    "insurance_supported": {
      "type": "boolean",
      "default": false
    },
    "cashless_available": {
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
    },
    "total_doctors": {
      "type": "number",
      "default": 0
    },
    "verified": {
      "type": "boolean",
      "default": false
    },
    "is_active": {
      "type": "boolean",
      "default": false
    },
    "is_published": {
      "type": "boolean",
      "default": false
    },
    "owner_email": {
      "type": "string"
    },
    "registration_id": {
      "type": "string",
      "description": "Reference to HospitalRegistration entity"
    },
    "registration_certificate": {
      "type": "string"
    },
    "trade_license": {
      "type": "string"
    }
  },
  "required": [
    "name",
    "type",
    "latitude",
    "longitude"
  ]
};
