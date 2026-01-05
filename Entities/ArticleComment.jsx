export default {
  "name": "ArticleComment",
  "type": "object",
  "properties": {
    "article_id": {
      "type": "string"
    },
    "content": {
      "type": "string"
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
    "article_id",
    "content",
    "author_email",
    "author_name"
  ]
};