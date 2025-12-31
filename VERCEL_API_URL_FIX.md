# 🔧 Vercel API URL Fix

## ❌ Current Error

```
GET https://atharvahelth.vercel.app/atharvahelth-production.up.railway.app/api/products 404
```

**Problem:** API URL relative path की तरह treat हो रहा है, absolute URL नहीं।

---

## 🎯 Solution: Vercel Environment Variable Fix

### Step 1: Vercel Dashboard में जाएं
1. https://vercel.com पर login करें
2. Project (atharvahelth) click करें
3. **"Settings"** tab click करें

### Step 2: Environment Variables Check करें
1. **"Environment Variables"** section में scroll करें
2. `VITE_API_URL` variable find करें

### Step 3: Correct Format Set करें

**❌ Wrong Format:**
```
atharvahelth-production.up.railway.app/api
```

**✅ Correct Format:**
```
https://atharvahelth-production.up.railway.app/api
```

⚠️ **Important:** 
- `https://` protocol जरूरी है
- `/api` suffix जरूरी है
- No trailing slash

### Step 4: Update करें
1. `VITE_API_URL` variable पर **Edit** click करें
2. **Value** में correct URL paste करें:
   ```
   https://atharvahelth-production.up.railway.app/api
   ```
3. **Environment:** Production select करें
4. **Save** click करें

### Step 5: Redeploy करें
1. **"Deployments"** tab में जाएं
2. Latest deployment पर **"Redeploy"** click करें
3. Wait करें (1-2 minutes)

---

## ✅ Verification

Redeploy के बाद:
1. Frontend URL open करें
2. Browser console check करें (F12)
3. Network tab में API calls check करें
4. URLs correct format में होनी चाहिए:
   ```
   https://atharvahelth-production.up.railway.app/api/products
   ```

---

## 🔍 Common Mistakes

### Mistake 1: Missing Protocol
❌ `atharvahelth-production.up.railway.app/api`
✅ `https://atharvahelth-production.up.railway.app/api`

### Mistake 2: Missing /api
❌ `https://atharvahelth-production.up.railway.app`
✅ `https://atharvahelth-production.up.railway.app/api`

### Mistake 3: Trailing Slash
❌ `https://atharvahelth-production.up.railway.app/api/`
✅ `https://atharvahelth-production.up.railway.app/api`

### Mistake 4: Wrong Environment
❌ Development environment में set किया
✅ Production environment में set करें

---

## 📋 Correct Configuration

### Vercel Environment Variable
```
Name: VITE_API_URL
Value: https://atharvahelth-production.up.railway.app/api
Environment: Production
```

---

## 🆘 If Still Not Working

### Check 1: Variable Name
- Exactly `VITE_API_URL` होना चाहिए (case-sensitive)
- No spaces, no typos

### Check 2: Redeploy
- Variable update के बाद redeploy जरूरी है
- Automatic redeploy नहीं होता

### Check 3: Clear Cache
- Browser cache clear करें
- Hard refresh: `Ctrl + Shift + R` (Windows) या `Cmd + Shift + R` (Mac)

---

## ✅ Success Indicators

Correct configuration के बाद:
- ✅ API calls successful
- ✅ Products load हो रहे हैं
- ✅ No 404 errors
- ✅ Network tab में correct URLs

---

**🚀 Correct URL format set करने के बाद सब कुछ work करेगा!**

