# Quick Start Guide

Get CulTour Maharashtra running locally in 10 minutes!

## Prerequisites

Ensure you have installed:
- Node.js v18+ ([Download](https://nodejs.org/))
- MongoDB ([Download](https://www.mongodb.com/try/download/community)) OR MongoDB Atlas account
- Git ([Download](https://git-scm.com/))

## Option 1: Local Setup (Recommended for Development)

### Step 1: Clone Repository

```bash
git clone <repository-url>
cd cultour-maharashtra-platform
```

### Step 2: Setup Backend

```bash
cd backend
npm install
```

Create `.env` file:
```bash
cp .env.example .env
```

Update `.env` with minimum required values:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cultour-maharashtra
JWT_SECRET=your_dev_secret_key_here
JWT_REFRESH_SECRET=your_dev_refresh_secret_here
FRONTEND_URL=http://localhost:3000
PLATFORM_COMMISSION=20
```

Start backend:
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### Step 3: Setup Frontend

Open new terminal:
```bash
cd frontend
npm install
```

Create `.env` file:
```env
VITE_API_URL=http://localhost:5000/api/v1
```

Start frontend:
```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

### Step 4: Create Admin User

Use Postman or curl to create admin:

```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@cultour.com",
    "password": "admin123",
    "role": "admin"
  }'
```

Then manually update the user role in MongoDB:
```javascript
db.users.updateOne(
  { email: "admin@cultour.com" },
  { $set: { role: "admin" } }
)
```

### Step 5: Access Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Health: http://localhost:5000/health

---

## Option 2: Docker Setup (Easiest)

### Step 1: Install Docker

- [Docker Desktop for Windows/Mac](https://www.docker.com/products/docker-desktop)
- [Docker for Linux](https://docs.docker.com/engine/install/)

### Step 2: Run with Docker Compose

```bash
cd cultour-maharashtra-platform
docker-compose up -d
```

This will start:
- MongoDB on port 27017
- Backend on port 5000
- Frontend on port 3000

### Step 3: Access Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### Stop Services

```bash
docker-compose down
```

---

## Testing the Application

### 1. Register as Tourist

1. Go to http://localhost:3000
2. Click "Register"
3. Fill form with role "Tourist"
4. Submit

### 2. Register as Guide

1. Click "Register"
2. Fill form with role "Guide"
3. Submit
4. Login as admin
5. Approve the guide from admin dashboard

### 3. Test Booking Flow

1. Login as tourist
2. Browse destinations
3. Select a guide
4. Create booking
5. (Payment will be in test mode without actual Razorpay keys)

---

## Optional: Setup External Services

### MongoDB Atlas (Cloud Database)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`

### AWS S3 (Image Storage)

1. Create AWS account
2. Create S3 bucket
3. Create IAM user with S3 access
4. Update `.env`:
```env
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_REGION=ap-south-1
AWS_S3_BUCKET=your_bucket_name
```

### Razorpay (Payments)

1. Create account at [Razorpay](https://razorpay.com/)
2. Get test API keys
3. Update `.env`:
```env
RAZORPAY_KEY_ID=your_test_key_id
RAZORPAY_KEY_SECRET=your_test_key_secret
```

### OpenAI (Chatbot)

1. Create account at [OpenAI](https://platform.openai.com/)
2. Generate API key
3. Update `.env`:
```env
OPENAI_API_KEY=your_openai_key
```

---

## Common Issues & Solutions

### Issue: MongoDB Connection Failed

**Solution:**
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`
- For Atlas, whitelist your IP

### Issue: Port Already in Use

**Solution:**
```bash
# Kill process on port 5000
npx kill-port 5000

# Kill process on port 3000
npx kill-port 3000
```

### Issue: Module Not Found

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: CORS Error

**Solution:**
- Ensure `FRONTEND_URL` in backend `.env` matches frontend URL
- Check CORS configuration in `backend/src/server.js`

---

## Development Workflow

### Backend Development

```bash
cd backend
npm run dev  # Auto-restart on file changes
```

### Frontend Development

```bash
cd frontend
npm run dev  # Hot reload enabled
```

### View Logs

```bash
# Backend logs
cd backend
npm run dev

# Frontend logs
cd frontend
npm run dev
```

---

## Project Structure Quick Reference

```
backend/
├── src/
│   ├── config/       # Database, AWS, Payment configs
│   ├── controllers/  # Request handlers
│   ├── middleware/   # Auth, validation, error handling
│   ├── models/       # MongoDB schemas
│   ├── routes/       # API routes
│   └── server.js     # Entry point

frontend/
├── src/
│   ├── components/   # Reusable UI components
│   ├── pages/        # Page components
│   ├── context/      # State management
│   ├── services/     # API calls
│   └── App.jsx       # Main app component
```

---

## Next Steps

1. **Explore API**: Import Postman collection from `docs/POSTMAN_COLLECTION.json`
2. **Read Documentation**: Check `docs/` folder for detailed guides
3. **Customize**: Modify code to fit your requirements
4. **Deploy**: Follow `docs/DEPLOYMENT_GUIDE.md` for production deployment

---

## Useful Commands

```bash
# Backend
npm run dev          # Start development server
npm start            # Start production server
npm test             # Run tests

# Frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Docker
docker-compose up    # Start all services
docker-compose down  # Stop all services
docker-compose logs  # View logs
```

---

## Getting Help

- Check `README.md` for detailed documentation
- Review `docs/API_DOCUMENTATION.md` for API reference
- See `docs/DATABASE_SCHEMA.md` for database structure
- Follow `docs/DEPLOYMENT_GUIDE.md` for AWS deployment

---

## Default Test Credentials

After seeding (if you create seed data):

**Admin:**
- Email: admin@cultour.com
- Password: admin123

**Guide:**
- Email: guide@cultour.com
- Password: guide123

**Tourist:**
- Email: tourist@cultour.com
- Password: tourist123

---

## Success Checklist

- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] MongoDB connected
- [ ] Can register new user
- [ ] Can login
- [ ] Can view destinations
- [ ] API health check returns 200

---

## Support

For issues or questions:
1. Check documentation in `docs/` folder
2. Review error logs
3. Search existing issues
4. Create new issue with details

Happy coding! 🚀
