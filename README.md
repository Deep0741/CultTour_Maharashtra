# CulTour Maharashtra - Culinary and Cultural Tourism Platform

A complete end-to-end production-ready web application for exploring Maharashtra's rich cultural heritage, historic forts, and authentic cuisine with expert local guides.

## 🚀 Features

### Authentication & Authorization
- JWT-based authentication with refresh tokens
- Role-based access control (Admin, Guide, Tourist)
- Secure password hashing with bcrypt
- Protected routes and API endpoints

### Tourist Features
- Browse destinations by category (Forts, Festivals, Cuisine, Heritage)
- Detailed destination pages with history, images, and location maps
- Filter and search functionality
- Book tours with verified guides
- Secure payment integration (Razorpay)
- View booking history
- Leave reviews and ratings
- AI chatbot for personalized recommendations

### Guide Features
- Create and manage guide profile
- Set tour pricing
- Accept/reject booking requests
- View earnings dashboard
- Track ratings and reviews
- Upload verification documents
- Manage availability

### Admin Features
- Complete CRUD operations for destinations and cuisines
- User management (activate/deactivate accounts)
- Approve guide applications
- Analytics dashboard with:
  - Total bookings and revenue
  - Active users statistics
  - Most visited destinations
  - Monthly revenue trends
- 20% commission model implementation

### AI Integration
- OpenAI-powered chatbot assistant
- Personalized itinerary suggestions
- Food recommendations based on location and preferences
- Context-aware conversations

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (jsonwebtoken)
- **Security:** Helmet, CORS, Rate Limiting, XSS Protection
- **File Upload:** Multer + AWS S3
- **Payment:** Razorpay
- **AI:** OpenAI API
- **Validation:** Joi

### Frontend
- **Framework:** React 18 with Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router v6
- **State Management:** Context API
- **HTTP Client:** Axios
- **Icons:** React Icons
- **Notifications:** React Toastify

### Cloud & DevOps
- **Cloud Provider:** AWS
- **Storage:** AWS S3
- **Database:** MongoDB Atlas
- **Deployment:** AWS EC2 / Elastic Beanstalk

## 📁 Project Structure

```
cultour-maharashtra-platform/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   ├── aws.js
│   │   │   ├── razorpay.js
│   │   │   └── openai.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── destinationController.js
│   │   │   ├── guideController.js
│   │   │   ├── bookingController.js
│   │   │   ├── reviewController.js
│   │   │   ├── cuisineController.js
│   │   │   ├── chatbotController.js
│   │   │   └── adminController.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   ├── errorHandler.js
│   │   │   └── validate.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Guide.js
│   │   │   ├── Destination.js
│   │   │   ├── Cuisine.js
│   │   │   ├── Booking.js
│   │   │   ├── Payment.js
│   │   │   └── Review.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── destinationRoutes.js
│   │   │   ├── guideRoutes.js
│   │   │   ├── bookingRoutes.js
│   │   │   ├── reviewRoutes.js
│   │   │   ├── cuisineRoutes.js
│   │   │   ├── chatbotRoutes.js
│   │   │   └── adminRoutes.js
│   │   ├── validators/
│   │   │   ├── authValidator.js
│   │   │   └── bookingValidator.js
│   │   └── server.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   └── ProtectedRoute.jsx
│   │   │   └── layout/
│   │   │       ├── Navbar.jsx
│   │   │       └── Footer.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Register.jsx
│   │   │   ├── public/
│   │   │   │   └── Home.jsx
│   │   │   ├── tourist/
│   │   │   │   └── Dashboard.jsx
│   │   │   ├── guide/
│   │   │   │   └── Dashboard.jsx
│   │   │   └── admin/
│   │   │       └── Dashboard.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── destinationService.js
│   │   │   └── bookingService.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── index.html
└── docs/
    ├── API_DOCUMENTATION.md
    ├── DATABASE_SCHEMA.md
    └── DEPLOYMENT_GUIDE.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- AWS Account (for S3 storage)
- Razorpay Account (for payments)
- OpenAI API Key (for chatbot)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env` with your credentials:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_S3_BUCKET=your_bucket_name
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
OPENAI_API_KEY=your_openai_key
```

5. Start development server:
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
VITE_API_URL=http://localhost:5000/api/v1
```

4. Start development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

## 📊 Database Schema

### Collections

1. **Users** - Stores user authentication and profile data
2. **Guides** - Guide-specific information and pricing
3. **Destinations** - Tourist destinations with details
4. **Cuisines** - Maharashtrian food items
5. **Bookings** - Tour booking records
6. **Payments** - Payment transaction records
7. **Reviews** - User reviews and ratings

See `docs/DATABASE_SCHEMA.md` for detailed schema information.

## 🔐 Security Features

- JWT access and refresh token system
- Password hashing with bcrypt (12 rounds)
- Rate limiting (100 requests per 15 minutes)
- CORS configuration
- Helmet security headers
- XSS protection
- MongoDB injection prevention
- Input validation with Joi
- Role-based authorization

## 💳 Payment Flow

1. Tourist creates booking
2. Backend creates Razorpay order
3. Frontend displays Razorpay checkout
4. Payment verification with signature
5. Automatic commission split (20% platform, 80% guide)
6. Payment record stored in database

## 🤖 AI Chatbot Features

- Natural language conversation
- Itinerary planning based on days and interests
- Food recommendations by location and diet
- Context-aware responses
- Integration with destination and cuisine database

## 📱 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - Logout user

### Destinations
- `GET /api/v1/destinations` - Get all destinations
- `GET /api/v1/destinations/:id` - Get single destination
- `POST /api/v1/destinations` - Create destination (Admin)
- `PUT /api/v1/destinations/:id` - Update destination (Admin)
- `DELETE /api/v1/destinations/:id` - Delete destination (Admin)

### Guides
- `GET /api/v1/guides` - Get all guides
- `GET /api/v1/guides/:id` - Get single guide
- `GET /api/v1/guides/me` - Get my profile (Guide)
- `PUT /api/v1/guides/me` - Update profile (Guide)
- `PUT /api/v1/guides/:id/approve` - Approve guide (Admin)

### Bookings
- `POST /api/v1/bookings` - Create booking (Tourist)
- `POST /api/v1/bookings/verify-payment` - Verify payment
- `GET /api/v1/bookings/my-bookings` - Get my bookings (Tourist)
- `GET /api/v1/bookings/guide-bookings` - Get guide bookings (Guide)
- `PUT /api/v1/bookings/:id/status` - Update status (Guide)

See `docs/API_DOCUMENTATION.md` for complete API reference.

## 🚀 Deployment

### AWS Deployment Steps

1. **Setup EC2 Instance**
   - Launch Ubuntu 22.04 LTS instance
   - Configure security groups (ports 80, 443, 5000, 3000)
   - SSH into instance

2. **Install Dependencies**
```bash
sudo apt update
sudo apt install nodejs npm nginx mongodb-tools
```

3. **Setup MongoDB Atlas**
   - Create cluster on MongoDB Atlas
   - Whitelist EC2 IP address
   - Get connection string

4. **Setup AWS S3**
   - Create S3 bucket
   - Configure IAM user with S3 permissions
   - Set bucket policy for public read

5. **Deploy Backend**
```bash
cd backend
npm install --production
pm2 start src/server.js --name cultour-api
pm2 save
pm2 startup
```

6. **Deploy Frontend**
```bash
cd frontend
npm install
npm run build
```

7. **Configure Nginx**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        root /var/www/cultour-frontend/dist;
        try_files $uri /index.html;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

8. **Setup SSL with Let's Encrypt**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

See `docs/DEPLOYMENT_GUIDE.md` for detailed deployment instructions.

## 🧪 Testing

Run backend tests:
```bash
cd backend
npm test
```

## 📝 Environment Variables

### Backend
See `.env.example` for all required environment variables.

### Frontend
```env
VITE_API_URL=your_api_url
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Team

CulTour Maharashtra Development Team

## 📧 Support

For support, email support@cultourmaharashtra.com

## 🙏 Acknowledgments

- Maharashtra Tourism Department
- OpenAI for AI capabilities
- AWS for cloud infrastructure
- Razorpay for payment gateway
