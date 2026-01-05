export default 
{
  "name": "PharmacyOrder",
  "type": "object",
  "properties": {
    "prescription_id": {
      "type": "string"
    },
    "patient_email": {
      "type": "string"
    },
    "patient_name": {
      "type": "string"
    },
    "patient_phone": {
      "type": "string"
    },
    "pharmacy_name": {
      "type": "string"
    },
    "pharmacy_id": {
      "type": "string"
    },
    "medicines": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "medicine_name": {
            "type": "string"
          },
          "quantity": {
            "type": "number"
          },
          "price": {
            "type": "number"
          }
        }
      }
    },
    "total_amount": {
      "type": "number"
    },
    "delivery_address": {
      "type": "object",
      "properties": {
        "address_line1": {
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
    "status": {
      "type": "string",
      "enum": [
        "placed",
        "accepted",
        "preparing",
        "out_for_delivery",
        "delivered",
        "cancelled"
      ],
      "default": "placed"
    },
    "order_number": {
      "type": "string"
    },
    "placed_at": {
      "type": "string",
      "format": "date-time"
    },
    "estimated_delivery": {
      "type": "string"
    }
  },
  "required": [
    "prescription_id",
    "patient_email",
    "medicines"
  ]
};
