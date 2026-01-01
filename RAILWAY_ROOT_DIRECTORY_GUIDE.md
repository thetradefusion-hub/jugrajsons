# 📁 Railway में Root Directory कैसे Set करें

## 🎯 Step-by-Step Guide

### Step 1: Railway Dashboard में जाएं
1. https://railway.app पर login करें
2. अपने project को select करें
3. Service (backend service) को click करें

### Step 2: Settings Tab में जाएं
1. Service dashboard में **"Settings"** tab click करें
2. Scroll down करें

### Step 3: Root Directory Set करें
1. **"Root Directory"** field find करें
2. Value में type करें: `backend`
3. **"Save"** या **"Update"** button click करें

### Step 4: Redeploy करें
1. **"Deployments"** tab में जाएं
2. Latest deployment पर **"Redeploy"** click करें
   - या new commit push करें (automatic deploy होगा)

---

## 📍 Visual Guide

```
Railway Dashboard
├── Your Project
    └── Service (atharvahelth-backend)
        ├── Deployments
        ├── Metrics
        ├── Logs
        ├── Variables
        └── Settings ⬅️ यहाँ जाएं
            ├── Service Name
            ├── Root Directory ⬅️ यहाँ `backend` type करें
            ├── Build Command
            ├── Start Command
            └── ...
```

---

## ⚠️ Important Notes

1. **Root Directory** field में exactly `backend` type करें (no slash, no quotes)
2. Save करने के बाद service automatically restart होगा
3. Build command और start command automatically update हो जाएंगे

---

## ✅ Verification

Root directory set होने के बाद:
- Build logs में `cd backend` command दिखेगा
- Build successful होगा
- Service start होगा

---

**🎯 Root Directory set करने के बाद deployment successful होगा!**

