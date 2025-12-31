# ⚡ Railway Quick Fix - MongoDB Connection Error

## ❌ Current Error

```
❌ Error: The `uri` parameter to `openUri()` must be a string, got "undefined".
```

**Problem:** `MONGODB_URI` environment variable Railway में set नहीं है।

---

## 🚀 Quick Fix (2 Minutes)

### Step 1: Railway Dashboard
1. https://railway.app पर जाएं
2. Project → Service click करें
3. **"Variables"** tab click करें

### Step 2: MONGODB_URI Add करें
1. **"New Variable"** button click करें
2. **Name:** `MONGODB_URI`
3. **Value:** अपना MongoDB connection string paste करें
   ```
   mongodb+srv://username:password@cluster.mongodb.net/atharvahelth?retryWrites=true&w=majority
   ```
4. **Add** click करें

### Step 3: बाकी Variables Add करें

Quick list - एक-एक करके add करें:

```
NODE_ENV = production
PORT = 5000
MONGODB_URI = (your connection string) ⚠️ MUST HAVE
JWT_SECRET = (your secret key)
JWT_EXPIRE = 7d
FRONTEND_URL = https://your-frontend.vercel.app
RAZORPAY_KEY_ID = (your key)
RAZORPAY_KEY_SECRET = (your secret)
SHIPROCKET_EMAIL = (your email)
SHIPROCKET_PASSWORD = (your password)
```

### Step 4: Wait for Restart
- Railway automatically service restart करेगा
- Logs check करें - `✅ MongoDB Connected` दिखना चाहिए

---

## ✅ Success!

Logs में ये दिखना चाहिए:
```
✅ MongoDB Connected: cluster0.xxxxx.mongodb.net
🚀 Server running on port 5000
📡 API: http://localhost:5000/api
```

**No more errors!** 🎉

---

**🚀 MONGODB_URI add करने के बाद service successfully start होगा!**

