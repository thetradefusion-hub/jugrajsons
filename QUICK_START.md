# 🚀 Quick Start Guide - Admin Panel Backend

## ✅ Step 1: Backend Setup Complete!

Backend files successfully create हो गए हैं। अब आपको ये करना है:

---

## 📋 Next Steps

### 1. MongoDB Install करें

**Option A: Local MongoDB (Development)**
```bash
# Windows के लिए MongoDB Community Edition download करें
# https://www.mongodb.com/try/download/community
# Install करें और service start करें
```

**Option B: MongoDB Atlas (Cloud - Recommended)**
1. https://www.mongodb.com/cloud/atlas पर जाएं
2. Free account बनाएं
3. Free cluster create करें
4. Database user create करें
5. Network Access में IP allow करें
6. Connection string copy करें

---

### 2. Environment Variables Setup

`backend` folder में `.env` file create करें:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/atharvahelth
# या MongoDB Atlas के लिए:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/atharvahelth

JWT_SECRET=atharvahelth_super_secret_jwt_key_2024
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:8080
```

---

### 3. Backend Start करें

```bash
cd backend
npm run dev
```

Server `http://localhost:5000` पर run होगा।

---

### 4. Test API

Browser या Postman में test करें:

```
GET http://localhost:5000/api/health
```

Response:
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

---

### 5. Admin User Create करें

**Method 1: Register करके manually role change करें**

1. Postman/Thunder Client में:
```
POST http://localhost:5000/api/auth/register
Body:
{
  "name": "Admin User",
  "email": "admin@atharva.com",
  "password": "admin123"
}
```

2. MongoDB Compass या MongoDB Shell में:
```javascript
use atharvahelth
db.users.updateOne(
  { email: "admin@atharva.com" },
  { $set: { role: "admin" } }
)
```

**Method 2: Direct MongoDB में create करें**

```javascript
// MongoDB Shell में
use atharvahelth

db.users.insertOne({
  name: "Admin",
  email: "admin@atharva.com",
  password: "$2a$10$hashed_password_here", // bcrypt hash
  role: "admin"
})
```

---

### 6. Frontend को Connect करें

#### 6.1 API Service File Create करें

`src/lib/api.ts` file create करें:

```typescript
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

#### 6.2 .env File में Add करें

Root folder में `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

#### 6.3 AuthContext Update करें

`src/context/AuthContext.tsx` में API calls add करें।

---

### 7. Admin Panel Pages Create करें

Frontend में admin pages add करें:

1. `/admin/login` - Admin login page
2. `/admin/dashboard` - Dashboard with stats
3. `/admin/products` - Product management
4. `/admin/orders` - Order management
5. `/admin/users` - User management

---

## 🎯 API Testing

### Register User
```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "test123"
}
```

### Login
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "test123"
}
```

### Get Products (Public)
```bash
GET http://localhost:5000/api/products
```

### Create Product (Admin - Token Required)
```bash
POST http://localhost:5000/api/products
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "name": "Test Product",
  "slug": "test-product",
  "description": "Test description",
  "shortDescription": "Short desc",
  "price": 1000,
  "originalPrice": 1200,
  "discount": 17,
  "category": "capsules",
  "productType": "Capsules",
  "sku": "TEST-001",
  "images": [],
  "inStock": true,
  "stockCount": 100
}
```

---

## 📚 Important Files

- `backend/src/server.ts` - Main server file
- `backend/src/models/` - Database models
- `backend/src/routes/` - API routes
- `backend/src/controllers/` - Business logic
- `backend/src/middleware/` - Auth & admin middleware

---

## 🐛 Troubleshooting

### MongoDB Connection Error
- MongoDB service check करें
- Connection string verify करें
- Firewall check करें

### Port Already in Use
- Port 5000 change करें `.env` में
- या running process kill करें

### JWT Token Error
- `.env` में `JWT_SECRET` check करें
- Token format verify करें: `Bearer <token>`

---

## ✅ Checklist

- [ ] MongoDB installed/configured
- [ ] `.env` file created with correct values
- [ ] Backend server running (`npm run dev`)
- [ ] Health check working (`/api/health`)
- [ ] Admin user created
- [ ] Frontend API service configured
- [ ] Admin panel pages created

---

**अगर कोई problem हो तो बताएं!** 🚀

