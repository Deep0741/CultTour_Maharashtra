# 🏛️ CulTour Maharashtra - Complete Project Index

## 📋 Table of Contents

1. [Quick Links](#quick-links)
2. [Project Structure](#project-structure)
3. [Getting Started](#getting-started)
4. [Documentation](#documentation)
5. [Features](#features)
6. [Tech Stack](#tech-stack)
7. [File Reference](#file-reference)

---

## 🔗 Quick Links

| Resource | Location | Description |
|----------|----------|-------------|
| **Quick Start** | [QUICKSTART.md](QUICKSTART.md) | Get running in 10 minutes |
| **Full Documentation** | [README.md](README.md) | Complete project guide |
| **API Reference** | [docs/API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md) | All API endpoints |
| **Database Schema** | [docs/DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md) | Database design |
| **Deployment Guide** | [docs/DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md) | AWS deployment |
| **Postman Collection** | [docs/POSTMAN_COLLECTION.json](docs/POSTMAN_COLLECTION.json) | API testing |
| **Project Summary** | [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) | Complete overview |

---

## 📁 Project Structure

```
cultour-maharashtra-platform/
│
├── 📄 README.md                    # Main documentation
├── 📄 QUICKSTART.md                # Quick setup guide
├── 📄 PROJECT_SUMMARY.md           # Project overview
├── 📄 docker-compose.yml           # Docker setup
├── 📄 .gitignore                   # Git ignore rules
├── 📄 setup.bat                    # Windows setup script
├── 📄 start.bat                    # Windows start script
│
├── 📂 backend/                     # Backend API
│   ├── 📂 src/
│   │   ├── 📂 config/             # Configuration files
│   │   │   ├── database.js        # MongoDB connection
│   │   │   ├── aws.js             # S3 configuration
│   │   │   ├── razorpay.js        # Payment gateway
│   │   │   └── openai.js          # AI chatbot
│   │   │
│   │   ├── 📂 models/             # Database schemas
│   │   │   ├── User.js            # User model
│   │   │   ├── Guide.js           # Guide model
│   │   │   ├── Destination.js     # Destination model
│   │   │   ├── Cuisine.js         # Cuisine model
│   │   │   ├── Booking.js         # Booking model
│   │   │   ├── Payment.js         # Payment model
│   │   │   └── Review.js          # Review model
│   │   │
│   │   ├── 📂 controllers/        # Request handlers
│   │   │   ├── authController.js
│   │   │   ├── destinationController.js
│   │   │   ├── guideController.js
│   │   │   ├── bookingController.js
│   │   │   ├── reviewController.js
│   │   │   ├── cuisineController.js
│   │   │   ├── chatbotController.js
│   │   │   └── adminController.js
│   │   │
│   │   ├── 📂 routes/             # API routes
│   │   │   ├── authRoutes.js
│   │   │   ├── destinationRoutes.js
│   │   │   ├── guideRoutes.js
│   │   │   ├── bookingRoutes.js
│   │   │   ├── reviewRoutes.js
│   │   │   ├── cuisineRoutes.js
│   │   │   ├── chatbotRoutes.js
│   │   │   └── adminRoutes.js
│   │   │
│   │   ├── 📂 middleware/         # Middleware
│   │   │   ├── auth.js            # Authentication
│   │   │   ├── errorHandler.js    # Error handling
│   │   │   └── validate.js        # Validation
│   │   │
│   │   ├── 📂 validators/         # Input validators
│   │   │   ├── authValidator.js
│   │   │   └── bookingValidator.js
│   │   │
│   │   └── 📄 server.js           # Main server file
│   │
│   ├── 📄 package.json            # Dependencies
│   ├── 📄 Dockerfile              # Docker config
│   └── 📄 .env.example            # Environment template
│
├── 📂 frontend/                   # React frontend
│   ├── 📂 src/
│   │   ├── 📂 components/        # UI components
│   │   │   ├── 📂 common/
│   │   │   │   └── ProtectedRoute.jsx
│   │   │   └── 📂 layout/
│   │   │       ├── Navbar.jsx
│   │   │       └── Footer.jsx
│   │   │
│   │   ├── 📂 pages/             # Page components
│   │   │   ├── 📂 auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Register.jsx
│   │   │   ├── 📂 public/
│   │   │   │   └── Home.jsx
│   │   │   ├── 📂 tourist/
│   │   │   │   └── Dashboard.jsx
│   │   │   ├── 📂 guide/
│   │   │   │   └── Dashboard.jsx
│   │   │   └── 📂 admin/
│   │   │       └── Dashboard.jsx
│   │   │
│   │   ├── 📂 context/           # State management
│   │   │   └── AuthContext.jsx
│   │   │
│   │   ├── 📂 services/          # API services
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── destinationService.js
│   │   │   └── bookingService.js
│   │   │
│   │   ├── 📄 App.jsx            # Main app
│   │   ├── 📄 main.jsx           # Entry point
│   │   └── 📄 index.css          # Global styles
│   │
│   ├── 📄 package.json           # Dependencies
│   ├── 📄 vite.config.js         # Vite config
│   ├── 📄 tailwind.config.js     # Tailwind config
│   ├── 📄 postcss.config.js      # PostCSS config
│   ├── 📄 Dockerfile             # Docker config
│   ├── 📄 nginx.conf             # Nginx config
│   └── 📄 index.html             # HTML template
│
└── 📂 docs/                      # Documentation
    ├── 📄 API_DOCUMENTATION.md   # API reference
    ├── 📄 DATABASE_SCHEMA.md     # Database design
    ├── 📄 DEPLOYMENT_GUIDE.md    # AWS deployment
    └── 📄 POSTMAN_COLLECTION.json # API testing
```

---

## 🚀 Getting Started

### Option 1: Automated Setup (Windows)

```bash
# Run setup script
setup.bat

# Update backend/.env with your credentials

# Start application
start.bat
```

### Option 2: Manual Setup

```bash
# Backend
cd backend
npm install
cp .env.example .env
# Update .env file
npm run dev

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

### Option 3: Docker

```bash
docker-compose up -d
```

**Access:**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

---

## 📚 Documentation

### For Developers

1. **[QUICKSTART.md](QUICKSTART.md)** - Start here!
   - Local setup in 10 minutes
   - Docker setup
   - Common issues and solutions

2. **[README.md](README.md)** - Complete guide
   - Project overview
   - Features list
   - Tech stack details
   - Setup instructions
   - Security features

3. **[docs/API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md)** - API reference
   - All 40+ endpoints
   - Request/response examples
   - Authentication
   - Error handling

4. **[docs/DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md)** - Database design
   - 7 collections
   - Relationships
   - Indexes
   - ER diagram

### For DevOps

5. **[docs/DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md)** - Production deployment
   - AWS EC2 setup
   - MongoDB Atlas
   - S3 configuration
   - SSL setup
   - Nginx configuration
   - PM2 process management
   - Monitoring
   - Backup strategy

### For Testing

6. **[docs/POSTMAN_COLLECTION.json](docs/POSTMAN_COLLECTION.json)** - API testing
   - Import into Postman
   - Pre-configured requests
   - Environment variables
   - Test scripts

### Project Overview

7. **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Complete summary
   - All files created
   - Features implemented
   - Statistics
   - Checklist

---

## ✨ Features

### 🔐 Authentication & Security
- JWT access + refresh tokens
- Role-based access (Admin, Guide, Tourist)
- Password hashing (bcrypt)
- Rate limiting
- CORS, Helmet, XSS protection

### 👤 User Roles

**Tourist:**
- Browse destinations
- Book tours with guides
- Make payments (Razorpay)
- Leave reviews
- View booking history
- AI chatbot assistance

**Guide:**
- Create profile
- Set pricing
- Accept/reject bookings
- View earnings
- Manage availability
- Upload documents

**Admin:**
- Manage destinations
- Manage cuisines
- Approve guides
- View analytics
- Manage users
- Track revenue

### 🤖 AI Features
- OpenAI GPT-3.5 chatbot
- Itinerary suggestions
- Food recommendations
- Context-aware responses

### 💳 Payment System
- Razorpay integration
- Secure payment verification
- 20% platform commission
- 80% guide earnings
- Transaction tracking

### ⭐ Review System
- 5-star ratings
- Text reviews with images
- Review destinations, guides, cuisines
- Average rating calculation
- Verified reviews

---

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Database:** MongoDB + Mongoose
- **Authentication:** JWT
- **File Storage:** AWS S3
- **Payments:** Razorpay
- **AI:** OpenAI API
- **Security:** Helmet, CORS, Rate Limiting

### Frontend
- **Framework:** React 18
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router v6
- **State:** Context API
- **HTTP:** Axios
- **Icons:** React Icons
- **Notifications:** React Toastify

### DevOps
- **Containerization:** Docker
- **Orchestration:** Docker Compose
- **Web Server:** Nginx
- **Process Manager:** PM2
- **Cloud:** AWS (EC2, S3, Route 53)
- **SSL:** Let's Encrypt

---

## 📖 File Reference

### Configuration Files

| File | Purpose |
|------|---------|
| `backend/.env.example` | Environment variables template |
| `backend/package.json` | Backend dependencies |
| `frontend/package.json` | Frontend dependencies |
| `docker-compose.yml` | Multi-container setup |
| `vite.config.js` | Vite configuration |
| `tailwind.config.js` | Tailwind CSS config |

### Backend Core Files

| File | Purpose |
|------|---------|
| `backend/src/server.js` | Main Express server |
| `backend/src/config/database.js` | MongoDB connection |
| `backend/src/config/aws.js` | S3 file upload |
| `backend/src/config/razorpay.js` | Payment gateway |
| `backend/src/config/openai.js` | AI chatbot |

### Database Models

| File | Purpose |
|------|---------|
| `backend/src/models/User.js` | User authentication |
| `backend/src/models/Guide.js` | Guide profiles |
| `backend/src/models/Destination.js` | Tourist places |
| `backend/src/models/Cuisine.js` | Food items |
| `backend/src/models/Booking.js` | Tour bookings |
| `backend/src/models/Payment.js` | Transactions |
| `backend/src/models/Review.js` | Ratings & reviews |

### API Controllers

| File | Purpose |
|------|---------|
| `authController.js` | Authentication logic |
| `destinationController.js` | Destination CRUD |
| `guideController.js` | Guide management |
| `bookingController.js` | Booking + payment |
| `reviewController.js` | Review system |
| `cuisineController.js` | Cuisine management |
| `chatbotController.js` | AI assistant |
| `adminController.js` | Admin analytics |

### Frontend Pages

| File | Purpose |
|------|---------|
| `pages/auth/Login.jsx` | Login page |
| `pages/auth/Register.jsx` | Registration |
| `pages/public/Home.jsx` | Landing page |
| `pages/tourist/Dashboard.jsx` | Tourist dashboard |
| `pages/guide/Dashboard.jsx` | Guide dashboard |
| `pages/admin/Dashboard.jsx` | Admin analytics |

---

## 🎯 Quick Commands

### Development

```bash
# Backend
cd backend
npm run dev          # Start with nodemon

# Frontend
cd frontend
npm run dev          # Start with Vite

# Docker
docker-compose up    # Start all services
docker-compose down  # Stop all services
```

### Production

```bash
# Backend
npm start            # Start production server

# Frontend
npm run build        # Build for production
npm run preview      # Preview build
```

### Testing

```bash
# Backend
npm test             # Run tests

# API Testing
# Import docs/POSTMAN_COLLECTION.json into Postman
```

---

## 📊 Project Statistics

- **Total Files:** 60+
- **Lines of Code:** 10,000+
- **Documentation:** 2,000+ lines
- **API Endpoints:** 40+
- **Database Collections:** 7
- **User Roles:** 3
- **Features:** 50+

---

## ✅ Production Checklist

- ✅ Complete backend API
- ✅ Responsive frontend
- ✅ JWT authentication
- ✅ Role-based authorization
- ✅ Payment integration
- ✅ AI chatbot
- ✅ Review system
- ✅ Admin analytics
- ✅ Security middleware
- ✅ Error handling
- ✅ Input validation
- ✅ Database indexes
- ✅ API documentation
- ✅ Deployment guide
- ✅ Docker support
- ✅ SSL ready

---

## 🆘 Support

### Documentation
- Read [QUICKSTART.md](QUICKSTART.md) for setup
- Check [README.md](README.md) for details
- Review [API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md) for endpoints

### Common Issues
- MongoDB connection: Check connection string
- Port in use: Kill process or change port
- Module not found: Delete node_modules and reinstall
- CORS error: Check FRONTEND_URL in backend .env

### Logs
```bash
# Backend logs
cd backend
npm run dev

# Frontend logs
cd frontend
npm run dev

# Docker logs
docker-compose logs
```

---

## 🎉 Ready to Launch!

This is a **complete, production-ready** application with:
- ✅ Modern tech stack
- ✅ Clean architecture
- ✅ Security best practices
- ✅ Comprehensive documentation
- ✅ Deployment ready
- ✅ Scalable design

**Start building your tourism platform today! 🚀**

---

## 📞 Contact

For questions or support:
- Check documentation first
- Review error logs
- Search existing issues
- Create detailed bug reports

---

**Built with ❤️ for Maharashtra Tourism**
