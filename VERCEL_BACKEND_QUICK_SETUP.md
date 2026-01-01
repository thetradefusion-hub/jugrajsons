# ⚡ Vercel Backend - Quick Setup (If You Want to Try)

यह guide अगर आप Vercel में backend deploy करना चाहते हैं (हालांकि Railway recommended है)।

---

## ⚠️ Important Note

**Railway backend के लिए better है**, लेकिन अगर आप Vercel try करना चाहते हैं:

---

## 🚀 Quick Steps

### Step 1: vercel.json Create करें

Root folder में `vercel.json` file create करें:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "backend/dist/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "backend/dist/server.js"
    }
  ]
}
```

### Step 2: Backend Code Update करें

`backend/src/server.ts` में last में add करें:

```typescript
// Vercel के लिए export
export default app;

// Local development के लिए
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}
```

### Step 3: Vercel Dashboard में Settings

1. **New Project** create करें
2. **Root Directory:** `/` (root)
3. **Build Command:** `cd backend && npm install && npm run build`
4. **Output Directory:** `backend/dist`
5. **Framework Preset:** Other

### Step 4: Environment Variables

सभी backend environment variables add करें:
- `MONGODB_URI`
- `JWT_SECRET`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `SHIPROCKET_EMAIL`
- `SHIPROCKET_PASSWORD`
- `FRONTEND_URL`

---

## ⚠️ Limitations

1. **Request Timeout:** 10 seconds (free), 60 seconds (pro)
2. **Cold Starts:** First request slow हो सकता है
3. **File Uploads:** Special handling चाहिए
4. **WebSockets:** Limited support

---

## 💡 Better Alternative

**Railway use करें backend के लिए:**
- ✅ No cold starts
- ✅ Better performance
- ✅ Easier setup
- ✅ Cost-effective

**Detailed Guide:** `RAILWAY_DEPLOYMENT_STEP_BY_STEP.md`

---

**🎯 Recommendation: Railway use करें - यह आपके backend के लिए perfect है!**

