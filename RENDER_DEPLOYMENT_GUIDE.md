# 🚀 Render Deployment Guide - Backend

यह guide specifically Render पर backend deploy करने के लिए है।

---

## 📋 Prerequisites

- [ ] GitHub repository ready
- [ ] MongoDB Atlas production cluster ready
- [ ] Environment variables list ready
- [ ] Render account (free signup)

---

## 🚀 Step-by-Step Deployment

### Step 1: Create Render Account

1. Go to https://render.com
2. Click **"Get Started for Free"**
3. Sign up with **GitHub** (recommended)
4. Authorize Render to access your repositories

---

### Step 2: Create New Web Service

1. Click **"New +"** button
2. Select **"Web Service"**
3. Connect your GitHub repository
   - If not connected, click "Configure account" first
   - Select your repository: `atharvahelth`

---

### Step 3: Configure Service Settings

Fill in the following details:

#### Basic Settings
- **Name:** `atharvahelth-backend`
- **Region:** 
  - **Mumbai** (if available) - Best for India
  - **Singapore** - Good alternative
  - **Oregon (US)** - Default option
- **Branch:** `main` or `master` (your default branch)
- **Root Directory:** `backend` ⚠️ **Important!**

#### Build & Deploy Settings
- **Environment:** `Node`
- **Build Command:** 
  ```bash
  npm install && npm run build
  ```
- **Start Command:**
  ```bash
  npm start
  ```

#### Plan Selection
- **Free:** For testing (sleeps after 15 min inactivity)
- **Starter ($7/month):** Recommended for production (no sleep)
- **Standard ($25/month):** For high traffic

**💡 Recommendation:** Start with **Starter** plan for production

---

### Step 4: Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Add these variables one by one:

```env
# Server Configuration
NODE_ENV=production
PORT=10000

# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/atharvahelth?retryWrites=true&w=majority

# JWT
JWT_SECRET=your_very_strong_random_secret_key_min_32_characters
JWT_EXPIRE=7d

# CORS
FRONTEND_URL=https://your-frontend-domain.vercel.app

# Razorpay
RAZORPAY_KEY_ID=rzp_live_your_key_id
RAZORPAY_KEY_SECRET=your_live_secret_key

# Shiprocket
SHIPROCKET_EMAIL=your_production_email@example.com
SHIPROCKET_PASSWORD=your_production_password
SHIPROCKET_PICKUP_LOCATION=Primary
```

**⚠️ Important:**
- `PORT=10000` - Render uses this port (or auto-assigns)
- Replace all placeholder values with actual production values
- Never commit these to git

---

### Step 5: Advanced Settings (Optional)

#### Health Check
- **Health Check Path:** `/api/health`
- Helps Render monitor your service

#### Auto-Deploy
- **Auto-Deploy:** `Yes` (default)
- Automatically deploys on git push to main branch

#### Custom Headers (Optional)
- Add security headers if needed

---

### Step 6: Deploy

1. Click **"Create Web Service"**
2. Wait for deployment (2-5 minutes)
3. Watch the build logs in real-time
4. Service URL will be generated automatically

**Example URL:** `https://atharvahelth-backend.onrender.com`

---

## ✅ Post-Deployment

### 1. Verify Deployment

1. Check service status (should be "Live")
2. Test health endpoint:
   ```
   https://your-service.onrender.com/api/health
   ```
3. Should return: `{"status":"OK","message":"Server is running"}`

### 2. Update Frontend API URL

1. Go to Vercel dashboard
2. Settings → Environment Variables
3. Update `VITE_API_URL`:
   ```
   VITE_API_URL=https://atharvahelth-backend.onrender.com/api
   ```
4. Redeploy frontend

### 3. Test Integration

- [ ] User registration
- [ ] User login
- [ ] Product API calls
- [ ] Order creation
- [ ] Payment processing

---

## 🔍 Monitoring & Logs

### View Logs

1. Go to Render dashboard
2. Click on your service
3. Click **"Logs"** tab
4. Real-time logs available

### Common Log Commands

- **View recent logs:** Scroll in logs tab
- **Filter logs:** Use search box
- **Download logs:** Not available (use copy)

---

## ⚙️ Service Management

### Restart Service

1. Go to service dashboard
2. Click **"Manual Deploy"** → **"Clear build cache & deploy"**
3. Or click **"Restart"** button

### Update Environment Variables

1. Go to **"Environment"** tab
2. Click **"Add Environment Variable"** or edit existing
3. Changes take effect after restart

### Scale Service

1. Go to **"Settings"** tab
2. Change **"Instance Type"** (if on paid plan)
3. Adjust resources as needed

---

## 🆘 Troubleshooting

### Service Not Starting

**Check:**
1. Build logs for errors
2. Environment variables are set
3. MongoDB connection string is correct
4. Port is set correctly (10000)

**Common Issues:**
- ❌ Build fails → Check build command
- ❌ Service crashes → Check logs for errors
- ❌ Database connection fails → Verify MONGODB_URI

### Cold Start Delay (Free Tier)

**Problem:** Service sleeps after 15 min inactivity
**Solution:** 
- Upgrade to Starter plan ($7/month)
- Or use Railway (no sleep on free tier)

### Environment Variables Not Working

**Check:**
1. Variables are added correctly
2. No typos in variable names
3. Values don't have extra spaces
4. Service restarted after adding variables

---

## 💰 Pricing

### Free Tier
- ✅ 750 hours/month
- ⚠️ Sleeps after 15 min inactivity
- ✅ Good for testing

### Starter Plan ($7/month)
- ✅ No sleep
- ✅ 512 MB RAM
- ✅ 0.5 CPU
- ✅ Perfect for production

### Standard Plan ($25/month)
- ✅ 2 GB RAM
- ✅ 1 CPU
- ✅ Better performance

---

## 🔐 Security Best Practices

1. ✅ Use strong JWT_SECRET
2. ✅ Never commit .env files
3. ✅ Use production API keys
4. ✅ Enable HTTPS (automatic on Render)
5. ✅ Set proper CORS origins

---

## 📊 Performance Tips

1. **Use Starter Plan** - No cold starts
2. **Optimize Build** - Reduce build time
3. **Monitor Logs** - Check for errors
4. **Database Indexing** - Optimize queries
5. **Connection Pooling** - Already handled by Mongoose

---

## 🔄 Continuous Deployment

### Auto-Deploy Setup

1. **Settings** → **Auto-Deploy**
2. Select branch: `main`
3. Enable: **Yes**

Now every push to main branch will auto-deploy!

### Manual Deploy

1. Click **"Manual Deploy"**
2. Select branch
3. Click **"Deploy latest commit"**

---

## 📝 Custom Domain (Optional)

1. Go to **"Settings"** → **"Custom Domains"**
2. Add your domain: `api.yourdomain.com`
3. Follow DNS instructions
4. SSL certificate auto-generated

---

## ✅ Deployment Checklist

- [ ] Service created
- [ ] Environment variables added
- [ ] Build successful
- [ ] Service is live
- [ ] Health check working
- [ ] Frontend API URL updated
- [ ] Integration tested
- [ ] Logs monitored

---

## 🎉 Success!

Your backend is now live on Render!

**Service URL:** `https://your-service.onrender.com`
**API Base:** `https://your-service.onrender.com/api`

---

## 📞 Need Help?

- Render Docs: https://render.com/docs
- Support: support@render.com
- Community: Render Discord

---

**🚀 Happy Deploying on Render!**

