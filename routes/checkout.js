import express from 'express';
import Inventory from '../models/inventory.js';
const router = express.Router();

router.post('/checkout-product', async (req, res) => {
  try {
    const { cart } = req.body;

    for (const item of cart) {
      await Inventory.updateOne(
        { 'products._id': item.id },
        { $inc: { 'products.$.quantity': -item.quantity } }
      );
    }

    res.status(200).json({ success: true, message: "Product updated successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
