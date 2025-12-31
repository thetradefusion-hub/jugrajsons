# AtharvaHelth Backend API

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment Variables
`.env` file create करें और ये variables add करें:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/atharvahelth
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:8080
```

### 3. MongoDB Setup

**Option A: Local MongoDB**
- MongoDB install करें: https://www.mongodb.com/try/download/community
- MongoDB service start करें
- `MONGODB_URI=mongodb://localhost:27017/atharvahelth`

**Option B: MongoDB Atlas (Cloud - Recommended)**
1. https://www.mongodb.com/cloud/atlas पर account बनाएं
2. Free cluster create करें
3. Database Access में user create करें
4. Network Access में IP allow करें (0.0.0.0/0 for all)
5. Connection string copy करें
6. `.env` में `MONGODB_URI` set करें

### 4. Run Development Server
```bash
npm run dev
```

Server `http://localhost:5000` पर run होगा।

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (protected)

### Products (Public)
- `GET /api/products` - Get all products
- `GET /api/products/:slug` - Get single product

### Products (Admin)
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Admin
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/orders` - Get all orders
- `PUT /api/admin/orders/:id` - Update order status
- `GET /api/admin/users` - Get all users
- `GET /api/admin/products` - Get all products (admin view)

---

## 🔐 Admin User Create करना

Admin user create करने के लिए MongoDB में manually update करें:

```javascript
// MongoDB Shell में
use atharvahelth
db.users.updateOne(
  { email: "admin@atharva.com" },
  { $set: { role: "admin" } }
)
```

या register करके database में directly role change करें।

---

## 📦 Build for Production

```bash
npm run build
npm start
```

---

## 🛠️ Tech Stack

- Node.js + Express
- TypeScript
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs (Password hashing)

---

## 📝 Notes

- सभी admin routes के लिए JWT token required है
- Token format: `Authorization: Bearer <token>`
- Admin role check automatically होता है

