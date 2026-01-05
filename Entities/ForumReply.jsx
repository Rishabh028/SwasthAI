export default 
{
  "name": "ForumReply",
  "type": "object",
  "properties": {
    "post_id": {
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
    "is_helpful": {
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
    "post_id",
    "content",
    "author_email",
    "author_name"
  ]
};
