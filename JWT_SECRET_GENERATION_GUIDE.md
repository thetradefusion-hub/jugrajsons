# 🔐 JWT_SECRET Generation Guide

## ❓ JWT_SECRET क्या है?

JWT_SECRET एक secret key है जो JSON Web Tokens को sign और verify करने के लिए use होती है। यह security के लिए बहुत important है।

---

## ⚠️ Important Notes

- ✅ **Strong और Random** होना चाहिए
- ✅ **Minimum 32 characters** लंबा होना चाहिए
- ✅ **Never share** करें या public में expose न करें
- ✅ **Production में unique** होना चाहिए
- ❌ **Never commit** git में

---

## 🚀 JWT_SECRET Generate करने के Methods

### Method 1: OpenSSL (Recommended) ⭐

**Windows (PowerShell):**
```powershell
# OpenSSL install होना चाहिए
openssl rand -base64 32
```

**Linux/Mac:**
```bash
openssl rand -base64 32
```

**Output Example:**
```
K8mN2pQ5rT9vW1xY3zA6bC7dE0fG2hI4jK5lM6nO7pQ8rS9tU0vW1xY2z=
```

---

### Method 2: Node.js Script

**Terminal में run करें:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Output Example:**
```
aB3cD5eF7gH9iJ1kL2mN4oP6qR8sT0uV2wX4yZ6aB8cD0eF2gH4iJ6kL8mN=
```

---

### Method 3: Online Generator (Less Secure)

⚠️ **Not Recommended** for production, but can use for testing:
- https://randomkeygen.com/
- "CodeIgniter Encryption Keys" section use करें
- 32+ characters का key select करें

---

### Method 4: Manual Random String

आप manually भी बना सकते हैं:
- Random letters (uppercase, lowercase)
- Numbers
- Special characters
- Minimum 32 characters

**Example:**
```
AtharvaHelth2024SecretKeyForJWTTokenGeneration!@#$%^&*
```

---

## 📋 Step-by-Step: JWT_SECRET Generate करें

### Step 1: Open Terminal/PowerShell

Windows में:
- `Win + X` → `Windows PowerShell` या `Terminal`

### Step 2: Command Run करें

**Option A: Node.js (Easiest)**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Option B: OpenSSL**
```bash
openssl rand -base64 32
```

### Step 3: Generated Key Copy करें

Output में जो key मिलेगा, उसे copy करें:
```
Example: K8mN2pQ5rT9vW1xY3zA6bC7dE0fG2hI4jK5lM6nO7pQ8rS9tU0vW1xY2z=
```

### Step 4: Railway में Add करें

1. Railway dashboard → Service → **Variables** tab
2. **New Variable** click करें
3. **Name:** `JWT_SECRET`
4. **Value:** Generated key paste करें
5. **Add** click करें

---

## ✅ Verification

JWT_SECRET correctly set होने के बाद:
- Service logs में error नहीं आएगा
- User login/register successfully काम करेगा
- Tokens properly generate होंगे

---

## 🔒 Security Best Practices

1. ✅ **Strong Key:** Minimum 32 characters
2. ✅ **Random:** Cryptographically random
3. ✅ **Unique:** हर environment के लिए different
4. ✅ **Secret:** Never expose publicly
5. ✅ **Rotate:** Periodically change (optional)

---

## 📝 Example JWT_SECRET Values

**Good Examples (32+ characters):**
```
K8mN2pQ5rT9vW1xY3zA6bC7dE0fG2hI4jK5lM6nO7pQ8rS9tU0vW1xY2z=
aB3cD5eF7gH9iJ1kL2mN4oP6qR8sT0uV2wX4yZ6aB8cD0eF2gH4iJ6kL8mN=
XyZ9aB2cD4eF6gH8iJ0kL2mN4oP6qR8sT0uV2wX4yZ6aB8cD0eF2gH4iJ6kL=
```

**Bad Examples (Avoid):**
```
❌ secret
❌ password123
❌ jwt_secret
❌ my_secret_key
❌ 1234567890
```

---

## 🎯 Quick Command

**सबसे आसान तरीका:**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

यह command run करें और output को copy करके Railway में `JWT_SECRET` variable के रूप में add करें।

---

## 📍 Where to Use

### Railway Environment Variables
- **Name:** `JWT_SECRET`
- **Value:** Generated key
- **Environment:** Production

### Local Development (.env file)
```env
JWT_SECRET=your_generated_key_here
```

⚠️ **Never commit** `.env` file to git!

---

## 🆘 Troubleshooting

### Error: JWT_SECRET is not defined
**Solution:**
- Railway में `JWT_SECRET` variable add करें
- Variable name exactly `JWT_SECRET` होना चाहिए

### Error: Invalid token
**Solution:**
- JWT_SECRET verify करें
- Same key use करें जो token generate करते समय use किया था

---

## ✅ Checklist

- [ ] JWT_SECRET generated (32+ characters)
- [ ] Railway में `JWT_SECRET` variable added
- [ ] Value correctly set
- [ ] Service restarted
- [ ] Login/Register working

---

**🔐 JWT_SECRET generate करने के बाद Railway में add करें और service restart होगा!**

