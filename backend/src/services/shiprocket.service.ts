import axios from 'axios';
import Order from '../models/Order';
import Product from '../models/Product';

const SHIPROCKET_API_URL = 'https://apiv2.shiprocket.in/v1/external';

export async function getShiprocketToken(): Promise<string | null> {
  try {
    const email = process.env.SHIPROCKET_EMAIL?.trim();
    const password = process.env.SHIPROCKET_PASSWORD?.trim();

    if (!email || !password) {
      console.error('Shiprocket credentials not configured');
      return null;
    }

    const response = await axios.post(
      `${SHIPROCKET_API_URL}/auth/login`,
      { email, password },
      { headers: { 'Content-Type': 'application/json' } }
    );

    const token = response.data?.token;
    if (!token) {
      console.error('Shiprocket login response missing token', response.data);
      return null;
    }
    return token;
  } catch (error: any) {
    console.error('Shiprocket authentication error:', error.response?.data || error.message);
    return null;
  }
}

/** Shiprocket expects a 10-digit Indian mobile (no country code). */
export function normalizeIndianMobile(phone: string): string {
  const digits = (phone || '').replace(/\D/g, '');
  if (digits.length >= 12 && digits.startsWith('91')) return digits.slice(-10);
  if (digits.length > 10) return digits.slice(-10);
  return digits;
}

export type ShiprocketSyncResult =
  | { ok: true; order_id: string; shipment_id: string }
  | { ok: false; message: string; details?: unknown };

/**
 * Creates Shiprocket adhoc order from DB order. Optionally assigns AWB when SHIPROCKET_AUTO_AWB=true.
 * @see https://apidocs.shiprocket.in/
 */
export async function syncShiprocketOrderFromDb(
  orderId: string,
  options?: { requireUserId?: string }
): Promise<ShiprocketSyncResult> {
  const order = await Order.findById(orderId)
    .populate('items.product', 'name sku weight')
    .populate('user', 'email');

  if (!order) {
    return { ok: false, message: 'Order not found' };
  }

  if (options?.requireUserId && order.user.toString() !== options.requireUserId) {
    return { ok: false, message: 'Unauthorized' };
  }

  const userEmail = (order.user as { email?: string })?.email;
  if (!userEmail) {
    return { ok: false, message: 'User email missing for Shiprocket billing' };
  }

  if (order.shiprocketOrderId) {
    return {
      ok: true,
      order_id: order.shiprocketOrderId,
      shipment_id: order.shiprocketShipmentId || order.shiprocketOrderId,
    };
  }

  const token = await getShiprocketToken();
  if (!token) {
    return { ok: false, message: 'Shiprocket authentication failed' };
  }

  const orderItems: { name: string; sku: string; units: number; selling_price: number }[] = [];
  let totalWeight = 0;

  for (const item of order.items) {
    const ref = item.product as { _id?: unknown; name?: string; sku?: string; weight?: number } | null;
    const pid = ref && typeof ref === 'object' && '_id' in ref && ref._id ? ref._id : item.product;
    const product = await Product.findById(pid as string);
    if (product) {
      const weight = product.weight || 0.1;
      totalWeight += weight * item.quantity;
        orderItems.push({
        name: product.name,
        sku: product.sku || product._id.toString(),
        units: item.quantity,
        selling_price: Math.round(item.price),
      });
    }
  }

  if (orderItems.length === 0) {
    return { ok: false, message: 'No valid line items for Shiprocket' };
  }

  const lineSubTotal = Math.round(order.items.reduce((sum, it) => sum + it.price * it.quantity, 0));
  const phoneDigits = normalizeIndianMobile(order.shippingAddress.phone);
  if (phoneDigits.length !== 10) {
    return {
      ok: false,
      message: 'Shiprocket requires a 10-digit Indian mobile number on the shipping address',
    };
  }

  const pincodeDigits = String(order.shippingAddress.pincode).replace(/\D/g, '').slice(0, 6);
  if (pincodeDigits.length !== 6) {
    return { ok: false, message: 'Shiprocket requires a valid 6-digit delivery pincode' };
  }

  // Shiprocket External API: numeric-looking fields are sent as JSON numbers where the docs expect integers
  const shiprocketOrder = {
    order_id: order._id.toString(),
    order_date: new Date(order.createdAt || Date.now()).toISOString().split('T')[0],
    pickup_location: process.env.SHIPROCKET_PICKUP_LOCATION?.trim() || 'Primary',
    billing_customer_name: order.shippingAddress.name,
    billing_last_name: '',
    billing_address: order.shippingAddress.addressLine1,
    billing_address_2: order.shippingAddress.addressLine2 || '',
    billing_city: order.shippingAddress.city,
    billing_pincode: Number(pincodeDigits),
    billing_state: order.shippingAddress.state,
    billing_country: 'India',
    billing_email: userEmail,
    billing_phone: Number(phoneDigits),
    shipping_is_billing: true,
    shipping_customer_name: order.shippingAddress.name,
    shipping_last_name: '',
    shipping_address: order.shippingAddress.addressLine1,
    shipping_address_2: order.shippingAddress.addressLine2 || '',
    shipping_city: order.shippingAddress.city,
    shipping_pincode: Number(pincodeDigits),
    shipping_country: 'India',
    shipping_state: order.shippingAddress.state,
    shipping_phone: Number(phoneDigits),
    shipping_email: userEmail,
    order_items: orderItems,
    payment_method: order.paymentMethod === 'cod' ? 'COD' : 'Prepaid',
    sub_total: lineSubTotal,
    length: 10,
    breadth: 10,
    height: 10,
    weight: totalWeight || 0.5,
  };

  try {
    const response = await axios.post(`${SHIPROCKET_API_URL}/orders/create/adhoc`, shiprocketOrder, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const srOrderId = String(response.data.order_id);
    const srShipmentId = String(response.data.shipment_id);

    order.shiprocketOrderId = srOrderId;
    order.shiprocketShipmentId = srShipmentId;
    await order.save();

    // One-click: assign AWB unless explicitly disabled (SHIPROCKET_AUTO_AWB=false)
    if (process.env.SHIPROCKET_AUTO_AWB !== 'false' && srShipmentId) {
      try {
        const awbRes = await axios.post(
          `${SHIPROCKET_API_URL}/orders/create/adhoc/shipment/awb`,
          { shipment_id: srShipmentId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        if (awbRes.data?.awb_code) {
          order.shiprocketAwbCode = String(awbRes.data.awb_code);
          order.shiprocketCourierName = awbRes.data.courier_name;
          await order.save();
        }
      } catch (awbErr: any) {
        console.warn('[Shiprocket] Auto AWB failed (order still created in Shiprocket):', awbErr.response?.data || awbErr.message);
      }
    }

    return { ok: true, order_id: srOrderId, shipment_id: srShipmentId };
  } catch (error: any) {
    const details = error.response?.data;
    console.error('[Shiprocket] orders/create/adhoc failed:', JSON.stringify(details || error.message));
    return {
      ok: false,
      message:
        (typeof details?.message === 'string' && details.message) ||
        (Array.isArray(details?.errors) && details.errors.join?.(', ')) ||
        error.message ||
        'Failed to create Shiprocket order',
      details,
    };
  }
}
