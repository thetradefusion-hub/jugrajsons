# 💳 Razorpay Payment Integration Setup

## ✅ Integration Complete!

Razorpay payment gateway has been successfully integrated into your application.

---

## 🔧 Setup Instructions

### 1. Get Razorpay API Keys

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Sign up or Login to your account
3. Navigate to **Settings** → **API Keys**
4. Generate **Test Keys** (for development) or **Live Keys** (for production)
5. Copy your **Key ID** and **Key Secret**

### 2. Configure Backend Environment Variables

Add these to your `backend/.env` file:

```env
# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here
```

**Important:**
- For **development**: Use Test Keys (starts with `rzp_test_`)
- For **production**: Use Live Keys (starts with `rzp_live_`)

### 3. Restart Backend Server

After adding environment variables, restart your backend server:

```bash
cd backend
npm run dev
```

---

## 🎯 How It Works

### Payment Flow:

1. **User selects "Online Payment"** in checkout
2. **Order is created** in database with `paymentStatus: 'pending'`
3. **Razorpay order is created** via `/api/payment/create-order`
4. **Razorpay checkout opens** with payment options
5. **User completes payment** (UPI/Card/Net Banking/Wallet)
6. **Payment is verified** via `/api/payment/verify`
7. **Order status updated** to `paymentStatus: 'paid'`
8. **User redirected** to order success page

---

## 📡 API Endpoints

### Create Razorpay Order
```
POST /api/payment/create-order
Authorization: Bearer <token>
Body: {
  amount: number,
  currency: 'INR',
  orderId: string
}
```

### Verify Payment
```
POST /api/payment/verify
Authorization: Bearer <token>
Body: {
  razorpay_order_id: string,
  razorpay_payment_id: string,
  razorpay_signature: string,
  orderId: string
}
```

---

## 🧪 Testing

### Test Cards (Test Mode):

| Card Number | CVV | Expiry | Result |
|------------|-----|--------|--------|
| 4111 1111 1111 1111 | Any | Any future date | Success |
| 5555 5555 5555 4444 | Any | Any future date | Success |
| 4000 0000 0000 0002 | Any | Any future date | Failure |

### Test UPI IDs:
- `success@razorpay` - Success
- `failure@razorpay` - Failure

---

## 🔒 Security Features

✅ **Payment Signature Verification** - All payments are verified using HMAC SHA256  
✅ **Order Ownership Check** - Users can only pay for their own orders  
✅ **Secure API Keys** - Keys stored in environment variables  
✅ **HTTPS Required** - Razorpay requires HTTPS in production  

---

## 📝 Files Modified/Created

### Backend:
- ✅ `backend/src/controllers/payment.controller.ts` - Payment logic
- ✅ `backend/src/routes/payment.routes.ts` - Payment routes
- ✅ `backend/src/models/Order.ts` - Added `paymentId` field
- ✅ `backend/src/server.ts` - Added payment routes
- ✅ `backend/env.template` - Added Razorpay config

### Frontend:
- ✅ `src/pages/Checkout.tsx` - Razorpay integration
- ✅ `index.html` - Added Razorpay script
- ✅ `package.json` - Added razorpay dependency

---

## 🚨 Troubleshooting

### Payment Not Opening:
- Check if Razorpay script is loaded: `window.Razorpay` should exist
- Verify API keys are correct in `.env`
- Check browser console for errors

### Payment Verification Failing:
- Ensure `RAZORPAY_KEY_SECRET` is correct
- Check backend logs for signature mismatch errors
- Verify order belongs to the user

### Order Status Not Updating:
- Check backend server logs
- Verify MongoDB connection
- Check if payment verification endpoint is being called

---

## 📚 Additional Resources

- [Razorpay Documentation](https://razorpay.com/docs/)
- [Razorpay Checkout Integration](https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/)
- [Razorpay Test Cards](https://razorpay.com/docs/payments/payment-gateway/test-cards/)

---

## ✅ Next Steps

1. ✅ Add Razorpay keys to `backend/.env`
2. ✅ Restart backend server
3. ✅ Test payment flow with test cards
4. ✅ Switch to live keys for production
5. ✅ Enable webhook for payment status updates (optional)

---

**Payment integration is ready! 🎉**

