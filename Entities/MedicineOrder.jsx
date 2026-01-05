export default 
{
  "name": "MedicineOrder",
  "type": "object",
  "properties": {
    "order_number": {
      "type": "string"
    },
    "items": {
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
          "quantity": {
            "type": "number"
          },
          "price": {
            "type": "number"
          }
        }
      }
    },
    "subtotal": {
      "type": "number"
    },
    "delivery_fee": {
      "type": "number",
      "default": 0
    },
    "discount": {
      "type": "number",
      "default": 0
    },
    "total_amount": {
      "type": "number"
    },
    "status": {
      "type": "string",
      "enum": [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "out_for_delivery",
        "delivered",
        "cancelled"
      ],
      "default": "pending"
    },
    "payment_status": {
      "type": "string",
      "enum": [
        "pending",
        "paid",
        "failed",
        "refunded"
      ],
      "default": "pending"
    },
    "payment_method": {
      "type": "string",
      "enum": [
        "cod",
        "upi",
        "card",
        "netbanking"
      ]
    },
    "delivery_address": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string"
        },
        "phone": {
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
        }
      }
    },
    "prescription_url": {
      "type": "string"
    },
    "estimated_delivery": {
      "type": "string",
      "format": "date"
    },
    "tracking_updates": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "status": {
            "type": "string"
          },
          "timestamp": {
            "type": "string"
          },
          "message": {
            "type": "string"
          }
        }
      }
    }
  },
  "required": [
    "items",
    "total_amount",
    "delivery_address"
  ]
};
