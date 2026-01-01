# ⚡ Frontend-Backend Connection - Quick Steps

## 🎯 2-Minute Setup

### Step 1: Backend URL Copy करें (Railway)
1. Railway → Service → **Settings** → **Domains**
2. Service URL copy करें
3. **API URL:** `your-url.railway.app/api` (add `/api`)

### Step 2: Frontend में Add करें (Vercel)
1. Vercel → Project → **Settings** → **Environment Variables**
2. `VITE_API_URL` edit करें
3. Value: `https://your-railway-url.railway.app/api`
4. **Save** → **Redeploy**

### Step 3: Backend में Add करें (Railway)
1. Railway → Service → **Variables**
2. `FRONTEND_URL` edit करें
3. Value: `https://your-vercel-url.vercel.app`
4. **Save** (auto restart)

### Step 4: Test करें
1. Frontend URL open करें
2. Console check करें (no errors)
3. Login/Register test करें

---

## ✅ Done!

**Detailed Guide:** `CONNECT_FRONTEND_BACKEND.md`

---

**🚀 Website fully connected और working!**

