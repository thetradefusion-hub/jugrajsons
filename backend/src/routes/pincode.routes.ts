import { Router, Request, Response } from 'express';
import axios from 'axios';

const router = Router();

/**
 * India Post pincode lookup (server-side to avoid browser CORS on api.postalpincode.in).
 */
router.get('/:code', async (req: Request, res: Response) => {
  const code = String(req.params.code || '').replace(/\D/g, '').slice(0, 6);
  if (code.length !== 6) {
    return res.status(400).json({ message: 'Enter a 6-digit pincode' });
  }

  try {
    const { data } = await axios.get(`https://api.postalpincode.in/pincode/${code}`, {
      timeout: 8000,
    });

    if (data?.Status === 'Success' && Array.isArray(data.PostOffice) && data.PostOffice.length > 0) {
      const po = data.PostOffice[0];
      const city = (po.District || po.Name || '').trim();
      const state = (po.State || '').trim();
      if (city && state) {
        return res.json({ pincode: code, city, state });
      }
    }

    return res.status(404).json({ message: 'Pincode not found' });
  } catch {
    return res.status(502).json({ message: 'Pincode lookup failed. Try again or enter city manually.' });
  }
});

export default router;
