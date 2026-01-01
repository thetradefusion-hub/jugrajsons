# 🔗 Frontend और Backend Connect करने का Guide

## ✅ Current Status

- ✅ Frontend deployed on Vercel
- ✅ Backend deployed on Railway
- ⏭️ अब दोनों को connect करना है

---

## 🎯 Step 1: Backend URL Copy करें (Railway)

### 1.1 Railway Dashboard में जाएं
1. https://railway.app पर login करें
2. Project → Service (backend) click करें

### 1.2 Service URL Copy करें
1. **"Settings"** tab click करें
2. **"Domains"** section में जाएं
3. **Service URL** copy करें

**Example:**
```
https://atharvahelth-backend-production.up.railway.app
```

### 1.3 API Base URL
- Service URL: `https://atharvahelth-backend-production.up.railway.app`
- **API Base URL:** `https://atharvahelth-backend-production.up.railway.app/api`

⚠️ **Important:** `/api` suffix add करना न भूलें!

---

## 🎯 Step 2: Frontend में API URL Update करें (Vercel)

### 2.1 Vercel Dashboard में जाएं
1. https://vercel.com पर login करें
2. Project (frontend) click करें

### 2.2 Environment Variables में जाएं
1. **"Settings"** tab click करें
2. **"Environment Variables"** section में scroll करें

### 2.3 VITE_API_URL Update करें
1. `VITE_API_URL` variable find करें
2. **Edit** button click करें
3. **Value** में Railway backend API URL paste करें:
   ```
   https://your-railway-service-url.railway.app/api
   ```
4. **Environment:** Production select करें
5. **Save** click करें

### 2.4 Redeploy Frontend
1. **"Deployments"** tab में जाएं
2. Latest deployment पर **"Redeploy"** click करें
   - या automatic redeploy होगा (कुछ seconds में)

---

## 🎯 Step 3: Backend में FRONTEND_URL Update करें (Railway)

### 3.1 Railway Dashboard में जाएं
1. Service (backend) → **"Variables"** tab

### 3.2 FRONTEND_URL Update करें
1. `FRONTEND_URL` variable find करें
2. **Edit** button click करें
3. **Value** में Vercel frontend URL paste करें:
   ```
   https://your-frontend.vercel.app
   ```
4. **Save** click करें

### 3.3 Service Restart
- Railway automatically service restart करेगा
- Logs check करें

---

## 🎯 Step 4: CORS Verification

### 4.1 Backend CORS Settings Check करें

`backend/src/server.ts` में CORS settings verify करें:

```typescript
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = process.env.FRONTEND_URL 
      ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
      : ['http://localhost:8080'];
    
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
```

✅ यह already configured है!

---

## 🎯 Step 5: Testing

### 5.1 Frontend Test करें
1. Vercel frontend URL open करें
2. Browser console open करें (F12)
3. Check करें:
   - [ ] No CORS errors
   - [ ] API calls working
   - [ ] Network tab में requests successful

### 5.2 Backend Health Check
Browser में जाएं:
```
https://your-railway-backend.railway.app/api/health
```

**Expected Response:**
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

### 5.3 Integration Test करें
1. **User Registration:**
   - Frontend पर register करें
   - Check: Success message आना चाहिए

2. **User Login:**
   - Login करें
   - Check: Token receive होना चाहिए

3. **Products Load:**
   - Products page open करें
   - Check: Products load होने चाहिए

4. **Add to Cart:**
   - Product add करें
   - Check: Cart update होना चाहिए

---

## 🔍 Troubleshooting

### Issue 1: CORS Error

**Error:**
```
Access to fetch at 'https://...' from origin 'https://...' has been blocked by CORS policy
```

**Solution:**
1. Railway में `FRONTEND_URL` correctly set है या नहीं check करें
2. Frontend URL exactly match करना चाहिए (no trailing slash)
3. Service restart करें

### Issue 2: API Calls Failing

**Error:**
```
Failed to fetch
Network error
```

**Solution:**
1. Backend service running है या नहीं check करें
2. Backend URL correct है या नहीं verify करें
3. Health endpoint test करें

### Issue 3: 404 Not Found

**Error:**
```
404 Not Found
```

**Solution:**
1. API URL में `/api` suffix है या नहीं check करें
2. Backend routes correctly configured हैं या नहीं verify करें

---

## ✅ Verification Checklist

### Frontend (Vercel)
- [ ] `VITE_API_URL` correctly set है
- [ ] Railway backend API URL use हो रहा है
- [ ] Frontend redeployed है
- [ ] No console errors

### Backend (Railway)
- [ ] `FRONTEND_URL` correctly set है
- [ ] Vercel frontend URL use हो रहा है
- [ ] Service restarted है
- [ ] Health endpoint working है

### Integration
- [ ] User registration working
- [ ] User login working
- [ ] Products loading
- [ ] API calls successful
- [ ] No CORS errors

---

## 📋 Complete Configuration

### Frontend (Vercel) Environment Variables
```env
VITE_API_URL=https://your-railway-backend.railway.app/api
```

### Backend (Railway) Environment Variables
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
FRONTEND_URL=https://your-frontend.vercel.app
RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret
SHIPROCKET_EMAIL=your_email
SHIPROCKET_PASSWORD=your_password
```

---

## 🎉 Success!

दोनों connect होने के बाद:
- ✅ Frontend → Backend API calls working
- ✅ Backend → Frontend CORS allowed
- ✅ Full integration complete
- ✅ Website fully functional

---

## 📝 Quick Reference

### Frontend API URL Format
```
https://railway-backend-url.railway.app/api
```

### Backend Frontend URL Format
```
https://vercel-frontend-url.vercel.app
```

(No trailing slashes!)

---

**🚀 Connect करने के बाद website fully functional होगा!**

