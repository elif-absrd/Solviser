import { Request, Response } from 'express';
import logger from '../middleware/logger.middleware';

export const verifyGst = async (req: Request, res: Response) => {
  const { gstin } = req.body;

  if (!gstin || gstin.length !== 15) {
    return res.status(400).json({ error: 'A valid 15-digit GSTIN is required.' });
  }

  try {
    // ⚠️ MOCK API RESPONSE - Replace with a real GST verification API call in the future
    const dummyData = {
      firmName: "Juris Chambers & Co.",
      address: "Suite 404, Justice Tower, Court Lane",
      city: "New Delhi",
      state: "DELHI",
      pincode: "110001",
      registrationDate: "2018-11-22",
    };

    // Simulate network delay for a realistic user experience
    setTimeout(() => {
      res.json(dummyData);
    }, 1000);

  } catch (error: any) {
    logger.error(`GST verification mock failed: ${error.message}`);
    res.status(500).json({ error: 'Could not perform GST verification.' });
  }
};