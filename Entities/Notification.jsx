export default 
{
  "name": "Notification",
  "type": "object",
  "properties": {
    "recipient_email": {
      "type": "string"
    },
    "title": {
      "type": "string"
    },
    "message": {
      "type": "string"
    },
    "type": {
      "type": "string",
      "enum": [
        "appointment",
        "order",
        "lab_test",
        "general",
        "promotion"
      ],
      "default": "general"
    },
    "is_read": {
      "type": "boolean",
      "default": false
    },
    "link": {
      "type": "string"
    },
    "priority": {
      "type": "string",
      "enum": [
        "low",
        "medium",
        "high"
      ],
      "default": "medium"
    }
  },
  "required": [
    "recipient_email",
    "title",
    "message"
  ]
};
