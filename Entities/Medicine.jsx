export default {
   "name": "Medicine",
  "type": "object",
  "properties": {
    "name": {
      "type": "string"
    },
    "generic_name": {
      "type": "string"
    },
    "manufacturer": {
      "type": "string"
    },
    "category": {
      "type": "string",
      "enum": [
        "tablet",
        "capsule",
        "syrup",
        "injection",
        "cream",
        "drops",
        "inhaler",
        "powder",
        "gel",
        "spray"
      ]
    },
    "therapeutic_class": {
      "type": "string"
    },
    "price": {
      "type": "number"
    },
    "mrp": {
      "type": "number"
    },
    "discount_percent": {
      "type": "number",
      "default": 0
    },
    "pack_size": {
      "type": "string"
    },
    "prescription_required": {
      "type": "boolean",
      "default": false
    },
    "in_stock": {
      "type": "boolean",
      "default": true
    },
    "image_url": {
      "type": "string"
    },
    "description": {
      "type": "string"
    },
    "usage_instructions": {
      "type": "string"
    },
    "side_effects": {
      "type": "string"
    }
  },
  "required": [
    "name",
    "price"
  ] 
};