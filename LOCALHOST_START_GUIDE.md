# 🚀 Localhost पर Server Start करने का Guide

## 📋 Prerequisites

### Required Software
- ✅ Node.js installed (v18+)
- ✅ npm or yarn installed
- ✅ MongoDB connection string (`.env` file में)

---

## 🎯 Quick Start (2 Terminals Required)

### Terminal 1: Backend Server

```bash
# Backend folder में जाएं
cd backend

# Dependencies install करें (पहली बार)
npm install

# Server start करें
npm run dev
```

**Backend URL:** `http://localhost:5000/api`

---

### Terminal 2: Frontend Server

```bash
# Root folder में जाएं (backend से बाहर)
cd ..

# Dependencies install करें (पहली बार)
npm install

# Frontend server start करें
npm run dev
```

**Frontend URL:** `http://localhost:8080`

---

## 📝 Step-by-Step Instructions

### Step 1: Backend Setup

1. **Terminal/PowerShell open करें**
2. **Backend folder में navigate करें:**
   ```bash
   cd backend
   ```

3. **Environment variables setup करें:**
   - `backend/.env` file create करें (अगर नहीं है)
   - Required variables add करें:
     ```env
     NODE_ENV=development
     PORT=5000
     MONGODB_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret_key
     JWT_EXPIRE=7d
     FRONTEND_URL=http://localhost:8080
     RAZORPAY_KEY_ID=your_key_id
     RAZORPAY_KEY_SECRET=your_key_secret
     SHIPROCKET_EMAIL=your_email
     SHIPROCKET_PASSWORD=your_password
     ```

4. **Dependencies install करें (पहली बार):**
   ```bash
   npm install
   ```

5. **Backend server start करें:**
   ```bash
   npm run dev
   ```

6. **Verify:**
   - Terminal में दिखना चाहिए: `🚀 Server running on port 5000`
   - Browser में check करें: `http://localhost:5000/api/health`

---

### Step 2: Frontend Setup

1. **New Terminal/PowerShell window open करें**
   - ⚠️ **Important:** Backend terminal को close न करें!

2. **Root folder में navigate करें:**
   ```bash
   cd path/to/atharvahelth
   # या अगर पहले से backend folder में हैं तो:
   cd ..
   ```

3. **Environment variables setup करें:**
   - Root folder में `.env` file create करें (अगर नहीं है)
   - Required variable add करें:
     ```env
     VITE_API_URL=http://localhost:5000/api
     ```

4. **Dependencies install करें (पहली बार):**
   ```bash
   npm install
   ```

5. **Frontend server start करें:**
   ```bash
   npm run dev
   ```

6. **Verify:**
   - Terminal में URL दिखना चाहिए: `Local: http://localhost:8080`
   - Browser automatically open होगा
   - Website load होना चाहिए

---

## ✅ Verification

### Backend Check
1. Browser में जाएं: `http://localhost:5000/api/health`
2. Response आना चाहिए:
   ```json
   {
     "status": "OK",
     "message": "Server is running"
   }
   ```

### Frontend Check
1. Browser में जाएं: `http://localhost:8080`
2. Website load होना चाहिए
3. Products load हो रहे हैं या नहीं check करें

---

## 🔧 Common Commands

### Backend Commands
```bash
cd backend

# Development mode (hot reload)
npm run dev

# Build TypeScript
npm run build

# Production mode
npm start

# Stop server: Ctrl + C
```

### Frontend Commands
```bash
# Root folder में

# Development mode (hot reload)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Stop server: Ctrl + C
```

---

## 🆘 Troubleshooting

### Issue 1: Port Already in Use

**Error:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution:**
```bash
# Windows - Find process using port
netstat -ano | findstr :5000

# Kill process (replace PID)
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

### Issue 2: MongoDB Connection Failed

**Error:**
```
❌ Error: The `uri` parameter to `openUri()` must be a string, got "undefined".
```

**Solution:**
1. `backend/.env` file check करें
2. `MONGODB_URI` correctly set है या नहीं verify करें
3. Connection string format check करें

### Issue 3: Frontend API Calls Failing

**Error:**
```
Failed to fetch
Network error
```

**Solution:**
1. Backend server running है या नहीं check करें
2. `VITE_API_URL` correctly set है या नहीं verify करें
3. CORS configuration check करें

### Issue 4: Module Not Found

**Error:**
```
Module not found: Can't resolve '...'
```

**Solution:**
```bash
# Dependencies reinstall करें
rm -rf node_modules package-lock.json
npm install
```

---

## 📋 Quick Reference

### Backend
- **Folder:** `backend/`
- **Port:** `5000`
- **URL:** `http://localhost:5000/api`
- **Start:** `npm run dev`
- **Stop:** `Ctrl + C`

### Frontend
- **Folder:** Root (`/`)
- **Port:** `8080`
- **URL:** `http://localhost:8080`
- **Start:** `npm run dev`
- **Stop:** `Ctrl + C`

---

## 🎯 Complete Flow

1. **Terminal 1:** Backend start करें
   ```bash
   cd backend
   npm run dev
   ```

2. **Terminal 2:** Frontend start करें
   ```bash
   npm run dev
   ```

3. **Browser:** `http://localhost:8080` open करें

4. **Both servers running!** ✅

---

## ⚠️ Important Notes

1. **Two Terminals Required:**
   - Backend और Frontend को simultaneously run करना होगा
   - दोनों terminals open रखें

2. **Environment Variables:**
   - Backend: `backend/.env`
   - Frontend: Root folder में `.env`

3. **Ports:**
   - Backend: `5000`
   - Frontend: `8080`
   - ये ports available होने चाहिए

4. **Hot Reload:**
   - `npm run dev` use करने से code changes automatically reload होंगे
   - No need to restart manually

---

## ✅ Success Indicators

### Backend Running:
```
🚀 Server running on port 5000
📡 API: http://localhost:5000/api
✅ MongoDB Connected: cluster0.xxxxx.mongodb.net
```

### Frontend Running:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:8080/
  ➜  Network: use --host to expose
```

**🎉 Both servers successfully running!**

---

**🚀 Localhost पर development करने के लिए ready!**


