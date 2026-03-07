# Database Schema Documentation

## Database: MongoDB

## Collections Overview

1. Users
2. Guides
3. Destinations
4. Cuisines
5. Bookings
6. Payments
7. Reviews

---

## 1. Users Collection

Stores all user accounts (tourists, guides, admins).

```javascript
{
  _id: ObjectId,
  name: String (required, max: 100),
  email: String (required, unique, lowercase),
  password: String (required, hashed, min: 6),
  role: String (enum: ['tourist', 'guide', 'admin'], default: 'tourist'),
  phone: String (pattern: /^[0-9]{10}$/),
  avatar: String (URL, default: placeholder),
  isActive: Boolean (default: true),
  isVerified: Boolean (default: false),
  refreshToken: String,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `email` (unique)
- `role`

---

## 2. Guides Collection

Extended profile for users with 'guide' role.

```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: 'User', required, unique),
  bio: String (max: 500),
  languages: [String],
  specializations: [String] (enum: ['heritage', 'cuisine', 'adventure', 'photography', 'trekking', 'cultural']),
  experience: Number (min: 0, default: 0),
  pricePerDay: Number (required, min: 0),
  availability: Boolean (default: true),
  rating: Number (min: 0, max: 5, default: 0),
  totalReviews: Number (default: 0),
  totalBookings: Number (default: 0),
  totalEarnings: Number (default: 0),
  isApproved: Boolean (default: false),
  documents: [{
    type: String (enum: ['id_proof', 'certificate', 'license']),
    url: String,
    uploadedAt: Date
  }],
  locations: [String],
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `user` (unique)
- `rating` (descending)
- `pricePerDay`
- `isApproved`

---

## 3. Destinations Collection

Tourist destinations and attractions.

```javascript
{
  _id: ObjectId,
  name: String (required, unique),
  description: String (required, max: 2000),
  category: String (required, enum: ['fort', 'heritage', 'festival', 'cuisine', 'temple', 'beach', 'hill_station', 'wildlife']),
  location: {
    city: String (required),
    district: String (required),
    state: String (default: 'Maharashtra'),
    coordinates: {
      latitude: Number (required),
      longitude: Number (required)
    },
    address: String
  },
  images: [{
    url: String (required),
    caption: String
  }],
  history: String (max: 3000),
  bestTimeToVisit: String,
  entryFee: {
    indian: Number (default: 0),
    foreign: Number (default: 0)
  },
  timings: {
    opening: String,
    closing: String
  },
  rating: Number (min: 0, max: 5, default: 0),
  totalReviews: Number (default: 0),
  visitCount: Number (default: 0),
  localCuisines: [ObjectId] (ref: 'Cuisine'),
  nearbyAttractions: [ObjectId] (ref: 'Destination'),
  isActive: Boolean (default: true),
  createdBy: ObjectId (ref: 'User'),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `name`
- `category`
- `location.city`
- `rating` (descending)
- `visitCount` (descending)
- `location.coordinates.latitude`, `location.coordinates.longitude` (geospatial)

---

## 4. Cuisines Collection

Maharashtrian food items and dishes.

```javascript
{
  _id: ObjectId,
  name: String (required, unique),
  description: String (required, max: 1000),
  category: String (required, enum: ['breakfast', 'lunch', 'dinner', 'snack', 'dessert', 'beverage']),
  type: String (required, enum: ['veg', 'non-veg', 'vegan']),
  region: String (required),
  images: [{
    url: String (required),
    caption: String
  }],
  ingredients: [String],
  preparationTime: Number (min: 0),
  spiceLevel: String (enum: ['mild', 'medium', 'hot', 'very_hot'], default: 'medium'),
  popularIn: [String],
  averagePrice: Number (min: 0),
  rating: Number (min: 0, max: 5, default: 0),
  totalReviews: Number (default: 0),
  isActive: Boolean (default: true),
  createdBy: ObjectId (ref: 'User'),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `name`
- `category`
- `type`
- `region`
- `rating` (descending)

---

## 5. Bookings Collection

Tour booking records.

```javascript
{
  _id: ObjectId,
  tourist: ObjectId (ref: 'User', required),
  guide: ObjectId (ref: 'Guide', required),
  destination: ObjectId (ref: 'Destination', required),
  startDate: Date (required),
  endDate: Date (required),
  numberOfDays: Number (required, min: 1),
  numberOfPeople: Number (required, min: 1, default: 1),
  totalAmount: Number (required, min: 0),
  platformCommission: Number (required, min: 0),
  guideEarnings: Number (required, min: 0),
  status: String (enum: ['pending', 'confirmed', 'rejected', 'completed', 'cancelled'], default: 'pending'),
  paymentStatus: String (enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending'),
  paymentId: String,
  specialRequests: String (max: 500),
  cancellationReason: String,
  cancelledBy: ObjectId (ref: 'User'),
  cancelledAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `tourist`
- `guide`
- `destination`
- `status`
- `startDate`
- `createdAt` (descending)

**Pre-save Hook:**
- Automatically calculates `numberOfDays` from `startDate` and `endDate`

---

## 6. Payments Collection

Payment transaction records.

```javascript
{
  _id: ObjectId,
  booking: ObjectId (ref: 'Booking', required),
  user: ObjectId (ref: 'User', required),
  amount: Number (required, min: 0),
  currency: String (default: 'INR'),
  paymentMethod: String (enum: ['razorpay', 'card', 'upi', 'netbanking', 'wallet'], default: 'razorpay'),
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,
  status: String (enum: ['pending', 'success', 'failed', 'refunded'], default: 'pending'),
  transactionDate: Date (default: now),
  refundAmount: Number (default: 0),
  refundDate: Date,
  refundReason: String,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `booking`
- `user`
- `status`
- `razorpayPaymentId`
- `transactionDate` (descending)

---

## 7. Reviews Collection

User reviews and ratings.

```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: 'User', required),
  reviewType: String (required, enum: ['destination', 'guide', 'cuisine']),
  destination: ObjectId (ref: 'Destination'),
  guide: ObjectId (ref: 'Guide'),
  cuisine: ObjectId (ref: 'Cuisine'),
  booking: ObjectId (ref: 'Booking'),
  rating: Number (required, min: 1, max: 5),
  comment: String (required, max: 1000),
  images: [String],
  isVerified: Boolean (default: false),
  helpfulCount: Number (default: 0),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `user`
- `reviewType`
- `destination`
- `guide`
- `cuisine`
- `rating` (descending)
- `createdAt` (descending)

**Compound Unique Indexes:**
- `user` + `destination` (sparse)
- `user` + `guide` + `booking` (sparse)
- `user` + `cuisine` (sparse)

---

## Entity Relationship Diagram

```
┌─────────────┐
│    Users    │
│  (Base)     │
└──────┬──────┘
       │
       ├──────────────────────────────┐
       │                              │
       ▼                              ▼
┌─────────────┐              ┌──────────────┐
│   Guides    │              │   Bookings   │
│ (1:1 User)  │◄─────────────┤              │
└──────┬──────┘              └──────┬───────┘
       │                            │
       │                            ├──────────┐
       │                            │          │
       │                            ▼          ▼
       │                     ┌─────────────┐ ┌──────────┐
       │                     │Destinations │ │ Payments │
       │                     └──────┬──────┘ └──────────┘
       │                            │
       │                            │
       │                            ▼
       │                     ┌─────────────┐
       │                     │  Cuisines   │
       │                     └──────┬──────┘
       │                            │
       │                            │
       └────────────┬───────────────┘
                    │
                    ▼
             ┌─────────────┐
             │   Reviews   │
             │ (Polymorphic)│
             └─────────────┘
```

## Relationships

1. **User → Guide**: One-to-One (optional)
   - A user with role 'guide' has one guide profile

2. **User → Booking**: One-to-Many
   - A tourist can have multiple bookings

3. **Guide → Booking**: One-to-Many
   - A guide can have multiple bookings

4. **Destination → Booking**: One-to-Many
   - A destination can have multiple bookings

5. **Booking → Payment**: One-to-One
   - Each booking has one payment record

6. **Destination → Cuisine**: Many-to-Many
   - Destinations can have multiple local cuisines
   - Cuisines can be popular in multiple destinations

7. **Destination → Destination**: Many-to-Many (self-reference)
   - Destinations can have nearby attractions

8. **User/Guide/Destination/Cuisine → Review**: One-to-Many (Polymorphic)
   - Reviews can be for destinations, guides, or cuisines

## Revenue Model Implementation

**Commission Calculation:**
```javascript
totalAmount = pricePerDay × numberOfDays × numberOfPeople
platformCommission = totalAmount × 0.20  // 20%
guideEarnings = totalAmount × 0.80       // 80%
```

**Stored in Booking:**
- `totalAmount`: Full booking amount
- `platformCommission`: 20% for platform
- `guideEarnings`: 80% for guide

**Updated on Completion:**
- Guide's `totalEarnings` += `guideEarnings`
- Admin analytics track `platformCommission`

## Indexing Strategy

### Performance Indexes
- Frequently queried fields (email, role, category)
- Foreign keys (user, guide, destination)
- Sort fields (rating, createdAt, visitCount)

### Unique Indexes
- User email
- Guide user reference
- Destination name
- Cuisine name

### Compound Indexes
- Review uniqueness constraints
- Geospatial queries (coordinates)

## Data Validation

All collections use Mongoose schema validation:
- Required fields
- String length limits
- Number ranges
- Enum values
- Email format
- Phone number pattern
- URL format

## Security Considerations

1. **Password Storage**: Bcrypt hashing (12 rounds)
2. **Sensitive Fields**: Excluded from queries (password, refreshToken)
3. **Soft Deletes**: `isActive` flag instead of hard deletes
4. **Audit Trail**: `createdAt` and `updatedAt` timestamps
5. **Input Sanitization**: MongoDB injection prevention
