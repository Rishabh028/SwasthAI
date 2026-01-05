export default 
{
  "name": "LabBooking",
  "type": "object",
  "properties": {
    "booking_number": {
      "type": "string"
    },
    "tests": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "test_id": {
            "type": "string"
          },
          "test_name": {
            "type": "string"
          },
          "price": {
            "type": "number"
          }
        }
      }
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
    "patient_phone": {
      "type": "string"
    },
    "collection_type": {
      "type": "string",
      "enum": [
        "home",
        "lab"
      ],
      "default": "home"
    },
    "collection_address": {
      "type": "object",
      "properties": {
        "address_line1": {
          "type": "string"
        },
        "address_line2": {
          "type": "string"
        },
        "city": {
          "type": "string"
        },
        "pincode": {
          "type": "string"
        }
      }
    },
    "collection_date": {
      "type": "string",
      "format": "date"
    },
    "collection_slot": {
      "type": "string"
    },
    "total_amount": {
      "type": "number"
    },
    "payment_status": {
      "type": "string",
      "enum": [
        "pending",
        "paid",
        "refunded"
      ],
      "default": "pending"
    },
    "status": {
      "type": "string",
      "enum": [
        "booked",
        "sample_collected",
        "processing",
        "report_ready",
        "cancelled"
      ],
      "default": "booked"
    },
    "report_url": {
      "type": "string"
    },
    "lab_name": {
      "type": "string"
    }
  },
  "required": [
    "tests",
    "patient_name",
    "collection_date",
    "collection_slot"
  ]
};
