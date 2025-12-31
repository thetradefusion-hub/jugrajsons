# MongoDB Atlas MCP Connection Setup

## 🔍 Current Status

**Connection String Received:**
```
mongodb+srv://thetradefusion_db_user:<db_password>@atharvaadmin.gnwokao.mongodb.net/?appName=atharvaadmin
```

**Issue:** Connection string में `<db_password>` placeholder है, actual password replace करना होगा।

---

## ⚠️ Important: Password Replace करें

आपको connection string में `<db_password>` को अपना **actual MongoDB Atlas database password** से replace करना होगा।

### Step 1: MongoDB Atlas Password जानें

1. MongoDB Atlas dashboard पर जाएं
2. **Database Access** section में जाएं
3. `thetradefusion_db_user` user को find करें
4. Password copy करें (या reset करें अगर भूल गए हैं)

### Step 2: Connection String Update करें

**Backend `.env` file में:**
```env
MONGODB_URI=mongodb+srv://thetradefusion_db_user:YOUR_ACTUAL_PASSWORD@atharvaadmin.gnwokao.mongodb.net/atharvahelth?retryWrites=true&w=majority&appName=atharvaadmin
```

**Example (अगर password `MyPass123!` है):**
```env
MONGODB_URI=mongodb+srv://thetradefusion_db_user:MyPass123!@atharvaadmin.gnwokao.mongodb.net/atharvahelth?retryWrites=true&w=majority&appName=atharvaadmin
```

---

## 🔧 MCP Configuration (Storm MCP)

### Option 1: Cursor Settings में

1. Cursor Settings खोलें (Ctrl+,)
2. **MCP Servers** section में जाएं
3. MongoDB MCP server configuration में:

```json
{
  "mcpServers": {
    "mongodb": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-mongodb"
      ],
      "env": {
        "MONGODB_URI": "mongodb+srv://thetradefusion_db_user:YOUR_ACTUAL_PASSWORD@atharvaadmin.gnwokao.mongodb.net/?retryWrites=true&w=majority&appName=atharvaadmin"
      }
    }
  }
}
```

### Option 2: Environment Variables में

System environment variables में add करें:
```env
MONGODB_URI=mongodb+srv://thetradefusion_db_user:YOUR_ACTUAL_PASSWORD@atharvaadmin.gnwokao.mongodb.net/?retryWrites=true&w=majority&appName=atharvaadmin
```

---

## ✅ Connection Test करें

### Backend से Test:

1. `.env` file में actual password add करें
2. Backend start करें:
```bash
cd backend
npm run dev
```

3. अगर connection successful है, तो console में दिखेगा:
```
✅ MongoDB Connected: atharvaadmin.gnwokao.mongodb.net
```

### MCP से Test:

MCP connection string update करने के बाद:
- Cursor restart करें
- MCP tools test करें:
  - `mcp_atharvaa_list-databases`
  - `mcp_atharvaa_list-collections`

---

## 🔒 Security Notes

1. **Password को URL encode करें** अगर special characters हैं:
   - `@` → `%40`
   - `#` → `%23`
   - `$` → `%24`
   - `%` → `%25`
   - `&` → `%26`
   - `+` → `%2B`
   - `=` → `%3D`

2. **`.env` file को `.gitignore` में रखें** (already done)

3. **Production में strong password use करें**

---

## 📝 Quick Checklist

- [ ] MongoDB Atlas password जानते हैं
- [ ] Backend `.env` file में password replace किया
- [ ] MCP configuration में password replace किया
- [ ] Backend server start किया और connection test किया
- [ ] MCP tools test किए

---

## 🐛 Troubleshooting

### Error: "Authentication failed"
- Password correct है?
- Special characters properly encoded हैं?
- User permissions check करें

### Error: "Connection timeout"
- Network Access में IP allow है?
- MongoDB Atlas cluster running है?

### Error: "Database not found"
- Database name verify करें (`atharvahelth`)
- Connection string में database name add है?

---

**अगर आपको actual password पता है, तो मैं help कर सकता हूं properly configure करने में!**

