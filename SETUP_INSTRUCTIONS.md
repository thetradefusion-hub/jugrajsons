# 🚀 MongoDB Atlas Setup Instructions

## ✅ Connection String Received

आपका MongoDB Atlas connection string:
```
mongodb+srv://thetradefusion_db_user:<db_password>@atharvaadmin.gnwokao.mongodb.net/?appName=atharvaadmin
```

---

## 📋 Step-by-Step Setup

### Step 1: Backend .env File Create करें

`backend` folder में `.env` file manually create करें:

1. `backend` folder में जाएं
2. New file create करें: `.env`
3. नीचे दिया गया content copy करें और **`<db_password>` को अपना actual password से replace करें:**

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://thetradefusion_db_user:YOUR_ACTUAL_PASSWORD_HERE@atharvaadmin.gnwokao.mongodb.net/atharvahelth?retryWrites=true&w=majority&appName=atharvaadmin

# JWT Configuration
JWT_SECRET=atharvahelth_super_secret_jwt_key_change_in_production_2024
JWT_EXPIRE=7d

# Frontend URL (CORS के लिए)
FRONTEND_URL=http://localhost:8080

# File Upload Configuration
UPLOAD_PATH=./uploads/products
MAX_FILE_SIZE=5242880
```

**Example (अगर password `MyPass123!` है):**
```env
MONGODB_URI=mongodb+srv://thetradefusion_db_user:MyPass123!@atharvaadmin.gnwokao.mongodb.net/atharvahelth?retryWrites=true&w=majority&appName=atharvaadmin
```

---

### Step 2: Password जानें

अगर password नहीं पता है:

1. MongoDB Atlas dashboard पर जाएं: https://cloud.mongodb.com
2. **Database Access** section में जाएं
3. `thetradefusion_db_user` user को find करें
4. **Edit** button click करें
5. Password copy करें या **Edit Password** से reset करें

---

### Step 3: Special Characters Handle करें

अगर password में special characters हैं, तो URL encode करें:

| Character | Encoded |
|-----------|---------|
| `@` | `%40` |
| `#` | `%23` |
| `$` | `%24` |
| `%` | `%25` |
| `&` | `%26` |
| `+` | `%2B` |
| `=` | `%3D` |
| `/` | `%2F` |
| `?` | `%3F` |

**Example:**
- Original: `MyPass@123!`
- Encoded: `MyPass%40123!`

---

### Step 4: Backend Test करें

1. `.env` file save करें
2. Backend start करें:

```bash
cd backend
npm run dev
```

3. अगर connection successful है, तो console में दिखेगा:
```
✅ MongoDB Connected: atharvaadmin.gnwokao.mongodb.net
🚀 Server running on port 5000
```

4. Browser में test करें:
```
http://localhost:5000/api/health
```

---

### Step 5: MCP Configuration (Optional)

अगर MCP use करना है:

1. Cursor Settings (Ctrl+,) खोलें
2. MCP Servers section में MongoDB configuration:

```json
{
  "mcpServers": {
    "mongodb": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-mongodb"],
      "env": {
        "MONGODB_URI": "mongodb+srv://thetradefusion_db_user:YOUR_ACTUAL_PASSWORD@atharvaadmin.gnwokao.mongodb.net/?retryWrites=true&w=majority&appName=atharvaadmin"
      }
    }
  }
}
```

3. Cursor restart करें

---

## ✅ Verification Checklist

- [ ] `.env` file `backend` folder में create हो गई
- [ ] `<db_password>` को actual password से replace किया
- [ ] Special characters properly encoded (अगर हैं)
- [ ] Backend server start किया
- [ ] MongoDB connection successful message दिखा
- [ ] `/api/health` endpoint test किया

---

## 🐛 Common Issues

### Issue: "Authentication failed"
**Solution:** 
- Password correct है?
- Special characters encoded हैं?
- User exists और active है?

### Issue: "Connection timeout"
**Solution:**
- MongoDB Atlas → Network Access
- आपका IP address allow है?
- या `0.0.0.0/0` (all IPs) allow करें

### Issue: "Database not found"
**Solution:**
- Connection string में database name (`atharvahelth`) add है?
- Database automatically create हो जाएगा पहली collection create करने पर

---

## 📝 Next Steps

1. ✅ `.env` file create करें
2. ✅ Password replace करें
3. ✅ Backend start करें
4. ✅ Connection verify करें
5. ⏭️ Admin user create करें
6. ⏭️ Products add करें

---

**अगर कोई problem हो तो बताएं!** 🚀

