export default 
{
  "name": "LabTest",
  "type": "object",
  "properties": {
    "name": {
      "type": "string"
    },
    "code": {
      "type": "string"
    },
    "category": {
      "type": "string",
      "enum": [
        "blood",
        "urine",
        "imaging",
        "cardiac",
        "diabetes",
        "thyroid",
        "liver",
        "kidney",
        "vitamin",
        "allergy",
        "covid",
        "full_body",
        "women_health",
        "men_health"
      ]
    },
    "description": {
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
    "sample_type": {
      "type": "string"
    },
    "fasting_required": {
      "type": "boolean",
      "default": false
    },
    "fasting_hours": {
      "type": "number"
    },
    "report_time": {
      "type": "string",
      "description": "e.g., '6-8 hours', 'Same day'"
    },
    "home_collection": {
      "type": "boolean",
      "default": true
    },
    "parameters_count": {
      "type": "number"
    },
    "parameters": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "preparation_instructions": {
      "type": "string"
    },
    "popular": {
      "type": "boolean",
      "default": false
    }
  },
  "required": [
    "name",
    "price",
    "category"
  ]
};
