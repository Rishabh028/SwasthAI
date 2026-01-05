// Base44 API Client with Real Endpoints
const APP_ID = '6952d2f6292d9e983a249381';
const API_KEY = '4832057683cb4da89022fefc99777816';
const BASE_URL = `https://app.base44.com/api/apps/${APP_ID}`;

const headers = {
  'api_key': API_KEY,
  'Content-Type': 'application/json'
};

// Generic fetch function with improved error handling
async function fetchAPI(endpoint, method = 'GET', body = null, retries = 2) {
  try {
    const options = {
      method,
      headers
    };
    
    if (body) {
      options.body = JSON.stringify(body);
    }
    
    const response = await fetch(endpoint, options);
    
    // Better error handling
    if (!response.ok) {
      if (response.status === 401) {
        console.error('Unauthorized - Check API key');
      } else if (response.status === 404) {
        console.warn(`Resource not found: ${endpoint}`);
        return null;
      } else if (response.status === 500 && retries > 0) {
        // Retry on server error
        await new Promise(r => setTimeout(r, 1000));
        return fetchAPI(endpoint, method, body, retries - 1);
      }
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`API Error at ${endpoint}:`, error);
    return null;
  }
}

// Helper to build filter query string
const buildFilterQuery = (filter = {}) => {
  const params = new URLSearchParams();
  Object.entries(filter).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.append(key, value);
    }
  });
  return params.toString();
};

// Helper to create list method aliases
const createEntityAPI = (entityName) => {
  return {
    filter: async (query = {}, sort = '-created_date', limit = 10) => {
      try {
        const filterQuery = buildFilterQuery(query);
        const baseUrl = `${BASE_URL}/entities/${entityName}`;
        const url = filterQuery 
          ? `${baseUrl}?${filterQuery}&sort=${sort}&limit=${limit}`
          : `${baseUrl}?sort=${sort}&limit=${limit}`;
        
        const data = await fetchAPI(url);
        
        // Handle both array and paginated responses
        if (Array.isArray(data)) {
          return data;
        } else if (data?.results) {
          return data.results;
        } else if (data?.data) {
          return data.data;
        }
        return [];
      } catch (error) {
        console.error(`Error filtering ${entityName}:`, error);
        return [];
      }
    },
    
    list: async (sort = '-created_date', limit = 10) => {
      try {
        const data = await fetchAPI(`${BASE_URL}/entities/${entityName}?sort=${sort}&limit=${limit}`);
        
        // Handle both array and paginated responses
        if (Array.isArray(data)) {
          return data;
        } else if (data?.results) {
          return data.results;
        } else if (data?.data) {
          return data.data;
        }
        return [];
      } catch (error) {
        console.error(`Error listing ${entityName}:`, error);
        return [];
      }
    },
    
    get: async (id) => {
      try {
        return await fetchAPI(`${BASE_URL}/entities/${entityName}/${id}`);
      } catch (error) {
        console.error(`Error getting ${entityName}/${id}:`, error);
        return null;
      }
    },
    
    create: async (data) => {
      try {
        const result = await fetchAPI(`${BASE_URL}/entities/${entityName}`, 'POST', data);
        return result;
      } catch (error) {
        console.error(`Error creating ${entityName}:`, error);
        return null;
      }
    },
    
    update: async (id, data) => {
      try {
        return await fetchAPI(`${BASE_URL}/entities/${entityName}/${id}`, 'PUT', data);
      } catch (error) {
        console.error(`Error updating ${entityName}/${id}:`, error);
        return null;
      }
    },
    
    delete: async (id) => {
      try {
        return await fetchAPI(`${BASE_URL}/entities/${entityName}/${id}`, 'DELETE');
      } catch (error) {
        console.error(`Error deleting ${entityName}/${id}:`, error);
        return null;
      }
    }
  };
};

export const base44 = {
  // Authentication
  auth: {
    me: async () => {
      try {
        // In a real app, this would get from actual auth API
        // For now, return a mock user
        const storedUser = localStorage.getItem('swasthAI_user');
        if (storedUser) {
          return JSON.parse(storedUser);
        }
        
        return {
          id: 'user-1',
          email: 'user@example.com',
          full_name: 'John',
          phone: '+91-9876543210'
        };
      } catch (error) {
        console.error('Auth error:', error);
        return null;
      }
    },
    
    login: async (email, password) => {
      try {
        const user = { id: 'user-1', email, full_name: email.split('@')[0] };
        localStorage.setItem('swasthAI_user', JSON.stringify(user));
        return { success: true, user };
      } catch (error) {
        console.error('Login error:', error);
        return null;
      }
    },
    
    logout: async () => {
      try {
        localStorage.removeItem('swasthAI_user');
        return { success: true };
      } catch (error) {
        console.error('Logout error:', error);
        return null;
      }
    }
  },

  // Integrations
  integrations: {
    Core: {
      // Query AI with schema support
      QueryAI: async (config) => {
        try {
          // Mock AI response - in production, call real API
          const { prompt, json_schema } = config;
          
          // Simulate API call delay
          await new Promise(r => setTimeout(r, 800));
          
          // Return mock data based on schema
          if (json_schema?.properties?.possibleConditions) {
            return {
              possibleConditions: ['Common Cold', 'Flu', 'Allergies'],
              severity: 'mild',
              followUpQuestions: [
                'How long have you had these symptoms?',
                'Do you have a fever?',
                'Any recent travel?'
              ],
              recommendations: [
                'Rest and stay hydrated',
                'Monitor temperature',
                'Consult doctor if symptoms persist'
              ]
            };
          }
          
          return { success: true };
        } catch (error) {
          console.error('AI Query error:', error);
          return null;
        }
      },

      InvokeLLM: async (config) => {
        try {
          const { prompt } = config;
          
          // Mock LLM response for symptom analysis
          await new Promise(r => setTimeout(r, 1200));
          
          return {
            follow_up_questions: [
              {
                question: 'How long have you been experiencing these symptoms?',
                options: ['Less than 24 hours', '1-3 days', 'More than a week']
              },
              {
                question: 'Do you have a fever?',
                options: ['Yes', 'No', 'Not sure']
              },
              {
                question: 'Any recent travel or exposure?',
                options: ['Yes', 'No']
              }
            ],
            initial_observations: 'Based on symptoms reported, consulting with specialists might be beneficial.',
            risk_level: 'low',
            recommended_action: 'Schedule consultation',
            recommended_specialty: 'General Physician'
          };
        } catch (error) {
          console.error('LLM error:', error);
          return null;
        }
      },

      UploadFile: async (fileData) => {
        try {
          // Mock file upload
          await new Promise(r => setTimeout(r, 1000));
          
          return {
            file_url: 'https://example.com/uploads/file-' + Date.now() + '.pdf',
            file_name: fileData.name,
            file_size: fileData.size,
            success: true
          };
        } catch (error) {
          console.error('Upload error:', error);
          return null;
        }
      },

      ExtractDataFromUploadedFile: async (config) => {
        try {
          // Mock prescription extraction
          await new Promise(r => setTimeout(r, 800));
          
          return {
            medicines: [
              { name: 'Aspirin', dosage: '500mg', quantity: 30, frequency: 'Twice daily' },
              { name: 'Paracetamol', dosage: '650mg', quantity: 20, frequency: 'As needed' },
              { name: 'Cough Syrup', dosage: '5ml', quantity: 100, frequency: 'Thrice daily' }
            ],
            doctor_name: 'Dr. Smith',
            consultation_date: new Date().toISOString(),
            validity_days: 14
          };
        } catch (error) {
          console.error('Extract error:', error);
          return null;
        }
      }
    }
  },
  
  // Entities - Auto-created with factory function
  entities: {
    HealthProfile: createEntityAPI('HealthProfile'),
    SymptomCheck: createEntityAPI('SymptomCheck'),
    Doctor: {
      // Enhanced Doctor API with sample data fallback
      filter: async (query = {}, sort = '-rating', limit = 20) => {
        try {
          const filterQuery = buildFilterQuery(query);
          const baseUrl = `${BASE_URL}/entities/Doctor`;
          const url = filterQuery 
            ? `${baseUrl}?${filterQuery}&sort=${sort}&limit=${limit}`
            : `${baseUrl}?sort=${sort}&limit=${limit}`;
          
          const data = await fetchAPI(url);
          
          // If API returns data, use it
          if (Array.isArray(data) && data.length > 0) {
            return data;
          } else if (data?.results && data.results.length > 0) {
            return data.results;
          } else if (data?.data && data.data.length > 0) {
            return data.data;
          }
          
          // Fallback to sample data with filtering
          let results = [
            {
              id: 'doc_1',
              name: 'Rajesh Kumar',
              specialty: 'General Physician',
              qualification: 'MBBS, MD (Internal Medicine)',
              experience_years: 12,
              rating: 4.8,
              reviews_count: 342,
              consultation_fee: 500,
              languages: ['English', 'Hindi'],
              available_online: true,
              available_offline: true,
              clinic_name: 'Mumbai Medical Center',
              clinic_address: '123 Main Street, Mumbai, MH 400001',
              city: 'Mumbai',
              photo_url: null
            },
            {
              id: 'doc_2',
              name: 'Priya Sharma',
              specialty: 'Cardiologist',
              qualification: 'MBBS, DM (Cardiology)',
              experience_years: 15,
              rating: 4.9,
              reviews_count: 512,
              consultation_fee: 800,
              languages: ['English', 'Hindi'],
              available_online: true,
              available_offline: true,
              clinic_name: 'Heart Care Hospital',
              clinic_address: '456 Park Avenue, Delhi, DL 110001',
              city: 'Delhi',
              photo_url: null
            },
            {
              id: 'doc_3',
              name: 'Amit Patel',
              specialty: 'Dermatologist',
              qualification: 'MBBS, MD (Dermatology)',
              experience_years: 10,
              rating: 4.7,
              reviews_count: 289,
              consultation_fee: 600,
              languages: ['English', 'Hindi', 'Gujarati'],
              available_online: true,
              available_offline: true,
              clinic_name: 'Skin & Hair Clinic',
              clinic_address: '789 West Lane, Bangalore, KA 560001',
              city: 'Bangalore',
              photo_url: null
            },
            {
              id: 'doc_4',
              name: 'Dr. Neha Verma',
              specialty: 'Pediatrician',
              qualification: 'MBBS, MD (Pediatrics)',
              experience_years: 11,
              rating: 4.9,
              reviews_count: 421,
              consultation_fee: 450,
              languages: ['English', 'Hindi'],
              available_online: true,
              available_offline: true,
              clinic_name: 'Kids Care Clinic',
              clinic_address: '321 Child Street, Hyderabad, TG 500001',
              city: 'Hyderabad',
              photo_url: null
            },
            {
              id: 'doc_5',
              name: 'Vijay Singh',
              specialty: 'Orthopedic',
              qualification: 'MBBS, MS (Orthopedics)',
              experience_years: 14,
              rating: 4.6,
              reviews_count: 378,
              consultation_fee: 700,
              languages: ['English', 'Hindi'],
              available_online: true,
              available_offline: true,
              clinic_name: 'Bone & Joint Hospital',
              clinic_address: '654 Health Road, Pune, MH 411001',
              city: 'Pune',
              photo_url: null
            },
            {
              id: 'doc_6',
              name: 'Dr. Anjali Gupta',
              specialty: 'Gynecologist',
              qualification: 'MBBS, DGO (Obstetrics & Gynecology)',
              experience_years: 13,
              rating: 4.8,
              reviews_count: 456,
              consultation_fee: 600,
              languages: ['English', 'Hindi'],
              available_online: true,
              available_offline: true,
              clinic_name: 'Women\'s Health Center',
              clinic_address: '987 Ladies Lane, Chennai, TN 600001',
              city: 'Chennai',
              photo_url: null
            },
            {
              id: 'doc_7',
              name: 'Rohit Desai',
              specialty: 'ENT',
              qualification: 'MBBS, MS (ENT)',
              experience_years: 9,
              rating: 4.5,
              reviews_count: 267,
              consultation_fee: 550,
              languages: ['English', 'Hindi', 'Marathi'],
              available_online: true,
              available_offline: true,
              clinic_name: 'Ear Nose Throat Clinic',
              clinic_address: '147 Sound Street, Kolkata, WB 700001',
              city: 'Kolkata',
              photo_url: null
            },
            {
              id: 'doc_8',
              name: 'Dr. Sandeep Reddy',
              specialty: 'Neurologist',
              qualification: 'MBBS, MD (Neurology)',
              experience_years: 16,
              rating: 4.9,
              reviews_count: 534,
              consultation_fee: 900,
              languages: ['English', 'Hindi', 'Telugu'],
              available_online: true,
              available_offline: true,
              clinic_name: 'Neuro Care Institute',
              clinic_address: '258 Brain Road, Hyderabad, TG 500002',
              city: 'Hyderabad',
              photo_url: null
            },
            {
              id: 'doc_9',
              name: 'Dr. Ravi Malhotra',
              specialty: 'Gastroenterologist',
              qualification: 'MBBS, MD (Internal Medicine), DM (Gastroenterology)',
              experience_years: 17,
              rating: 4.8,
              reviews_count: 489,
              consultation_fee: 850,
              languages: ['English', 'Hindi', 'Punjabi'],
              available_online: true,
              available_offline: true,
              clinic_name: 'Digestive Health Center',
              clinic_address: '369 Digestive Lane, Chandigarh, CH 160001',
              city: 'Chandigarh',
              photo_url: null
            },
            {
              id: 'doc_10',
              name: 'Dr. Megha Kapoor',
              specialty: 'General Physician',
              qualification: 'MBBS, MD (Internal Medicine)',
              experience_years: 8,
              rating: 4.7,
              reviews_count: 312,
              consultation_fee: 450,
              languages: ['English', 'Hindi'],
              available_online: true,
              available_offline: true,
              clinic_name: 'City Medical Clinic',
              clinic_address: '741 Health Plaza, Bangalore, KA 560002',
              city: 'Bangalore',
              photo_url: null
            },
            {
              id: 'doc_11',
              name: 'Dr. Anil Rao',
              specialty: 'Cardiologist',
              qualification: 'MBBS, MD, DM (Cardiology)',
              experience_years: 18,
              rating: 4.9,
              reviews_count: 678,
              consultation_fee: 1000,
              languages: ['English', 'Hindi', 'Kannada'],
              available_online: true,
              available_offline: true,
              clinic_name: 'Advanced Cardiology Center',
              clinic_address: '852 Heart Avenue, Bangalore, KA 560003',
              city: 'Bangalore',
              photo_url: null
            },
            {
              id: 'doc_12',
              name: 'Dr. Pooja Singh',
              specialty: 'Dermatologist',
              qualification: 'MBBS, MD (Dermatology)',
              experience_years: 12,
              rating: 4.6,
              reviews_count: 298,
              consultation_fee: 650,
              languages: ['English', 'Hindi'],
              available_online: true,
              available_offline: true,
              clinic_name: 'Aesthetic Skin Clinic',
              clinic_address: '963 Beauty Street, Delhi, DL 110002',
              city: 'Delhi',
              photo_url: null
            }
          ];
          
          if (query.specialty) {
            results = results.filter(d => d.specialty === query.specialty);
          }
          if (query.available_online === true) {
            results = results.filter(d => d.available_online);
          }
          if (query.available_offline === true) {
            results = results.filter(d => d.available_offline);
          }
          
          // Sort
          if (sort === '-rating') {
            results.sort((a, b) => b.rating - a.rating);
          } else if (sort === '-experience_years') {
            results.sort((a, b) => b.experience_years - a.experience_years);
          }
          
          return results.slice(0, limit);
        } catch (error) {
          console.error('Error filtering doctors:', error);
          return [];
        }
      },
      
      list: async (sort = '-rating', limit = 20) => {
        try {
          const data = await fetchAPI(`${BASE_URL}/entities/Doctor?sort=${sort}&limit=${limit}`);
          
          if (Array.isArray(data) && data.length > 0) {
            return data;
          } else if (data?.results && data.results.length > 0) {
            return data.results;
          } else if (data?.data && data.data.length > 0) {
            return data.data;
          }
          
          // Return sample doctors
          let sampleDocs = [
            { id: 'doc_1', name: 'Rajesh Kumar', specialty: 'General Physician', rating: 4.8, consultation_fee: 500 },
            { id: 'doc_2', name: 'Priya Sharma', specialty: 'Cardiologist', rating: 4.9, consultation_fee: 800 },
            { id: 'doc_3', name: 'Amit Patel', specialty: 'Dermatologist', rating: 4.7, consultation_fee: 600 }
          ];
          return sampleDocs.slice(0, limit);
        } catch (error) {
          console.error('Error listing doctors:', error);
          return [];
        }
      },
      
      get: async (id) => {
        try {
          const data = await fetchAPI(`${BASE_URL}/entities/Doctor/${id}`);
          if (data) return data;
          
          // Try to find in sample data
          const sampleDocs = {
            'doc_1': { id: 'doc_1', name: 'Rajesh Kumar', specialty: 'General Physician', experience_years: 12, rating: 4.8, consultation_fee: 500 },
            'doc_2': { id: 'doc_2', name: 'Priya Sharma', specialty: 'Cardiologist', experience_years: 15, rating: 4.9, consultation_fee: 800 }
          };
          return sampleDocs[id] || null;
        } catch (error) {
          console.error('Error getting doctor:', error);
          return null;
        }
      },
      
      create: async (data) => {
        try {
          const response = await fetchAPI(`${BASE_URL}/entities/Doctor`, 'POST', data);
          return response || { id: 'doc_' + Date.now(), ...data };
        } catch (error) {
          console.error('Error creating doctor:', error);
          return { id: 'doc_' + Date.now(), ...data };
        }
      },
      
      update: async (id, data) => {
        try {
          const response = await fetchAPI(`${BASE_URL}/entities/Doctor/${id}`, 'PUT', data);
          return response || { id, ...data };
        } catch (error) {
          console.error('Error updating doctor:', error);
          return { id, ...data };
        }
      },
      
      delete: async (id) => {
        try {
          await fetchAPI(`${BASE_URL}/entities/Doctor/${id}`, 'DELETE');
          return true;
        } catch (error) {
          console.error('Error deleting doctor:', error);
          return false;
        }
      }
    },
    Appointment: createEntityAPI('Appointment'),
    HealthRecord: createEntityAPI('HealthRecord'),
    MedicineOrder: createEntityAPI('MedicineOrder'),
    LabBooking: createEntityAPI('LabBooking'),
    ForumPost: createEntityAPI('ForumPost'),
    ForumReply: createEntityAPI('ForumReply'),
    ArticleComment: createEntityAPI('ArticleComment'),
    PostUpvote: createEntityAPI('PostUpvote'),
    SavedArticles: createEntityAPI('SavedArticles'),
    HealthArticles: createEntityAPI('HealthArticles'),
    LabTests: createEntityAPI('LabTests'),
    LabBookingHistory: createEntityAPI('LabBookingHistory')
  }
};

// ==================== DOCTOR APIS ====================
// Filterable fields: name, specialization, qualification, experience_years, consultation_fee, rating, total_reviews, hospital_name, location, latitude, longitude, languages, available_days, available_slots, profile_image, is_video_consultation, is_clinic_visit, bio, verified
async function fetchDoctorEntities() {
    const response = await fetch(`${BASE_URL}/entities/Doctor`, {
        headers
    });
    const data = await response.json();
    return data;
}

async function updateDoctorEntity(entityId, updateData) {
    const response = await fetch(`${BASE_URL}/entities/Doctor/${entityId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(updateData)
    });
    const data = await response.json();
    return data;
}

// ==================== APPOINTMENT APIS ====================
// Filterable fields: doctor_id, patient_name, patient_email, patient_phone, appointment_date, appointment_time, consultation_type, status, symptoms, notes, doctor_notes, rejection_reason, prescription_url, amount_paid, payment_status, meeting_link, doctor_name, doctor_specialization
async function fetchAppointmentEntities() {
    const response = await fetch(`${BASE_URL}/entities/Appointment`, {
        headers
    });
    const data = await response.json();
    return data;
}

async function updateAppointmentEntity(entityId, updateData) {
    const response = await fetch(`${BASE_URL}/entities/Appointment/${entityId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(updateData)
    });
    const data = await response.json();
    return data;
}

// ==================== MEDICINE APIS ====================
// Filterable fields: name, generic_name, manufacturer, category, therapeutic_class, price, mrp, discount_percent, pack_size, prescription_required, in_stock, image_url, description, usage_instructions, side_effects
async function fetchMedicineEntities() {
    const response = await fetch(`${BASE_URL}/entities/Medicine`, {
        headers
    });
    const data = await response.json();
    return data;
}

async function updateMedicineEntity(entityId, updateData) {
    const response = await fetch(`${BASE_URL}/entities/Medicine/${entityId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(updateData)
    });
    const data = await response.json();
    return data;
}

// ==================== MEDICINE ORDER APIS ====================
// Filterable fields: order_number, items, subtotal, delivery_fee, discount, total_amount, status, payment_status, payment_method, delivery_address, prescription_url, estimated_delivery, tracking_updates
async function fetchMedicineOrderEntities() {
    const response = await fetch(`${BASE_URL}/entities/MedicineOrder`, {
        headers
    });
    const data = await response.json();
    return data;
}

async function updateMedicineOrderEntity(entityId, updateData) {
    const response = await fetch(`${BASE_URL}/entities/MedicineOrder/${entityId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(updateData)
    });
    const data = await response.json();
    return data;
}

// ==================== LAB TEST APIS ====================
// Filterable fields: name, code, category, description, price, mrp, discount_percent, sample_type, fasting_required, fasting_hours, report_time, home_collection, parameters_count, parameters, preparation_instructions, popular
async function fetchLabTestEntities() {
    const response = await fetch(`${BASE_URL}/entities/LabTest`, {
        headers
    });
    const data = await response.json();
    return data;
}

async function updateLabTestEntity(entityId, updateData) {
    const response = await fetch(`${BASE_URL}/entities/LabTest/${entityId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(updateData)
    });
    const data = await response.json();
    return data;
}

// ==================== LAB BOOKING APIS ====================
// Filterable fields: booking_number, tests, patient_name, patient_age, patient_gender, patient_phone, collection_type, collection_address, collection_date, collection_slot, total_amount, payment_status, status, report_url, lab_name
async function fetchLabBookingEntities() {
    const response = await fetch(`${BASE_URL}/entities/LabBooking`, {
        headers
    });
    const data = await response.json();
    return data;
}

async function updateLabBookingEntity(entityId, updateData) {
    const response = await fetch(`${BASE_URL}/entities/LabBooking/${entityId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(updateData)
    });
    const data = await response.json();
    return data;
}

// ==================== HEALTH RECORD APIS ====================
// Filterable fields: title, record_type, record_date, doctor_name, hospital_name, file_url, file_type, notes, tags, is_shared_with_doctor, extracted_data, linked_records, shared_with
async function fetchHealthRecordEntities() {
    const response = await fetch(`${BASE_URL}/entities/HealthRecord`, {
        headers
    });
    const data = await response.json();
    return data;
}

async function updateHealthRecordEntity(entityId, updateData) {
    const response = await fetch(`${BASE_URL}/entities/HealthRecord/${entityId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(updateData)
    });
    const data = await response.json();
    return data;
}

// ==================== SYMPTOM SESSION APIS ====================
// Filterable fields: session_id, symptoms, duration, severity, additional_info, ai_assessment, status, converted_appointment_id
async function fetchSymptomSessionEntities() {
    const response = await fetch(`${BASE_URL}/entities/SymptomSession`, {
        headers
    });
    const data = await response.json();
    return data;
}

async function updateSymptomSessionEntity(entityId, updateData) {
    const response = await fetch(`${BASE_URL}/entities/SymptomSession/${entityId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(updateData)
    });
    const data = await response.json();
    return data;
}

// ==================== HEALTH COACH CHAT APIS ====================
// Filterable fields: title, messages, topic, health_goals, status
async function fetchHealthCoachChatEntities() {
    const response = await fetch(`${BASE_URL}/entities/HealthCoachChat`, {
        headers
    });
    const data = await response.json();
    return data;
}

async function updateHealthCoachChatEntity(entityId, updateData) {
    const response = await fetch(`${BASE_URL}/entities/HealthCoachChat/${entityId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(updateData)
    });
    const data = await response.json();
    return data;
}

// ==================== USER PROFILE APIS ====================
// Filterable fields: phone, date_of_birth, gender, blood_group, height_cm, weight_kg, allergies, chronic_conditions, current_medications, emergency_contact, addresses, abha_id, abha_linked, preferred_language, notification_preferences
async function fetchUserProfileEntities() {
    const response = await fetch(`${BASE_URL}/entities/UserProfile`, {
        headers
    });
    const data = await response.json();
    return data;
}

async function updateUserProfileEntity(entityId, updateData) {
    const response = await fetch(`${BASE_URL}/entities/UserProfile/${entityId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(updateData)
    });
    const data = await response.json();
    return data;
}

// ==================== ARTICLE APIS ====================
// Filterable fields: title, slug, excerpt, content, cover_image, category, tags, author_name, author_image, author_credentials, read_time_minutes, views, likes, is_featured, is_published
async function fetchArticleEntities() {
    const response = await fetch(`${BASE_URL}/entities/Article`, {
        headers
    });
    const data = await response.json();
    return data;
}

async function updateArticleEntity(entityId, updateData) {
    const response = await fetch(`${BASE_URL}/entities/Article/${entityId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(updateData)
    });
    const data = await response.json();
    return data;
}

// ==================== DOCTOR PROFILE APIS ====================
// Filterable fields: doctor_user_email, doctor_listing_id, nmc_registration, verification_status, verification_documents, specialization, qualification, experience_years, consultation_fee, hospital_name, clinic_address, availability, is_video_consultation, is_clinic_visit, languages, bio, profile_image, is_active, is_published, rating, total_reviews
async function fetchDoctorProfileEntities() {
    const response = await fetch(`${BASE_URL}/entities/DoctorProfile`, {
        headers
    });
    const data = await response.json();
    return data;
}

async function updateDoctorProfileEntity(entityId, updateData) {
    const response = await fetch(`${BASE_URL}/entities/DoctorProfile/${entityId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(updateData)
    });
    const data = await response.json();
    return data;
}

// ==================== LAB PARTNER APIS ====================
// Filterable fields: partner_user_email, lab_name, license_number, nabl_accredited, verification_status, verification_documents, lab_address, contact_phone, contact_email, operating_hours, services_offered, home_collection, is_active, is_published, rating, total_reviews, tests_available
async function fetchLabPartnerEntities() {
    const response = await fetch(`${BASE_URL}/entities/LabPartner`, {
        headers
    });
    const data = await response.json();
    return data;
}

async function updateLabPartnerEntity(entityId, updateData) {
    const response = await fetch(`${BASE_URL}/entities/LabPartner/${entityId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(updateData)
    });
    const data = await response.json();
    return data;
}

// ==================== NOTIFICATION APIS ====================
// Filterable fields: recipient_email, title, message, type, is_read, link, priority
async function fetchNotificationEntities() {
    const response = await fetch(`${BASE_URL}/entities/Notification`, {
        headers
    });
    const data = await response.json();
    return data;
}

async function updateNotificationEntity(entityId, updateData) {
    const response = await fetch(`${BASE_URL}/entities/Notification/${entityId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(updateData)
    });
    const data = await response.json();
    return data;
}

// ==================== DOCTOR REVIEW APIS ====================
// Filterable fields: doctor_id, patient_email, patient_name, appointment_id, rating, review, would_recommend
async function fetchDoctorReviewEntities() {
    const response = await fetch(`${BASE_URL}/entities/DoctorReview`, {
        headers
    });
    const data = await response.json();
    return data;
}

async function updateDoctorReviewEntity(entityId, updateData) {
    const response = await fetch(`${BASE_URL}/entities/DoctorReview/${entityId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(updateData)
    });
    const data = await response.json();
    return data;
}

// ==================== FORUM POST APIS ====================
// Filterable fields: title, content, category, author_email, author_name, upvotes, upvoted_by, replies_count, is_pinned, is_locked, status
async function fetchForumPostEntities() {
    const response = await fetch(`${BASE_URL}/entities/ForumPost`, {
        headers
    });
    const data = await response.json();
    return data;
}

async function updateForumPostEntity(entityId, updateData) {
    const response = await fetch(`${BASE_URL}/entities/ForumPost/${entityId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(updateData)
    });
    const data = await response.json();
    return data;
}

// ==================== FORUM REPLY APIS ====================
// Filterable fields: post_id, content, author_email, author_name, upvotes, upvoted_by, is_helpful, status
async function fetchForumReplyEntities() {
    const response = await fetch(`${BASE_URL}/entities/ForumReply`, {
        headers
    });
    const data = await response.json();
    return data;
}

async function updateForumReplyEntity(entityId, updateData) {
    const response = await fetch(`${BASE_URL}/entities/ForumReply/${entityId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(updateData)
    });
    const data = await response.json();
    return data;
}

// ==================== ARTICLE COMMENT APIS ====================
// Filterable fields: article_id, content, author_email, author_name, upvotes, upvoted_by, status
async function fetchArticleCommentEntities() {
    const response = await fetch(`${BASE_URL}/entities/ArticleComment`, {
        headers
    });
    const data = await response.json();
    return data;
}

async function updateArticleCommentEntity(entityId, updateData) {
    const response = await fetch(`${BASE_URL}/entities/ArticleComment/${entityId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(updateData)
    });
    const data = await response.json();
    return data;
}

// ==================== HEALTH INSIGHT APIS ====================
// Filterable fields: user_email, insight_type, title, description, priority, related_records, suggested_tests, is_read, is_dismissed
async function fetchHealthInsightEntities() {
    const response = await fetch(`${BASE_URL}/entities/HealthInsight`, {
        headers
    });
    const data = await response.json();
    return data;
}

async function updateHealthInsightEntity(entityId, updateData) {
    const response = await fetch(`${BASE_URL}/entities/HealthInsight/${entityId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(updateData)
    });
    const data = await response.json();
    return data;
}

// ==================== HOSPITAL APIS ====================
// Filterable fields: name, type, description, address, latitude, longitude, contact, departments, facilities, availability, category, insurance_supported, cashless_available, rating, total_reviews, total_doctors, verified, is_active, is_published, owner_email, registration_id, registration_certificate, trade_license
async function fetchHospitalEntities() {
    const response = await fetch(`${BASE_URL}/entities/Hospital`, {
        headers
    });
    const data = await response.json();
    return data;
}

async function updateHospitalEntity(entityId, updateData) {
    const response = await fetch(`${BASE_URL}/entities/Hospital/${entityId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(updateData)
    });
    const data = await response.json();
    return data;
}

// ==================== EMERGENCY REQUEST APIS ====================
// Filterable fields: request_number, emergency_type, patient_name, patient_age, patient_gender, symptoms, situation_description, location, contact_phone, requester_email, attached_media, status, acknowledged_by, ambulance_eta, nearby_hospitals_notified, priority
async function fetchEmergencyRequestEntities() {
    const response = await fetch(`${BASE_URL}/entities/EmergencyRequest`, {
        headers
    });
    const data = await response.json();
    return data;
}

async function updateEmergencyRequestEntity(entityId, updateData) {
    const response = await fetch(`${BASE_URL}/entities/EmergencyRequest/${entityId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(updateData)
    });
    const data = await response.json();
    return data;
}

// ==================== HOSPITAL REGISTRATION APIS ====================
// Filterable fields: hospital_name, hospital_type, owner_email, hospital_listing_id, address, latitude, longitude, contact_phone, contact_email, departments, total_doctors, has_emergency_services, has_icu, has_ambulance, is_24x7, visiting_hours, insurance_supported, registration_certificate_url, trade_license_url, authorized_rep_id_url, verification_status, rejection_reason
async function fetchHospitalRegistrationEntities() {
    const response = await fetch(`${BASE_URL}/entities/HospitalRegistration`, {
        headers
    });
    const data = await response.json();
    return data;
}

async function updateHospitalRegistrationEntity(entityId, updateData) {
    const response = await fetch(`${BASE_URL}/entities/HospitalRegistration/${entityId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(updateData)
    });
    const data = await response.json();
    return data;
}

// ==================== VIDEO CONSULTATION APIS ====================
// Filterable fields: appointment_id, session_token, room_id, doctor_email, patient_email, status, started_at, ended_at, duration_minutes, participants_joined, connection_quality, call_metadata
async function fetchVideoConsultationEntities() {
    const response = await fetch(`${BASE_URL}/entities/VideoConsultation`, {
        headers
    });
    const data = await response.json();
    return data;
}

async function updateVideoConsultationEntity(entityId, updateData) {
    const response = await fetch(`${BASE_URL}/entities/VideoConsultation/${entityId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(updateData)
    });
    const data = await response.json();
    return data;
}

// ==================== PRESCRIPTION APIS ====================
// Filterable fields: appointment_id, patient_email, patient_name, doctor_email, doctor_name, doctor_qualification, doctor_registration, diagnosis, symptoms, medicines, tests_recommended, special_instructions, follow_up_date, digital_signature, prescription_number, issued_at, pdf_url, shared_with_pharmacies, status
async function fetchPrescriptionEntities() {
    const response = await fetch(`${BASE_URL}/entities/Prescription`, {
        headers
    });
    const data = await response.json();
    return data;
}

async function updatePrescriptionEntity(entityId, updateData) {
    const response = await fetch(`${BASE_URL}/entities/Prescription/${entityId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(updateData)
    });
    const data = await response.json();
    return data;
}

// ==================== PHARMACY ORDER APIS ====================
// Filterable fields: prescription_id, patient_email, patient_name, patient_phone, pharmacy_name, pharmacy_id, medicines, total_amount, delivery_address, status, order_number, placed_at, estimated_delivery
async function fetchPharmacyOrderEntities() {
    const response = await fetch(`${BASE_URL}/entities/PharmacyOrder`, {
        headers
    });
    const data = await response.json();
    return data;
}

async function updatePharmacyOrderEntity(entityId, updateData) {
    const response = await fetch(`${BASE_URL}/entities/PharmacyOrder/${entityId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(updateData)
    });
    const data = await response.json();
    return data;
}

// ==================== EXPORT ALL APIS ====================
export {
  fetchAPI,
  fetchDoctorEntities,
  updateDoctorEntity,
  fetchAppointmentEntities,
  updateAppointmentEntity,
  fetchMedicineEntities,
  updateMedicineEntity,
  fetchMedicineOrderEntities,
  updateMedicineOrderEntity,
  fetchLabTestEntities,
  updateLabTestEntity,
  fetchLabBookingEntities,
  updateLabBookingEntity,
  fetchHealthRecordEntities,
  updateHealthRecordEntity,
  fetchSymptomSessionEntities,
  updateSymptomSessionEntity,
  fetchHealthCoachChatEntities,
  updateHealthCoachChatEntity,
  fetchUserProfileEntities,
  updateUserProfileEntity,
  fetchArticleEntities,
  updateArticleEntity,
  fetchDoctorProfileEntities,
  updateDoctorProfileEntity,
  fetchLabPartnerEntities,
  updateLabPartnerEntity,
  fetchNotificationEntities,
  updateNotificationEntity,
  fetchDoctorReviewEntities,
  updateDoctorReviewEntity,
  fetchForumPostEntities,
  updateForumPostEntity,
  fetchForumReplyEntities,
  updateForumReplyEntity,
  fetchArticleCommentEntities,
  updateArticleCommentEntity,
  fetchHealthInsightEntities,
  updateHealthInsightEntity,
  fetchHospitalEntities,
  updateHospitalEntity,
  fetchEmergencyRequestEntities,
  updateEmergencyRequestEntity,
  fetchHospitalRegistrationEntities,
  updateHospitalRegistrationEntity,
  fetchVideoConsultationEntities,
  updateVideoConsultationEntity,
  fetchPrescriptionEntities,
  updatePrescriptionEntity,
  fetchPharmacyOrderEntities,
  updatePharmacyOrderEntity
};
