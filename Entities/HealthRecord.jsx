export default 
{
  "name": "HealthRecord",
  "type": "object",
  "properties": {
    "title": {
      "type": "string"
    },
    "record_type": {
      "type": "string",
      "enum": [
        "prescription",
        "lab_report",
        "discharge_summary",
        "vaccination",
        "imaging",
        "insurance",
        "other"
      ]
    },
    "record_date": {
      "type": "string",
      "format": "date"
    },
    "doctor_name": {
      "type": "string"
    },
    "hospital_name": {
      "type": "string"
    },
    "file_url": {
      "type": "string"
    },
    "file_type": {
      "type": "string"
    },
    "notes": {
      "type": "string"
    },
    "tags": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "is_shared_with_doctor": {
      "type": "boolean",
      "default": false
    },
    "extracted_data": {
      "type": "object",
      "description": "AI-extracted data from the document"
    },
    "linked_records": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "IDs of related records"
    },
    "shared_with": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "List of doctors/emails this record is shared with"
    }
  },
  "required": [
    "title",
    "record_type",
    "record_date"
  ]
};
