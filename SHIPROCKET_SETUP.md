# 🚚 Shiprocket Integration Setup Guide

## ✅ Integration Complete!

Shiprocket shipping and logistics integration has been successfully added to your application.

---

## 🔧 Setup Instructions

### 1. Get Shiprocket Credentials

1. Go to [Shiprocket Dashboard](https://app.shiprocket.in/)
2. Sign up or Login to your account
3. Navigate to **Settings** → **API** or **Developer** section
4. Get your **Email** and **Password** (or API Token if available)
5. Set up your **Pickup Location** in Shiprocket dashboard

### 2. Configure Backend Environment Variables

Add these to your `backend/.env` file:

```env
# Shiprocket Configuration
SHIPROCKET_EMAIL=your_email@example.com
SHIPROCKET_PASSWORD=your_password
SHIPROCKET_PICKUP_LOCATION=Primary
```

**Important:**
- Use the email and password you use to login to Shiprocket dashboard
- `SHIPROCKET_PICKUP_LOCATION` should match the location name in your Shiprocket account
- Default is "Primary" if you haven't created custom locations

### 3. Configure Pickup Address in Shiprocket

1. Login to Shiprocket Dashboard
2. Go to **Settings** → **Pickup Locations**
3. Add your warehouse/pickup address
4. Set it as "Primary" or note the exact name

### 4. Add Product Weights (Optional but Recommended)

For accurate shipping rates, add weight to your products:

- Go to Admin Panel → Products
- Edit each product
- Add weight in **kg** (e.g., 0.5 for 500g)
- Default weight is 0.1 kg if not specified

### 5. Restart Backend Server

After adding environment variables, restart your backend server:

```bash
cd backend
npm run dev
```

---

## 🎯 How It Works

### Automatic Order Creation:

1. **User places order** → Order saved in database
2. **Shiprocket order created automatically** (if credentials configured)
3. **Shipment can be generated** via admin panel or API
4. **AWB code generated** when shipment is created
5. **Order tracking** available via Shiprocket API

### Manual Shipment Creation:

Admin can create shipment manually:
- Go to Admin Panel → Orders
- Select an order
- Click "Create Shipment" or use API endpoint

---

## 📡 API Endpoints

### Get Shipping Rates
```
POST /api/shiprocket/rates
Authorization: Bearer <token>
Body: {
  pickup_pincode: "110001",
  delivery_pincode: "400001",
  weight: 0.5,
  cod_amount: 1000
}
```

### Create Shiprocket Order
```
POST /api/shiprocket/create-order
Authorization: Bearer <token>
Body: {
  orderId: "order_id_from_database"
}
```

### Create Shipment (Generate AWB)
```
POST /api/shiprocket/create-shipment
Authorization: Bearer <token>
Body: {
  orderId: "order_id",
  courier_id: "optional_courier_id" // Auto-assign if not provided
}
```

### Track Shipment
```
GET /api/shiprocket/track/:orderId
Authorization: Bearer <token>
```

### Cancel Shipment
```
POST /api/shiprocket/cancel
Authorization: Bearer <token>
Body: {
  orderId: "order_id",
  awbs: ["awb_code"] // Optional, uses order's AWB if not provided
}
```

---

## 🔄 Integration Flow

```
User Places Order
    ↓
Order Saved to Database
    ↓
Shiprocket Order Created (Automatic)
    ↓
Admin Creates Shipment (Manual/Auto)
    ↓
AWB Code Generated
    ↓
Order Status: "shipped"
    ↓
Tracking Available
```

---

## 📝 Order Model Updates

Order model now includes:
- `shiprocketOrderId` - Shiprocket order ID
- `shiprocketShipmentId` - Shiprocket shipment ID
- `shiprocketAwbCode` - AWB tracking code
- `shiprocketCourierName` - Courier service name

---

## 🧪 Testing

### Test Shipping Rates:
```bash
curl -X POST http://localhost:5000/api/shiprocket/rates \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "pickup_pincode": "110001",
    "delivery_pincode": "400001",
    "weight": 0.5,
    "cod_amount": 1000
  }'
```

### Test Order Creation:
1. Place an order through checkout
2. Check backend logs for Shiprocket order creation
3. Verify order in Shiprocket dashboard

---

## 🔒 Security Features

✅ **Authentication Required** - All endpoints require user authentication  
✅ **Order Ownership Check** - Users can only access their own orders  
✅ **Secure Credentials** - Credentials stored in environment variables  
✅ **Error Handling** - Graceful fallback if Shiprocket is unavailable  

---

## 📚 Files Created/Modified

### Backend:
- ✅ `backend/src/controllers/shiprocket.controller.ts` - Shiprocket API logic
- ✅ `backend/src/routes/shiprocket.routes.ts` - Shiprocket routes
- ✅ `backend/src/models/Order.ts` - Added Shiprocket fields
- ✅ `backend/src/models/Product.ts` - Added weight field
- ✅ `backend/src/controllers/order.controller.ts` - Auto-create Shiprocket order
- ✅ `backend/src/server.ts` - Added Shiprocket routes
- ✅ `backend/env.template` - Added Shiprocket config

---

## 🚨 Troubleshooting

### Shiprocket Order Not Creating:
- Check if `SHIPROCKET_EMAIL` and `SHIPROCKET_PASSWORD` are set
- Verify credentials are correct
- Check backend logs for authentication errors
- Ensure pickup location exists in Shiprocket dashboard

### Shipping Rates Not Available:
- Verify pickup and delivery pincodes are valid
- Check if weight is provided
- Some pincodes may not have service coverage

### AWB Code Not Generating:
- Ensure Shiprocket order is created first
- Check if courier is available for the route
- Verify order status in Shiprocket dashboard

### Common Issues:

**Issue:** "Shiprocket authentication failed"
- **Solution:** Verify email and password in `.env` file

**Issue:** "Pickup location not found"
- **Solution:** Set `SHIPROCKET_PICKUP_LOCATION` to match your Shiprocket location name

**Issue:** "Invalid pincode"
- **Solution:** Ensure pincodes are 6 digits and valid Indian pincodes

---

## 📚 Additional Resources

- [Shiprocket API Documentation](https://apidocs.shiprocket.in/)
- [Shiprocket Dashboard](https://app.shiprocket.in/)
- [Shiprocket Support](https://support.shiprocket.in/)

---

## ✅ Next Steps

1. ✅ Add Shiprocket credentials to `backend/.env`
2. ✅ Configure pickup location in Shiprocket dashboard
3. ✅ Add product weights (optional)
4. ✅ Restart backend server
5. ✅ Test order creation and shipment generation
6. ✅ Set up webhooks for order status updates (optional)

---

## 🎉 Features

✅ **Automatic Order Creation** - Orders automatically synced to Shiprocket  
✅ **Shipping Rate Calculation** - Get real-time shipping rates  
✅ **Shipment Generation** - Create shipments and get AWB codes  
✅ **Order Tracking** - Track shipments via Shiprocket API  
✅ **Multiple Couriers** - Shiprocket assigns best courier automatically  
✅ **COD Support** - Cash on Delivery orders fully supported  

---

**Shiprocket integration is ready! 🚀**

