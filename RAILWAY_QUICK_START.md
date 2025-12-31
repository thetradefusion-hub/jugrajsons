# ⚡ Railway Quick Start - 5 Minutes

यह fastest way है Railway पर deploy करने का।

---

## 🚀 Quick Steps

### 1. Railway Account (1 minute)
- https://railway.app पर जाएं
- GitHub से sign in करें
- Authorize Railway

### 2. Deploy Backend (2 minutes)
- **"New Project"** → **"Deploy from GitHub repo"**
- Repository select करें
- Root Directory: `backend` ⚠️
- Wait for deployment

### 3. Add Environment Variables (2 minutes)
Variables tab में ये add करें:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_strong_secret_key_32_chars_min
JWT_EXPIRE=7d
FRONTEND_URL=https://your-frontend.vercel.app
RAZORPAY_KEY_ID=rzp_live_your_key
RAZORPAY_KEY_SECRET=your_secret
SHIPROCKET_EMAIL=your_email
SHIPROCKET_PASSWORD=your_password
```

### 4. Copy Service URL
- Settings → Domains
- Service URL copy करें
- API URL: `your-url.railway.app/api`

### 5. Deploy Frontend (Vercel)
- Vercel पर project import करें
- Environment variable: `VITE_API_URL=your-railway-api-url`
- Deploy!

---

## ✅ Done!

**Detailed Guide:** `RAILWAY_DEPLOYMENT_STEP_BY_STEP.md`

---

**🚀 That's it! Your app is live!**

