# SwasthAI - Health Navigator Platform

A modern, AI-powered healthcare platform connecting patients with doctors, laboratories, hospitals, and pharmacies. Built with React and powered by Base44 healthcare data platform.

## 🌟 Features

- **Doctor Finder & Booking**: Search doctors by specialty, location, and ratings
- **Symptom Checker**: AI-powered symptom analysis with doctor recommendations
- **Health Records**: Secure digital health record management (ABHA compatible)
- **Lab Tests**: Online booking for lab tests with home collection option
- **Pharmacy**: Medicine ordering and home delivery
- **Telemedicine**: Video consultations with doctors
- **Health Forum**: Community discussions about health topics
- **Health Articles**: Educational content and wellness tips
- **Appointment Management**: Track and manage all appointments
- **Multi-user Support**: Patient, Doctor, Hospital, and Lab Partner dashboards

## 🚀 Quick Start

### Prerequisites
- Node.js 16.x or higher
- npm 8.x or higher

### Installation

1. **Install dependencies**
```bash
npm install
```

2. **Start development server**
```bash
npm run dev
```

The application will open at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## 📁 Project Structure

```
SwasthAI/
├── api/                    # API client for Base44 platform
├── Components/             # React components (organized by feature)
├── Entities/              # Entity models and types
├── pages/                 # Page components (routes)
├── lib/                   # Utility functions
├── App.jsx                # Main app component with routing
├── layout.jsx             # Layout wrapper
├── main.jsx               # Vite entry point
├── index.html             # HTML template
├── index.css              # Global styles
├── tailwind.config.js     # Tailwind CSS config
├── vite.config.js         # Vite configuration
└── package.json           # Dependencies
```

## 🛠️ Technology Stack

### Frontend Framework
- **React 18.2** - UI framework
- **React Router 6** - Client-side routing
- **React Query 5** - Server state management

### Styling & UI
- **Tailwind CSS 3** - Utility-first CSS
- **Framer Motion** - Animations
- **Lucide React** - Icons
- **React Hot Toast** - Notifications

### Build Tools
- **Vite 5** - Fast build tool and dev server
- **PostCSS** - CSS processing
- **Autoprefixer** - Vendor prefixes

### Data & Integration
- **Base44 API** - Healthcare data platform
- **Axios** - HTTP client
- **Date-fns** - Date utilities

## 🔑 Key Components

### Pages (40+ pages)
- Home, Doctors, Doctor Profile, Book Appointment
- Symptom Checker, Health Records, Lab Tests, Pharmacy
- Forum, Articles, Health Coach, Video Consultation
- Doctor Dashboard, Hospital Management, Lab Partner Management
- And many more...

### Components (40+ components)
- **Layout**: Navbar, Footer, Layout
- **Home**: Hero, Services, Stats, Testimonials, CTA
- **Doctor**: Card, Filters, Map, Availability Manager
- **Consultation**: Video Room, Prescription Editor/Viewer, Pharmacy Flow
- **Dashboard**: Insights, Role Selector
- **UI**: Animated Card, Gradient Button, Skeleton Loader, etc.

### Entities (24+ models)
- Doctor, Appointment, Medicine, MedicineOrder
- LabTest, LabBooking, HealthRecord, SymptomSession
- HealthCoachChat, UserProfile, Article, DoctorProfile
- LabPartner, Notification, DoctorReview, Forum, Hospital
- VideoConsultation, Prescription, PharmacyOrder, and more...

## 📡 API Integration

The application is fully integrated with Base44 healthcare API platform.

### Included API Functions (48+ functions)

Each entity has dedicated fetch and update functions:

```javascript
import {
  fetchDoctorEntities,
  updateDoctorEntity,
  fetchAppointmentEntities,
  updateAppointmentEntity,
  fetchMedicineEntities,
} from '@/api/base44Client'

// Usage
const doctors = await fetchDoctorEntities()
await updateDoctorEntity(doctorId, { rating: 4.9 })
```

## 🔗 Path Aliases

Clean imports using configured aliases:

```javascript
import Home from '@/pages/Home'
import Navbar from '@/Components/layout/Navbar'
import { fetchDoctors } from '@/api/base44Client'
```

## 📊 Available Routes

### Patient Routes
- `/` - Home
- `/symptom-checker` - Symptom Analysis
- `/doctors` - Find Doctors
- `/doctor-details/:id` - Doctor Profile
- `/book-appointment` - Book Appointment
- `/my-appointments` - My Appointments
- `/health-records` - Health Records
- `/lab-tests` - Lab Tests
- `/pharmacy` - Order Medicine

### Professional Routes
- `/doctor-dashboard` - Doctor Dashboard
- `/hospital-registration` - Hospital Registration
- `/lab-partner-onboarding` - Lab Registration

### Information Routes
- `/about` - About Us
- `/privacy` - Privacy Policy
- `/help` - Help & Support

## 🔒 Security & Performance

- API key management for Base44 integration
- Input validation and sanitization
- Error handling and recovery
- Code splitting and lazy loading
- React Query caching strategies
- Optimized bundle size

## 📚 Documentation

- [BUILD_SETUP_GUIDE.md](./BUILD_SETUP_GUIDE.md) - Detailed setup instructions
- [API_CONFIGURATION.md](./API_CONFIGURATION.md) - API details (if available)

## 🚀 Deployment

### Vercel
```bash
vercel deploy
```

### Netlify
```bash
netlify deploy
```

### Traditional Hosting
```bash
npm run build
# Upload 'dist' folder to your server
```

## 📝 License

All rights reserved - SwasthAI Healthcare Platform

## 📧 Support

For issues or questions, create an issue in the repository or contact support@swasthAI.com

---

**Version**: 1.0.0  
**Last Updated**: December 2025
