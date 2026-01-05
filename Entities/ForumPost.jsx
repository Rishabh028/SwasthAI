export default {
  "name": "ForumPost",
  "type": "object",
  "properties": {
    "title": {
      "type": "string"
    },
    "content": {
      "type": "string"
    },
    "category": {
      "type": "string",
      "enum": [
        "general",
        "mental_health",
        "fitness",
        "nutrition",
        "diseases",
        "lifestyle",
        "women_health",
        "child_health"
      ]
    },
    "author_email": {
      "type": "string"
    },
    "author_name": {
      "type": "string"
    },
    "upvotes": {
      "type": "number",
      "default": 0
    },
    "upvoted_by": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "default": []
    },
    "replies_count": {
      "type": "number",
      "default": 0
    },
    "is_pinned": {
      "type": "boolean",
      "default": false
    },
    "is_locked": {
      "type": "boolean",
      "default": false
    },
    "status": {
      "type": "string",
      "enum": [
        "active",
        "flagged",
        "removed"
      ],
      "default": "active"
    }
  },
  "required": [
    "title",
    "content",
    "author_email",
    "author_name"
  ]
};

