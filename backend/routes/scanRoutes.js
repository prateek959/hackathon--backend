import express from 'express';
import QRCode from 'qrcode';
const scanRoutes = express.Router();

scanRoutes.post('/generate', async (req, res) => {
  try {
    const { totalCalories, itemCount } = req.body.qrData;

    if (totalCalories == null || itemCount == null) {
      return res.status(400).json({ error: 'Invalid data' });
    }

    // Generate the QR code with totalCalories and itemCount
    const qrData = {
      totalCalories,
      itemCount,
    };

    const qrCodeImage = await QRCode.toDataURL(JSON.stringify(qrData), {
      version: 10, // Can handle more data if needed
    });

    res.json({ qrData: qrCodeImage });
  } catch (error) {
    console.error('Error generating QR code:', error);
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
});

export default scanRoutes;
