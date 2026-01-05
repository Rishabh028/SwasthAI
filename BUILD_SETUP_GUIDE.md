# SwasthAI - Health Navigator Platform

## Project Setup & Build Instructions

### Prerequisites
- Node.js 16.x or higher
- npm 8.x or higher (or yarn/pnpm)

### Installation Steps

1. **Install Dependencies**
```bash
npm install
```

2. **Start Development Server**
```bash
npm run dev
```
The application will open at `http://localhost:5173`

3. **Build for Production**
```bash
npm run build
```

4. **Preview Production Build**
```bash
npm run preview
```

## Project Structure

```
SwasthAI/
├── api/                          # API client and integrations
│   └── base44Client.js          # Base44 Platform API client
├── Components/                   # React components
│   ├── appointments/            # Appointment-related components
│   ├── consultation/            # Consultation components
│   ├── dashboard/               # Dashboard components
│   ├── doctors/                 # Doctor-related components
│   ├── home/                    # Home page components
│   ├── layout/                  # Layout components (Navbar, Footer)
│   ├── notifications/           # Notification components
│   ├── symptom/                 # Symptom checker components
│   ├── ui/                      # Reusable UI components
│   └── UserNotRegisteredError.jsx
├── Entities/                     # Entity models
│   ├── Appointment.jsx
│   ├── Doctor.jsx
│   ├── Medicine.jsx
│   ├── LabTest.jsx
│   └── ...
├── pages/                        # Page components (routes)
│   ├── Home.jsx
│   ├── Doctors.jsx
│   ├── SymptomChecker.jsx
│   ├── Pharmacy.jsx
│   └── ...
├── lib/                          # Utility libraries
├── App.jsx                       # Main app component with routing
├── layout.jsx                    # Layout wrapper
├── main.jsx                      # Entry point
├── index.html                    # HTML template
├── index.css                     # Global styles
├── package.json                  # Dependencies
├── vite.config.js               # Vite configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── postcss.config.js            # PostCSS configuration
└── README.md                     # This file
```

## Key Features

- **Doctor Finder**: Search and book appointments with doctors
- **Symptom Checker**: AI-powered symptom analysis
- **Health Records**: Secure health record management
- **Lab Tests**: Book lab tests online
- **Medicine Delivery**: Order medicines online
- **Video Consultation**: Telemedicine with doctors
- **Health Forum**: Community health discussions
- **Health Articles**: Educational health content

## Technology Stack

### Frontend
- **React 18.2** - UI framework
- **React Router 6** - Client-side routing
- **Tailwind CSS 3** - Styling
- **Framer Motion** - Animations
- **Lucide React** - Icons
- **React Query 5** - Data fetching and caching
- **Date-fns** - Date utilities
- **React Hot Toast** - Notifications

### Build & Dev Tools
- **Vite 5** - Build tool and dev server
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

### Backend Integration
- **Base44 API** - Healthcare data platform
- Custom API client for entity management

## Environment Configuration

The project uses the following Base44 API credentials:
- **App ID**: `6952d2f6292d9e983a249381`
- **API Key**: `4832057683cb4da89022fefc99777816`

These are configured in `api/base44Client.js`

## Available Routes

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
- `/profile` - User Profile
- `/saved-articles` - Saved Articles

### Doctor Routes
- `/doctor-dashboard` - Doctor Dashboard
- `/doctor-appointments` - Manage Appointments
- `/doctor-onboarding` - Doctor Registration

### Hospital Routes
- `/hospital-registration` - Hospital Registration
- `/hospital-dashboard` - Hospital Management

### Lab Partner Routes
- `/lab-partner-onboarding` - Lab Registration
- `/lab-partner-dashboard` - Lab Management

### Information Pages
- `/about` - About Us
- `/contact` - Contact Us
- `/privacy` - Privacy Policy
- `/terms` - Terms & Conditions
- `/help` - Help & Support

## Component Aliases

The project uses path aliases for cleaner imports:
- `@` - Root directory
- `@/pages` - Pages directory
- `@/Components` - Components directory
- `@/Entities` - Entities directory
- `@/api` - API directory
- `@/lib` - Library directory

Example imports:
```javascript
import Home from '@/pages/Home.jsx'
import Navbar from '@/Components/layout/Navbar'
import { fetchDoctorEntities } from '@/api/base44Client'
```

## API Integration

### Fetch Doctor Entities
```javascript
import { fetchDoctorEntities } from '@/api/base44Client'

const doctors = await fetchDoctorEntities()
```

### Update Entity
```javascript
import { updateDoctorEntity } from '@/api/base44Client'

await updateDoctorEntity(doctorId, {
  name: 'Updated Name',
  rating: 4.9
})
```

## Development Guidelines

### Creating a New Page
1. Create a new file in `pages/` directory
2. Export a default React component
3. Add route in `App.jsx`
4. Import page in App.jsx

### Creating a New Component
1. Create component file in appropriate `Components/` subdirectory
2. Use component aliases for imports
3. Import and use in pages or other components

### Styling
- Use Tailwind CSS classes for styling
- Global styles in `index.css`
- Component-scoped styles using className or CSS modules

### API Calls
- Use functions from `api/base44Client.js`
- Handle errors gracefully
- Use React Query for data fetching when possible

## Troubleshooting

### Port Already in Use
```bash
npm run dev -- --port 3000
```

### Build Errors
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf .vite`

### API Connection Issues
- Check API credentials in `api/base44Client.js`
- Verify Base44 platform status
- Check browser console for error messages

## Browser Support

- Chrome/Edge: Latest versions
- Firefox: Latest versions
- Safari: Latest versions
- Mobile browsers: iOS Safari 12+, Chrome Mobile

## Performance Optimization

- Code splitting with Vite
- Image optimization
- CSS purification with Tailwind
- React Query caching
- Component lazy loading (can be added)

## Security Considerations

- API keys should be moved to environment variables in production
- Implement proper authentication
- Validate all user inputs
- Use HTTPS in production
- Sanitize user-generated content

## Future Enhancements

- User authentication system
- Payment integration
- Real-time notifications
- Offline support (PWA)
- Mobile app (React Native)
- Analytics integration

## Support & Contact

For issues and questions:
- GitHub Issues: [Project Repository]
- Email: support@swasthAI.com

## License

All rights reserved - SwasthAI Platform
