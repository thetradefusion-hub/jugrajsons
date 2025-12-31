# MongoDB Atlas MCP Setup Guide

## 🔍 Current Status

MCP connection check करने पर error आ रहा है। यह possible है कि:

1. Connection string properly configured नहीं है
2. MCP server properly start नहीं हुआ
3. MongoDB Atlas credentials missing हैं

---

## ✅ MongoDB Atlas MCP Setup Steps

### Step 1: MongoDB Atlas Connection String प्राप्त करें

1. **MongoDB Atlas पर जाएं:**
   - https://www.mongodb.com/cloud/atlas
   - Login करें

2. **Cluster select करें:**
   - अपना cluster click करें

3. **Connect button click करें:**
   - "Connect" button पर click करें

4. **Connection method select करें:**
   - "Connect your application" select करें

5. **Connection string copy करें:**
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

---

### Step 2: MCP Configuration

**Cursor/Storm MCP में MongoDB connection string add करें:**

#### Option A: Cursor Settings में

1. Cursor Settings खोलें
2. MCP Servers section में जाएं
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
           "MONGODB_URI": "mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority"
         }
       }
     }
   }
   ```

#### Option B: Environment Variables में

`.env` file में add करें:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
```

---

### Step 3: Connection Test करें

MCP connection test करने के लिए:

1. **Connection string verify करें:**
   - Username और password correct हैं?
   - Cluster URL correct है?

2. **Network Access check करें:**
   - MongoDB Atlas → Network Access
   - आपका IP address allow है?
   - या `0.0.0.0/0` (all IPs) allow करें

3. **Database User check करें:**
   - MongoDB Atlas → Database Access
   - User exists और proper permissions हैं?

---

## 🔧 Troubleshooting

### Error: "Internal error communicating with server"
- **Solution:** MCP server restart करें
- Connection string verify करें
- MongoDB Atlas cluster running है?

### Error: "Authentication failed"
- **Solution:** Username/password check करें
- Database user permissions verify करें

### Error: "Connection timeout"
- **Solution:** Network Access में IP allow करें
- Firewall settings check करें

---

## ✅ Quick Test

MCP connection test करने के लिए ये commands try करें:

```javascript
// MCP tools available:
- mcp_atharvaa_list-databases
- mcp_atharvaa_list-collections
- mcp_atharvaa_find
- mcp_atharvaa_insert-many
```

---

## 📝 Next Steps

1. ✅ MongoDB Atlas connection string प्राप्त करें
2. ✅ MCP configuration में add करें
3. ✅ Connection test करें
4. ✅ Database और collections create करें

---

## 💡 Alternative: Direct Backend Connection

अगर MCP properly work नहीं कर रहा, तो आप directly backend से MongoDB Atlas connect कर सकते हैं:

`backend/.env` file में:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/atharvahelth?retryWrites=true&w=majority
```

फिर backend start करें:
```bash
cd backend
npm run dev
```

---

**क्या आपके पास MongoDB Atlas connection string है? अगर हां, तो मैं help कर सकता हूं properly configure करने में!**

