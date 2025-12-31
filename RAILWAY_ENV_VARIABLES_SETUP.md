# 🔐 Railway Environment Variables Setup Guide

## ❌ Current Error

```
❌ Error: The `uri` parameter to `openUri()` must be a string, got "undefined".
```

**Problem:** `MONGODB_URI` environment variable Railway में set नहीं है।

---

## 🎯 Solution: Environment Variables Add करें

### Step 1: Railway Dashboard में जाएं

1. https://railway.app पर login करें
2. अपने project को select करें
3. Service (backend service) को click करें

### Step 2: Variables Tab में जाएं

1. Service dashboard में **"Variables"** tab click करें
2. **"New Variable"** button click करें

### Step 3: सभी Required Variables Add करें

एक-एक करके ये variables add करें:

#### Variable 1: NODE_ENV
- **Name:** `NODE_ENV`
- **Value:** `production`
- **Add** click करें

#### Variable 2: PORT
- **Name:** `PORT`
- **Value:** `5000`
- **Add** click करें

#### Variable 3: MONGODB_URI ⚠️ **MOST IMPORTANT**
- **Name:** `MONGODB_URI`
- **Value:** `mongodb+srv://username:password@cluster.mongodb.net/atharvahelth?retryWrites=true&w=majority`
- ⚠️ **Important:** अपना actual MongoDB Atlas connection string paste करें
- **Add** click करें

**Example:**
```
mongodb+srv://thetradefusion_db_user:YourPassword123@atharvaadmin.gnwokao.mongodb.net/atharvahelth?retryWrites=true&w=majority
```

#### Variable 4: JWT_SECRET
- **Name:** `JWT_SECRET`
- **Value:** `your_very_strong_random_secret_key_minimum_32_characters_long`
- ⚠️ **Important:** Strong random key use करें (32+ characters)
- **Add** click करें

#### Variable 5: JWT_EXPIRE
- **Name:** `JWT_EXPIRE`
- **Value:** `7d`
- **Add** click करें

#### Variable 6: FRONTEND_URL
- **Name:** `FRONTEND_URL`
- **Value:** `https://your-frontend.vercel.app`
- ⚠️ **Important:** Frontend deploy होने के बाद actual URL update करें
- **Add** click करें

#### Variable 7: RAZORPAY_KEY_ID
- **Name:** `RAZORPAY_KEY_ID`
- **Value:** `rzp_live_your_actual_key_id`
- ⚠️ **Important:** Razorpay dashboard से production key copy करें
- **Add** click करें

#### Variable 8: RAZORPAY_KEY_SECRET
- **Name:** `RAZORPAY_KEY_SECRET`
- **Value:** `your_actual_razorpay_secret_key`
- ⚠️ **Important:** Razorpay dashboard से production secret copy करें
- **Add** click करें

#### Variable 9: SHIPROCKET_EMAIL
- **Name:** `SHIPROCKET_EMAIL`
- **Value:** `your_production_email@example.com`
- ⚠️ **Important:** Shiprocket production account email
- **Add** click करें

#### Variable 10: SHIPROCKET_PASSWORD
- **Name:** `SHIPROCKET_PASSWORD`
- **Value:** `your_production_password`
- ⚠️ **Important:** Shiprocket production account password
- **Add** click करें

#### Variable 11: SHIPROCKET_PICKUP_LOCATION (Optional)
- **Name:** `SHIPROCKET_PICKUP_LOCATION`
- **Value:** `Primary`
- **Add** click करें

---

## ✅ Verification Checklist

सभी variables add करने के बाद, verify करें:

- [ ] NODE_ENV = production
- [ ] PORT = 5000
- [ ] MONGODB_URI = (your connection string) ⚠️ **MUST HAVE**
- [ ] JWT_SECRET = (your secret key)
- [ ] JWT_EXPIRE = 7d
- [ ] FRONTEND_URL = (frontend URL)
- [ ] RAZORPAY_KEY_ID = (your key)
- [ ] RAZORPAY_KEY_SECRET = (your secret)
- [ ] SHIPROCKET_EMAIL = (your email)
- [ ] SHIPROCKET_PASSWORD = (your password)

---

## 🔄 After Adding Variables

### Automatic Restart
- Variables add करने के बाद Railway automatically service restart करेगा
- Logs check करें - MongoDB connection successful होना चाहिए

### Manual Restart (if needed)
1. **Deployments** tab में जाएं
2. Latest deployment पर **"Redeploy"** click करें

---

## 🆘 Troubleshooting

### Error: MongoDB URI undefined
**Solution:**
- Verify `MONGODB_URI` variable correctly added है
- Check variable name spelling (exactly `MONGODB_URI`)
- Verify connection string format correct है
- Check MongoDB Atlas network access (IP whitelist)

### Error: Connection failed
**Solution:**
1. MongoDB Atlas dashboard में जाएं
2. **Network Access** section check करें
3. **Add IP Address** → **Allow Access from Anywhere** (0.0.0.0/0)
4. Railway service restart करें

### Error: Authentication failed
**Solution:**
1. MongoDB Atlas dashboard में जाएं
2. **Database Access** section check करें
3. User password verify करें
4. Connection string में password URL encoded है या नहीं check करें

---

## 📝 MongoDB Connection String Format

**Correct Format:**
```
mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority
```

**Special Characters in Password:**
अगर password में special characters हैं, तो URL encode करें:
- `@` → `%40`
- `#` → `%23`
- `$` → `%24`
- `%` → `%25`
- `&` → `%26`
- `+` → `%2B`
- `=` → `%3D`

---

## ✅ Success Indicators

Variables correctly add होने के बाद logs में ये दिखना चाहिए:

```
✅ MongoDB connected successfully
🚀 Server running on port 5000
📡 API: http://localhost:5000/api
🌍 Environment: production
✅ Production mode enabled
```

**No more errors!** 🎉

---

## 🎯 Quick Fix Steps

1. Railway dashboard → Service → **Variables** tab
2. **MONGODB_URI** variable add करें (सबसे important!)
3. बाकी सभी variables add करें
4. Service automatically restart होगा
5. Logs check करें - connection successful होना चाहिए

---

**🚀 MONGODB_URI add करने के बाद service successfully start होगा!**

