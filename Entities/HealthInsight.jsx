export default 
{
  "name": "HealthInsight",
  "type": "object",
  "properties": {
    "user_email": {
      "type": "string"
    },
    "insight_type": {
      "type": "string",
      "enum": [
        "recommendation",
        "alert",
        "test_suggestion",
        "lifestyle_tip"
      ]
    },
    "title": {
      "type": "string"
    },
    "description": {
      "type": "string"
    },
    "priority": {
      "type": "string",
      "enum": [
        "low",
        "medium",
        "high",
        "urgent"
      ],
      "default": "medium"
    },
    "related_records": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "suggested_tests": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "is_read": {
      "type": "boolean",
      "default": false
    },
    "is_dismissed": {
      "type": "boolean",
      "default": false
    }
  },
  "required": [
    "user_email",
    "insight_type",
    "title",
    "description"
  ]
};
