export default 
{
  "name": "HealthCoachChat",
  "type": "object",
  "properties": {
    "title": {
      "type": "string"
    },
    "messages": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "role": {
            "type": "string",
            "enum": [
              "user",
              "assistant"
            ]
          },
          "content": {
            "type": "string"
          },
          "timestamp": {
            "type": "string"
          }
        }
      }
    },
    "topic": {
      "type": "string",
      "enum": [
        "nutrition",
        "fitness",
        "mental_health",
        "sleep",
        "chronic_care",
        "general",
        "medication"
      ]
    },
    "health_goals": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "status": {
      "type": "string",
      "enum": [
        "active",
        "archived"
      ],
      "default": "active"
    }
  },
  "required": [
    "title"
  ]
};
