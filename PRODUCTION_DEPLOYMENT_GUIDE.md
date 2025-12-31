# 🚀 Production Deployment Guide - AtharvaHelth

यह guide आपको project को production में deploy करने में मदद करेगा।

---

## 📋 Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Environment Variables Setup](#environment-variables-setup)
3. [Build Configuration](#build-configuration)
4. [Deployment Options](#deployment-options)
   - [Option 1: Vercel (Frontend) + Railway/Render (Backend)](#option-1-vercel--railwayrender)
   - [Option 2: Full Stack on Railway](#option-2-full-stack-on-railway)
   - [Option 3: VPS Server (DigitalOcean/AWS)](#option-3-vps-server)
5. [Post-Deployment Steps](#post-deployment-steps)
6. [Security Checklist](#security-checklist)
7. [Monitoring & Maintenance](#monitoring--maintenance)

---

## ✅ Pre-Deployment Checklist

### Frontend
- [ ] Production build test करें (`npm run build`)
- [ ] Environment variables configure करें
- [ ] API URLs production URLs से update करें
- [ ] Error handling और logging check करें
- [ ] SEO meta tags verify करें
- [ ] Performance optimization check करें

### Backend
- [ ] TypeScript build test करें (`npm run build`)
- [ ] Environment variables configure करें
- [ ] MongoDB connection string production database से update करें
- [ ] JWT_SECRET strong random key generate करें
- [ ] CORS settings production frontend URL से update करें
- [ ] File upload paths verify करें
- [ ] Error handling और logging improve करें

### Database
- [ ] MongoDB Atlas production cluster setup करें
- [ ] Database backup strategy plan करें
- [ ] Indexes optimize करें
- [ ] Connection pooling configure करें

### Third-Party Services
- [ ] Razorpay production keys configure करें
- [ ] Shiprocket production credentials configure करें
- [ ] Email service (if any) configure करें

---

## 🔐 Environment Variables Setup

### Frontend (.env.production)

Root folder में `.env.production` file create करें:

```env
# Production API URL
VITE_API_URL=https://your-backend-domain.com/api

# Environment
VITE_ENV=production
```

### Backend (.env.production)

`backend` folder में `.env.production` file create करें:

```env
# Server Configuration
PORT=5000
NODE_ENV=production

# MongoDB Atlas Production Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/atharvahelth?retryWrites=true&w=majority

# JWT Configuration (IMPORTANT: Strong random key use करें)
JWT_SECRET=your_very_strong_random_secret_key_min_32_characters_long_2024
JWT_EXPIRE=7d

# Frontend URL (CORS के लिए)
FRONTEND_URL=https://your-frontend-domain.com

# File Upload Configuration
UPLOAD_PATH=./uploads/products
MAX_FILE_SIZE=5242880

# Razorpay Production Keys
RAZORPAY_KEY_ID=rzp_live_your_key_id
RAZORPAY_KEY_SECRET=your_live_secret_key

# Shiprocket Production Credentials
SHIPROCKET_EMAIL=your_production_email@example.com
SHIPROCKET_PASSWORD=your_production_password
SHIPROCKET_PICKUP_LOCATION=Primary
```

**⚠️ IMPORTANT:**
- `.env.production` files को **NEVER** git में commit न करें
- Production में strong JWT_SECRET use करें (minimum 32 characters)
- MongoDB password में special characters होने पर URL encode करें

---

## 🏗️ Build Configuration

### Frontend Build

```bash
# Production build
npm run build

# Build output: dist/ folder
```

### Backend Build

```bash
cd backend

# Install dependencies
npm install

# Build TypeScript
npm run build

# Build output: dist/ folder
```

---

## 🚀 Deployment Options

### Option 1: Vercel (Frontend) + Railway/Render (Backend)

**💡 Recommendation: Railway (Better for Backend APIs)**
- ✅ No sleep on free tier
- ✅ Better performance
- ✅ Pay-as-you-go pricing
- ✅ Easier setup

**Render Alternative:**
- ✅ Good if you have consistent traffic
- ⚠️ Free tier sleeps after 15 min (cold start delay)
- ✅ Fixed pricing plans available

#### Frontend on Vercel

1. **Vercel Account Setup**
   - https://vercel.com पर account बनाएं
   - GitHub repository connect करें

2. **Project Import**
   - Vercel dashboard में "New Project" click करें
   - GitHub repository select करें
   - Root directory: `/` (root folder)
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Environment Variables**
   - Vercel project settings में "Environment Variables" section में जाएं
   - Add करें:
     - `VITE_API_URL` = `https://your-backend-domain.com/api`
     - Production environment select करें

4. **Deploy**
   - "Deploy" button click करें
   - Automatic deployment होगा

#### Backend on Railway

1. **Railway Account Setup**
   - https://railway.app पर account बनाएं
   - GitHub repository connect करें

2. **New Project Create**
   - "New Project" → "Deploy from GitHub repo"
   - Repository select करें
   - Root directory: `backend`

3. **Configure Service**
   - Service name: `atharvahelth-backend`
   - Build command: `npm run build`
   - Start command: `npm start`
   - Port: `5000`

4. **Environment Variables**
   - Railway dashboard में "Variables" tab में जाएं
   - `.env.production` की सभी variables add करें

5. **Deploy**
   - Automatic deployment start होगा
   - Domain automatically assign होगा (या custom domain add करें)

#### Backend on Render

1. **Render Account Setup**
   - https://render.com पर account बनाएं
   - GitHub repository connect करें

2. **New Web Service**
   - "New" → "Web Service"
   - Repository select करें
   - Name: `atharvahelth-backend`
   - Root Directory: `backend`
   - Environment: `Node`
   - Region: Choose closest to your users (Mumbai/Singapore for India)
   - Branch: `main` or `master`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Plan: **Starter** ($7/month) recommended (no sleep) or **Free** for testing

3. **Environment Variables**
   - "Environment" section में सभी variables add करें:
     ```
     NODE_ENV=production
     PORT=10000 (Render uses port from env or 10000)
     MONGODB_URI=your_mongodb_connection_string
     JWT_SECRET=your_strong_secret_key
     FRONTEND_URL=https://your-frontend-domain.com
     RAZORPAY_KEY_ID=your_key
     RAZORPAY_KEY_SECRET=your_secret
     SHIPROCKET_EMAIL=your_email
     SHIPROCKET_PASSWORD=your_password
     ```

4. **Advanced Settings** (Optional)
   - Health Check Path: `/api/health`
   - Auto-Deploy: `Yes` (deploys on git push)

5. **Deploy**
   - "Create Web Service" click करें
   - Wait for build to complete (2-5 minutes)
   - Service URL automatically generated

**⚠️ Important Notes:**
- **Free tier sleeps after 15 minutes** of inactivity (cold start ~30 seconds)
- **Starter plan ($7/month)** recommended for production (no sleep)
- Render uses port from `PORT` env variable or defaults to 10000
- Check logs if deployment fails

---

### Option 2: Full Stack on Railway

1. **Two Services Create करें**

   **Service 1: Frontend**
   - Root directory: `/`
   - Build command: `npm run build`
   - Start command: `npx serve -s dist -l 3000`
   - Port: `3000`

   **Service 2: Backend**
   - Root directory: `backend`
   - Build command: `npm run build`
   - Start command: `npm start`
   - Port: `5000`

2. **Environment Variables** दोनों services में configure करें

3. **Deploy** दोनों services

---

### Option 3: VPS Server (DigitalOcean/AWS)

#### Server Setup

1. **VPS Create करें**
   - DigitalOcean/AWS/Linode पर VPS create करें
   - Minimum: 2GB RAM, 1 vCPU
   - OS: Ubuntu 22.04 LTS

2. **Server Connect**
   ```bash
   ssh root@your-server-ip
   ```

3. **Node.js Install**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   node --version
   npm --version
   ```

4. **Nginx Install (Frontend के लिए)**
   ```bash
   sudo apt update
   sudo apt install nginx
   sudo systemctl start nginx
   sudo systemctl enable nginx
   ```

5. **PM2 Install (Backend के लिए)**
   ```bash
   sudo npm install -g pm2
   ```

#### Frontend Deployment

1. **Project Clone**
   ```bash
   cd /var/www
   git clone https://github.com/your-username/atharvahelth.git
   cd atharvahelth
   ```

2. **Build Frontend**
   ```bash
   npm install
   npm run build
   ```

3. **Nginx Configuration**
   ```bash
   sudo nano /etc/nginx/sites-available/atharvahelth
   ```

   Configuration:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com www.your-domain.com;

       root /var/www/atharvahelth/dist;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }

       location /api {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   Enable site:
   ```bash
   sudo ln -s /etc/nginx/sites-available/atharvahelth /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

#### Backend Deployment

1. **Backend Setup**
   ```bash
   cd /var/www/atharvahelth/backend
   npm install
   npm run build
   ```

2. **Environment Variables**
   ```bash
   nano .env
   # Production variables paste करें
   ```

3. **PM2 Start**
   ```bash
   pm2 start dist/server.js --name atharvahelth-backend
   pm2 save
   pm2 startup
   ```

4. **PM2 Monitoring**
   ```bash
   pm2 list
   pm2 logs atharvahelth-backend
   pm2 monit
   ```

#### SSL Certificate (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

---

## 🔒 Post-Deployment Steps

### 1. Domain Configuration

- **Frontend Domain**: DNS में A record point करें
- **Backend Domain**: CNAME या A record configure करें
- **SSL Certificate**: Let's Encrypt से free SSL install करें

### 2. Database Migration

- Production database में initial data seed करें
- Admin user create करें
- Test data remove करें

### 3. Testing

- [ ] Frontend load हो रहा है
- [ ] API calls working हैं
- [ ] Authentication working है
- [ ] Payment gateway working है
- [ ] File uploads working हैं
- [ ] Email notifications (if any) working हैं

### 4. Monitoring Setup

- **Uptime Monitoring**: UptimeRobot, Pingdom
- **Error Tracking**: Sentry, LogRocket
- **Analytics**: Google Analytics

---

## 🔐 Security Checklist

- [ ] Strong JWT_SECRET use किया है
- [ ] MongoDB connection string secure है
- [ ] CORS properly configured है
- [ ] Environment variables exposed नहीं हैं
- [ ] HTTPS enabled है
- [ ] Rate limiting implement किया है (optional)
- [ ] Input validation सभी endpoints पर है
- [ ] SQL injection protection (Mongoose automatically handles)
- [ ] XSS protection (React automatically handles)
- [ ] File upload size limits set हैं
- [ ] Error messages में sensitive info expose नहीं हो रहा

---

## 📊 Monitoring & Maintenance

### Backend Logs

**Railway/Render:**
- Dashboard में logs देख सकते हैं

**VPS (PM2):**
```bash
pm2 logs atharvahelth-backend
pm2 logs atharvahelth-backend --lines 100
```

### Database Monitoring

- MongoDB Atlas dashboard में monitoring देखें
- Connection count check करें
- Storage usage monitor करें

### Performance Monitoring

- Response times check करें
- Error rates monitor करें
- Database query performance check करें

### Regular Maintenance

- Weekly backups
- Dependency updates
- Security patches
- Performance optimization

---

## 🆘 Troubleshooting

### Frontend Not Loading
- Check build output
- Verify environment variables
- Check browser console for errors

### Backend Not Starting
- Check PM2 logs
- Verify environment variables
- Check MongoDB connection
- Verify port availability

### API Calls Failing
- Check CORS configuration
- Verify API URL in frontend
- Check backend logs
- Verify authentication tokens

### Database Connection Issues
- Verify MongoDB URI
- Check network access in MongoDB Atlas
- Verify credentials

---

## 📞 Support

Deployment में कोई issue आए तो:
1. Check logs
2. Verify environment variables
3. Check service status
4. Review error messages

---

**🎉 Success! आपका project production में live है!**

