export default {
  "name": "Article",
  "type": "object",
  "properties": {
    "title": {
      "type": "string"
    },
    "slug": {
      "type": "string"
    },
    "excerpt": {
      "type": "string"
    },
    "content": {
      "type": "string"
    },
    "cover_image": {
      "type": "string"
    },
    "category": {
      "type": "string",
      "enum": [
        "nutrition",
        "fitness",
        "mental_health",
        "diseases",
        "lifestyle",
        "women_health",
        "child_health",
        "senior_care",
        "preventive_care"
      ]
    },
    "tags": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "author_name": {
      "type": "string"
    },
    "author_image": {
      "type": "string"
    },
    "author_credentials": {
      "type": "string"
    },
    "read_time_minutes": {
      "type": "number"
    },
    "views": {
      "type": "number",
      "default": 0
    },
    "likes": {
      "type": "number",
      "default": 0
    },
    "is_featured": {
      "type": "boolean",
      "default": false
    },
    "is_published": {
      "type": "boolean",
      "default": true
    }
  },
  "required": [
    "title",
    "content",
    "category"
  ]
};
