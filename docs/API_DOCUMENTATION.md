# API Documentation

Base URL: `http://localhost:5000/api/v1`

## Authentication

All protected routes require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

---

## Auth Endpoints

### Register User
```http
POST /auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "tourist",
  "phone": "9876543210"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "tourist"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Login
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** Same as register

### Get Current User
```http
GET /auth/me
```
**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "tourist"
  }
}
```

---

## Destination Endpoints

### Get All Destinations
```http
GET /destinations?category=fort&city=Mumbai&page=1&limit=10
```

**Query Parameters:**
- `category` (optional): fort, heritage, festival, cuisine, temple, beach, hill_station, wildlife
- `city` (optional): Filter by city name
- `search` (optional): Search in name and description
- `sort` (optional): rating, popular
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:**
```json
{
  "success": true,
  "count": 10,
  "total": 50,
  "page": 1,
  "pages": 5,
  "data": [
    {
      "_id": "...",
      "name": "Shivneri Fort",
      "description": "Birthplace of Chhatrapati Shivaji Maharaj",
      "category": "fort",
      "location": {
        "city": "Junnar",
        "district": "Pune",
        "coordinates": {
          "latitude": 19.2183,
          "longitude": 73.8478
        }
      },
      "images": [
        {
          "url": "https://...",
          "caption": "Fort entrance"
        }
      ],
      "rating": 4.5,
      "visitCount": 1250
    }
  ]
}
```

### Get Single Destination
```http
GET /destinations/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "Shivneri Fort",
    "description": "...",
    "history": "Detailed historical information...",
    "localCuisines": [...],
    "nearbyAttractions": [...]
  }
}
```

### Create Destination (Admin Only)
```http
POST /destinations
```
**Headers:** 
- `Authorization: Bearer <admin_token>`
- `Content-Type: multipart/form-data`

**Form Data:**
```
name: Shivneri Fort
description: Birthplace of Chhatrapati Shivaji Maharaj
category: fort
location[city]: Junnar
location[district]: Pune
location[coordinates][latitude]: 19.2183
location[coordinates][longitude]: 73.8478
images: [file1, file2, file3]
```

---

## Guide Endpoints

### Get All Guides
```http
GET /guides?specialization=heritage&minPrice=1000&maxPrice=5000
```

**Query Parameters:**
- `specialization`: heritage, cuisine, adventure, photography, trekking, cultural
- `minPrice`: Minimum price per day
- `maxPrice`: Maximum price per day
- `rating`: Minimum rating
- `city`: Filter by location

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "user": {
        "name": "Rajesh Kumar",
        "email": "rajesh@example.com",
        "avatar": "https://..."
      },
      "bio": "Experienced heritage guide...",
      "specializations": ["heritage", "cultural"],
      "pricePerDay": 2000,
      "rating": 4.8,
      "totalReviews": 45,
      "isApproved": true
    }
  ]
}
```

### Update Guide Profile
```http
PUT /guides/me
```
**Headers:** `Authorization: Bearer <guide_token>`

**Request Body:**
```json
{
  "bio": "Updated bio",
  "languages": ["English", "Hindi", "Marathi"],
  "specializations": ["heritage", "cultural"],
  "pricePerDay": 2500,
  "availability": true,
  "locations": ["Mumbai", "Pune", "Nashik"]
}
```

---

## Booking Endpoints

### Create Booking
```http
POST /bookings
```
**Headers:** `Authorization: Bearer <tourist_token>`

**Request Body:**
```json
{
  "guide": "guide_id",
  "destination": "destination_id",
  "startDate": "2024-02-01",
  "endDate": "2024-02-03",
  "numberOfPeople": 2,
  "specialRequests": "Need vegetarian food options"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Booking created successfully",
  "data": {
    "booking": {
      "_id": "...",
      "totalAmount": 12000,
      "platformCommission": 2400,
      "guideEarnings": 9600,
      "status": "pending"
    },
    "razorpayOrder": {
      "id": "order_...",
      "amount": 1200000,
      "currency": "INR"
    }
  }
}
```

### Verify Payment
```http
POST /bookings/verify-payment
```

**Request Body:**
```json
{
  "razorpayOrderId": "order_...",
  "razorpayPaymentId": "pay_...",
  "razorpaySignature": "...",
  "bookingId": "..."
}
```

### Get My Bookings (Tourist)
```http
GET /bookings/my-bookings?status=confirmed&page=1
```

### Get Guide Bookings
```http
GET /bookings/guide-bookings?status=pending
```

### Update Booking Status (Guide)
```http
PUT /bookings/:id/status
```

**Request Body:**
```json
{
  "status": "confirmed"
}
```

---

## Review Endpoints

### Create Review
```http
POST /reviews
```
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "reviewType": "destination",
  "destination": "destination_id",
  "rating": 5,
  "comment": "Amazing experience! Highly recommended.",
  "images": ["https://..."]
}
```

### Get Reviews
```http
GET /reviews?reviewType=guide&guide=guide_id
```

---

## Cuisine Endpoints

### Get All Cuisines
```http
GET /cuisines?category=snack&type=veg&region=Mumbai
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "name": "Vada Pav",
      "description": "Mumbai's iconic street food",
      "category": "snack",
      "type": "veg",
      "region": "Mumbai",
      "spiceLevel": "medium",
      "averagePrice": 20,
      "rating": 4.7
    }
  ]
}
```

---

## Chatbot Endpoints

### Chat with AI
```http
POST /chatbot
```

**Request Body:**
```json
{
  "messages": [
    {
      "role": "user",
      "content": "Suggest a 3-day itinerary for Mumbai"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Here's a suggested 3-day itinerary for Mumbai..."
  }
}
```

### Get Itinerary Suggestions
```http
POST /chatbot/itinerary
```

**Request Body:**
```json
{
  "days": 3,
  "interests": ["heritage", "cuisine"],
  "budget": "medium"
}
```

### Get Food Recommendations
```http
POST /chatbot/food-recommendations
```

**Request Body:**
```json
{
  "location": "Pune",
  "preferences": "spicy food",
  "dietType": "veg"
}
```

---

## Admin Endpoints

All admin endpoints require admin role.

### Get Analytics
```http
GET /admin/analytics
```
**Headers:** `Authorization: Bearer <admin_token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "userStats": [
      { "_id": "tourist", "count": 150 },
      { "_id": "guide", "count": 25 },
      { "_id": "admin", "count": 2 }
    ],
    "revenue": {
      "totalRevenue": 50000,
      "totalBookings": 100
    },
    "topDestinations": [...],
    "monthlyRevenue": [...]
  }
}
```

### Get All Users
```http
GET /admin/users?role=guide&page=1
```

### Update User Status
```http
PUT /admin/users/:id/status
```

**Request Body:**
```json
{
  "isActive": false
}
```

### Approve Guide
```http
PUT /admin/guides/:id/approve
```

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "success": false,
  "message": "Error message here",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

**Common Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request / Validation Error
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

---

## Rate Limiting

- 100 requests per 15 minutes per IP
- Exceeding limit returns `429 Too Many Requests`

## Pagination

All list endpoints support pagination:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)

Response includes:
- `count`: Items in current page
- `total`: Total items
- `page`: Current page
- `pages`: Total pages
