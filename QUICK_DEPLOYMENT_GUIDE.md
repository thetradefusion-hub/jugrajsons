# ⚡ Quick Deployment Guide - AtharvaHelth

यह एक quick reference guide है। Detailed guide के लिए `PRODUCTION_DEPLOYMENT_GUIDE.md` देखें।

---

## 🚀 Fastest Way: Vercel + Railway

### Step 1: Frontend on Vercel (5 minutes)

1. **Vercel पर जाएं**: https://vercel.com
2. **"New Project"** click करें
3. **GitHub repository** connect करें
4. **Settings:**
   - Framework: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. **Environment Variables:**
   - `VITE_API_URL` = `https://your-backend.railway.app/api`
6. **Deploy** click करें

✅ Frontend live हो गया!

---

### Step 2: Backend on Railway/Render (10 minutes)

**💡 Recommendation: Railway (Better - No Sleep)**
**Alternative: Render (Good - But Free Tier Sleeps)**

#### Option A: Railway (Recommended ⭐)

1. **Railway पर जाएं**: https://railway.app
2. **"New Project"** → **"Deploy from GitHub repo"**
3. **Repository** select करें
4. **Settings:**
   - Root Directory: `backend`
   - Build Command: `npm run build`
   - Start Command: `npm start`
5. **Environment Variables** add करें:
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_strong_secret_key
   FRONTEND_URL=https://your-frontend.vercel.app
   RAZORPAY_KEY_ID=your_key
   RAZORPAY_KEY_SECRET=your_secret
   SHIPROCKET_EMAIL=your_email
   SHIPROCKET_PASSWORD=your_password
   ```
6. **Deploy** होने दें

✅ Backend live हो गया!

**Why Railway?** No sleep on free tier = Better performance

---

#### Option B: Render (Alternative)

1. **Render पर जाएं**: https://render.com
2. **"New"** → **"Web Service"**
3. **Repository** connect करें
4. **Settings:**
   - Root Directory: `backend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Plan: **Starter ($7/month)** recommended (no sleep)
5. **Environment Variables** add करें (same as above)
6. **Deploy** होने दें

✅ Backend live हो गया!

**Note:** Free tier sleeps after 15 min. Starter plan recommended for production.

**Detailed Render Guide:** `RENDER_DEPLOYMENT_GUIDE.md`

---

### Step 3: Update Frontend API URL

1. Vercel dashboard में जाएं
2. **Settings** → **Environment Variables**
3. `VITE_API_URL` को Railway backend URL से update करें
4. **Redeploy** करें

---

## 🔐 Environment Variables Checklist

### Frontend (.env.production)
```env
VITE_API_URL=https://your-backend-domain.com/api
```

### Backend (.env.production)
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=strong_random_key_32_chars_min
FRONTEND_URL=https://your-frontend-domain.com
RAZORPAY_KEY_ID=rzp_live_...
RAZORPAY_KEY_SECRET=...
SHIPROCKET_EMAIL=...
SHIPROCKET_PASSWORD=...
```

---

## 📋 Pre-Deployment Checklist

- [ ] MongoDB Atlas production cluster ready
- [ ] Razorpay production keys ready
- [ ] Shiprocket production credentials ready
- [ ] Strong JWT_SECRET generated
- [ ] All environment variables configured
- [ ] Frontend build tested locally
- [ ] Backend build tested locally

---

## 🛠️ Build Commands

### Frontend
```bash
npm run build:prod
# Output: dist/
```

### Backend
```bash
cd backend
npm run build
# Output: dist/
```

---

## 🔍 Post-Deployment Testing

1. ✅ Website loads
2. ✅ User registration works
3. ✅ User login works
4. ✅ Products load
5. ✅ Add to cart works
6. ✅ Checkout works
7. ✅ Payment works
8. ✅ Admin panel accessible

---

## 🆘 Common Issues

### Frontend not loading
- Check build output
- Verify `VITE_API_URL` in environment variables
- Check browser console

### Backend not starting
- Check Railway/Render logs
- Verify all environment variables
- Check MongoDB connection

### API calls failing
- Verify CORS settings
- Check `FRONTEND_URL` in backend env
- Verify API URL in frontend

---

## 📞 Need Help?

Detailed guide: `PRODUCTION_DEPLOYMENT_GUIDE.md`
Checklist: `DEPLOYMENT_CHECKLIST.md`

---

**🎉 Happy Deploying!**

