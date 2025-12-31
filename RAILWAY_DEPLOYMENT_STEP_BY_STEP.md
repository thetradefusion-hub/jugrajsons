# 🚀 Railway Deployment - Step by Step Guide

यह guide आपको Railway पर backend deploy करने में step-by-step मदद करेगा।

---

## 📋 Prerequisites Checklist

Deployment से पहले ये सब ready होना चाहिए:

- [ ] GitHub repository में code push हो गया है
- [ ] MongoDB Atlas production cluster ready है
- [ ] MongoDB connection string copy किया है
- [ ] Razorpay production keys ready हैं
- [ ] Shiprocket production credentials ready हैं
- [ ] Strong JWT_SECRET generate किया है (minimum 32 characters)

---

## 🎯 Step 1: Railway Account बनाएं

### 1.1 Railway Website पर जाएं
- Browser में जाएं: **https://railway.app**
- या Google में search करें: "Railway.app"

### 1.2 Sign Up करें
1. **"Start a New Project"** या **"Login"** button click करें
2. **"Deploy from GitHub repo"** option select करें
3. GitHub account से **Authorize Railway** करें
4. Railway को repository access देने की permission दें

✅ **Account बन गया!**

---

## 🎯 Step 2: New Project Create करें

### 2.1 Dashboard में जाएं
- Railway dashboard open होगा
- **"New Project"** button दिखेगा

### 2.2 Project Type Select करें
1. **"New Project"** click करें
2. **"Deploy from GitHub repo"** option select करें
3. अगर GitHub connect नहीं है, तो पहले GitHub connect करें

### 2.3 Repository Select करें
1. आपकी GitHub repositories की list दिखेगी
2. **"atharvahelth"** repository select करें
3. **"Deploy Now"** click करें

✅ **Project create हो गया!**

---

## 🎯 Step 3: Service Configure करें

### 3.1 Service Settings
Railway automatically service detect करेगा, लेकिन verify करें:

1. **Service name** check करें: `atharvahelth-backend` (या auto-generated name)
2. **Root Directory** set करें:
   - Settings → **"Root Directory"** में जाएं
   - Value: `backend` ⚠️ **Important!**
   - Save करें

### 3.2 Build Settings
1. **Settings** tab में जाएं
2. **Build Command** verify करें:
   ```
   npm run build
   ```
3. **Start Command** verify करें:
   ```
   npm start
   ```

### 3.3 Port Settings
- Railway automatically port assign करेगा
- `PORT` environment variable में set होगा
- Manual port setting की जरूरत नहीं

✅ **Service configured!**

---

## 🎯 Step 4: Environment Variables Add करें

यह सबसे important step है! सभी variables correctly add करें।

### 4.1 Variables Tab में जाएं
1. Service dashboard में **"Variables"** tab click करें
2. **"New Variable"** button click करें

### 4.2 Variables एक-एक करके Add करें

#### Variable 1: NODE_ENV
- **Name:** `NODE_ENV`
- **Value:** `production`
- **Add** click करें

#### Variable 2: PORT
- **Name:** `PORT`
- **Value:** `5000`
- **Add** click करें

#### Variable 3: MONGODB_URI
- **Name:** `MONGODB_URI`
- **Value:** `mongodb+srv://username:password@cluster.mongodb.net/atharvahelth?retryWrites=true&w=majority`
- ⚠️ **Important:** अपना actual MongoDB connection string paste करें
- **Add** click करें

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

### 4.3 Variables Verify करें
सभी variables add करने के बाद, list में verify करें:
- [ ] NODE_ENV = production
- [ ] PORT = 5000
- [ ] MONGODB_URI = (your connection string)
- [ ] JWT_SECRET = (your secret key)
- [ ] JWT_EXPIRE = 7d
- [ ] FRONTEND_URL = (frontend URL)
- [ ] RAZORPAY_KEY_ID = (your key)
- [ ] RAZORPAY_KEY_SECRET = (your secret)
- [ ] SHIPROCKET_EMAIL = (your email)
- [ ] SHIPROCKET_PASSWORD = (your password)

✅ **All variables added!**

---

## 🎯 Step 5: Deploy करें

### 5.1 Automatic Deployment
- Variables add करने के बाद Railway automatically deploy start करेगा
- **"Deployments"** tab में progress देख सकते हैं

### 5.2 Build Process Monitor करें
1. **"Deployments"** tab click करें
2. Latest deployment click करें
3. **Build logs** real-time देख सकते हैं
4. Wait करें (2-5 minutes)

### 5.3 Build Success Check करें
- ✅ Build successful होने पर green checkmark दिखेगा
- ✅ Service status: **"Active"** होगा
- ✅ Service URL automatically generate होगा

✅ **Deployment successful!**

---

## 🎯 Step 6: Service URL Copy करें

### 6.1 Service URL Find करें
1. Service dashboard में **"Settings"** tab में जाएं
2. **"Domains"** section में जाएं
3. **Service URL** copy करें

**Example:** `https://atharvahelth-backend-production.up.railway.app`

### 6.2 API Base URL
- Service URL: `https://atharvahelth-backend-production.up.railway.app`
- API Base URL: `https://atharvahelth-backend-production.up.railway.app/api`

✅ **URL copied!**

---

## 🎯 Step 7: Health Check करें

### 7.1 Health Endpoint Test करें
Browser में जाएं:
```
https://your-service-url.railway.app/api/health
```

**Expected Response:**
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

### 7.2 Common Issues

#### ❌ 404 Error
- Check: Service URL correct है या नहीं
- Check: `/api/health` endpoint exists

#### ❌ 500 Error
- Check: Environment variables correctly set हैं
- Check: MongoDB connection working है
- Check: Build logs में errors

#### ❌ Connection Timeout
- Check: Service is running (Status: Active)
- Check: Build completed successfully

✅ **Health check passed!**

---

## 🎯 Step 8: Frontend Deploy करें (Vercel)

### 8.1 Vercel पर जाएं
- Browser में जाएं: **https://vercel.com**
- GitHub से sign in करें

### 8.2 New Project Create करें
1. **"Add New..."** → **"Project"** click करें
2. **"atharvahelth"** repository select करें
3. **"Import"** click करें

### 8.3 Project Settings
1. **Framework Preset:** `Vite` select करें
2. **Root Directory:** `/` (root)
3. **Build Command:** `npm run build` (auto-detected)
4. **Output Directory:** `dist` (auto-detected)

### 8.4 Environment Variables Add करें
1. **"Environment Variables"** section में जाएं
2. **"Add"** click करें
3. **Name:** `VITE_API_URL`
4. **Value:** `https://your-railway-service-url.railway.app/api`
   - ⚠️ Railway से copy किया हुआ API URL paste करें
5. **Environment:** Production select करें
6. **Add** click करें

### 8.5 Deploy करें
1. **"Deploy"** button click करें
2. Wait करें (2-3 minutes)
3. Deployment successful होने पर URL मिलेगा

✅ **Frontend deployed!**

---

## 🎯 Step 9: Frontend URL Update करें

### 9.1 Railway में FRONTEND_URL Update करें
1. Railway dashboard में जाएं
2. Service → **"Variables"** tab
3. `FRONTEND_URL` variable find करें
4. **Edit** click करें
5. Vercel frontend URL paste करें:
   ```
   https://your-frontend.vercel.app
   ```
6. **Save** click करें
7. Service automatically restart होगा

✅ **Frontend URL updated!**

---

## 🎯 Step 10: Final Testing

### 10.1 Frontend Test करें
1. Frontend URL open करें
2. Check करें:
   - [ ] Website loads correctly
   - [ ] No console errors
   - [ ] API calls working

### 10.2 Backend Test करें
1. Health endpoint test करें
2. API endpoints test करें:
   - [ ] `/api/products` - Products load हो रहे हैं
   - [ ] `/api/auth/register` - Registration working
   - [ ] `/api/auth/login` - Login working

### 10.3 Integration Test करें
1. User registration करें
2. User login करें
3. Products browse करें
4. Add to cart करें
5. Checkout process test करें

✅ **All tests passed!**

---

## 🎯 Step 11: Custom Domain (Optional)

### 11.1 Railway में Custom Domain Add करें
1. Service → **"Settings"** → **"Domains"**
2. **"Custom Domain"** click करें
3. Your domain enter करें: `api.yourdomain.com`
4. DNS instructions follow करें
5. SSL certificate automatically generate होगा

### 11.2 DNS Configuration
Railway आपको DNS records देगा:
- **Type:** CNAME
- **Name:** `api` (subdomain)
- **Value:** Railway provided URL

DNS provider (GoDaddy, Namecheap, etc.) में add करें।

✅ **Custom domain configured!**

---

## 📊 Monitoring & Logs

### View Logs
1. Railway dashboard में service click करें
2. **"Deployments"** tab में latest deployment click करें
3. **"View Logs"** button click करें
4. Real-time logs देख सकते हैं

### Service Status
- **Active:** Service running
- **Building:** Deployment in progress
- **Failed:** Check logs for errors

---

## 🆘 Troubleshooting

### Issue 1: Build Fails

**Error:** Build command failed
**Solution:**
1. Check build logs
2. Verify `package.json` has build script
3. Check Node.js version compatibility

### Issue 2: Service Crashes

**Error:** Service not starting
**Solution:**
1. Check environment variables
2. Verify MongoDB connection
3. Check logs for specific errors
4. Verify PORT is set correctly

### Issue 3: API Calls Failing

**Error:** CORS errors or 404
**Solution:**
1. Verify `FRONTEND_URL` is correct
2. Check CORS settings in backend
3. Verify API base URL in frontend

### Issue 4: Database Connection Fails

**Error:** MongoDB connection error
**Solution:**
1. Verify `MONGODB_URI` is correct
2. Check MongoDB Atlas network access (IP whitelist)
3. Verify database credentials

---

## ✅ Deployment Checklist

- [ ] Railway account created
- [ ] Project created
- [ ] Service configured (root directory: `backend`)
- [ ] All environment variables added
- [ ] Build successful
- [ ] Service URL copied
- [ ] Health check passed
- [ ] Frontend deployed on Vercel
- [ ] Frontend API URL updated
- [ ] FRONTEND_URL updated in Railway
- [ ] All tests passed
- [ ] Custom domain configured (optional)

---

## 🎉 Success!

आपका backend अब Railway पर live है! 🚀

**Backend URL:** `https://your-service.railway.app`
**API Base:** `https://your-service.railway.app/api`
**Frontend URL:** `https://your-frontend.vercel.app`

---

## 📞 Need Help?

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- Support: support@railway.app

---

**🚀 Happy Deploying!**

