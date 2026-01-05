export default 
{
  "name": "LabPartner",
  "type": "object",
  "properties": {
    "partner_user_email": {
      "type": "string"
    },
    "lab_name": {
      "type": "string"
    },
    "license_number": {
      "type": "string"
    },
    "nabl_accredited": {
      "type": "boolean",
      "default": false
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
    "lab_address": {
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
    "contact_phone": {
      "type": "string"
    },
    "contact_email": {
      "type": "string"
    },
    "operating_hours": {
      "type": "object",
      "properties": {
        "weekdays": {
          "type": "string"
        },
        "weekends": {
          "type": "string"
        }
      }
    },
    "services_offered": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "home_collection": {
      "type": "boolean",
      "default": true
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
    },
    "tests_available": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Array of LabTest IDs available at this lab"
    }
  },
  "required": [
    "partner_user_email",
    "lab_name",
    "license_number"
  ]
};
