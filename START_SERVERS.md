# 🚀 Server Start Guide

## ✅ Servers Started in Separate Windows

### Backend Server
- **Status:** ✅ Started in separate PowerShell window
- **Port:** 5000
- **URL:** http://localhost:5000
- **API:** http://localhost:5000/api/health

### Frontend Server
- **Status:** ✅ Started in separate PowerShell window
- **Port:** 8080
- **URL:** http://localhost:8080
- **Admin:** http://localhost:8080/admin/login

---

## 📋 What You Should See

### Backend PowerShell Window:
```
🚀 Server running on port 5000
📡 API: http://localhost:5000/api
✅ MongoDB Connected: ...
```

### Frontend PowerShell Window:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:8080/
➜  Network: use --host to expose
```

---

## 🔍 Troubleshooting

### If Backend Not Starting:
1. Check backend PowerShell window for errors
2. Verify MongoDB connection
3. Check if port 5000 is available
4. Verify `.env` file in `backend` folder

### If Frontend Not Starting:
1. Check frontend PowerShell window for errors
2. Verify `node_modules` installed: `npm install`
3. Check if port 8080 is available
4. Verify `.env` file in root folder

### If URLs Not Working:
1. Wait 10-15 seconds for servers to fully start
2. Check PowerShell windows for any error messages
3. Verify both servers are running:
   - Backend: http://localhost:5000/api/health
   - Frontend: http://localhost:8080

---

## 🎯 Quick Test

### Test Backend:
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/health"
```

### Test Frontend:
Open browser: http://localhost:8080

### Test Admin Panel:
Open browser: http://localhost:8080/admin/login

---

## 📝 Manual Start (If Needed)

### Backend:
```bash
cd backend
npm run dev
```

### Frontend:
```bash
npm run dev
```

---

**Check the PowerShell windows that opened - they should show server logs!** 🚀

