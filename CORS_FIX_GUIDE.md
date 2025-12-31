# 🔧 CORS Error Fix Guide

## ❌ Current Error

```
Access to XMLHttpRequest at 'https://atharvahelth-production.up.railway.app/api/products' 
from origin 'https://atharvahelth.vercel.app' has been blocked by CORS policy: 
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

**Problem:** Backend में `FRONTEND_URL` correctly set नहीं है या CORS configuration में issue है।

---

## 🎯 Quick Fix (2 Steps)

### Step 1: Railway में FRONTEND_URL Set करें

1. Railway dashboard → Service → **Variables** tab
2. `FRONTEND_URL` variable find करें या create करें
3. **Value** में Vercel frontend URL paste करें:
   ```
   https://atharvahelth.vercel.app
   ```
   ⚠️ **Important:** 
   - `https://` protocol जरूरी है
   - No trailing slash
   - Exact URL match करना चाहिए

4. **Save** click करें
5. Service automatically restart होगा

### Step 2: Verify CORS Configuration

Backend code में CORS already configured है, लेकिन verify करें:
- `FRONTEND_URL` correctly set है
- Service restarted है
- Logs में CORS errors नहीं हैं

---

## 🔍 Troubleshooting

### Issue 1: FRONTEND_URL Not Set

**Solution:**
1. Railway → Variables
2. `FRONTEND_URL` add करें
3. Value: `https://atharvahelth.vercel.app`
4. Save करें

### Issue 2: Wrong URL Format

**❌ Wrong:**
```
atharvahelth.vercel.app
http://atharvahelth.vercel.app
https://atharvahelth.vercel.app/
```

**✅ Correct:**
```
https://atharvahelth.vercel.app
```

### Issue 3: Multiple Frontend URLs

अगर multiple frontend URLs हैं (preview, production), तो comma-separated add करें:
```
https://atharvahelth.vercel.app,https://atharvahelth-git-main.vercel.app
```

---

## ✅ Verification Steps

### Step 1: Check Railway Variables
- [ ] `FRONTEND_URL` variable exists
- [ ] Value: `https://atharvahelth.vercel.app`
- [ ] No trailing slash
- [ ] Service restarted

### Step 2: Test CORS
1. Browser console open करें
2. Frontend URL open करें
3. Check करें:
   - [ ] No CORS errors
   - [ ] API calls successful
   - [ ] Network tab में requests successful

### Step 3: Backend Logs Check
Railway logs में check करें:
- [ ] No CORS error messages
- [ ] Requests coming through
- [ ] Server responding

---

## 🔧 Code Fix Applied

Backend code में CORS configuration improve की गई है:
- ✅ Wildcard support for Vercel URLs
- ✅ Better error logging
- ✅ Multiple origins support
- ✅ Proper headers configuration

---

## 📋 Correct Configuration

### Railway Environment Variables
```env
FRONTEND_URL=https://atharvahelth.vercel.app
```

### Backend CORS Settings
- ✅ Origin: `https://atharvahelth.vercel.app`
- ✅ Credentials: true
- ✅ Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
- ✅ Headers: Content-Type, Authorization

---

## 🆘 If Still Not Working

### Check 1: Service Restart
- Variables update के बाद service restart होना चाहिए
- Manual restart करें अगर automatic नहीं हुआ

### Check 2: URL Match
- Frontend URL exactly match करना चाहिए
- No typos, no extra characters

### Check 3: Browser Cache
- Hard refresh: `Ctrl + Shift + R`
- Clear browser cache

### Check 4: Backend Logs
- Railway logs check करें
- CORS error messages देखें
- Debugging info check करें

---

## ✅ Success Indicators

CORS fix होने के बाद:
- ✅ No CORS errors in console
- ✅ API calls successful
- ✅ Products loading
- ✅ Login/Register working
- ✅ All endpoints accessible

---

## 🎯 Quick Checklist

- [ ] Railway में `FRONTEND_URL` set है
- [ ] Value: `https://atharvahelth.vercel.app` (exact match)
- [ ] Service restarted
- [ ] Backend logs में no errors
- [ ] Frontend console में no CORS errors
- [ ] API calls working

---

**🚀 FRONTEND_URL correctly set करने के बाद CORS error fix हो जाएगा!**

