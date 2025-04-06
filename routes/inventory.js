import express from "express";
import Inventory from "../models/inventory.js"
import mongoose from "mongoose";

const router = express.Router();


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("MongoDB connected");
}).catch(err => console.log("DB Error:", err));


router.post("/inventoryput", async (req, res) => {
    try {
      const { email, name, category, quantity, retailPrice, wholesalePrice, url } = req.body;
  
      if (!email || !name) {
        return res.status(400).json({ success: false, message: "Required fields missing" });
      }
  
      let inventory = await Inventory.findOne({ email });
  
      if (!inventory) {
        inventory = new Inventory({ email, products: [] });
      }
  
      inventory.products.push({ name, category, quantity, retailPrice, wholesalePrice, url });
  
      await inventory.save();
  
      res.status(201).json({ success: true, message: "Product added successfully" });
    } catch (err) {
      console.error("❌ Error adding product:", err);
      res.status(500).json({ success: false, message: err.message });
    }
  });

  router.put("/update-product", async (req, res) => {
    try {
      const { _id, name, quantity, retailPrice } = req.body;
  
      const updated = await Inventory.updateOne(
        { "products._id": _id },
        {
          $set: {
            "products.$.name": name,
            "products.$.quantity": quantity,
            "products.$.retailPrice": retailPrice
          }
        }
      );
  
      if (updated.modifiedCount === 0) {
        return res.status(404).json({ success: false, message: "Product not found or already updated" });
      }
  
      res.status(200).json({ success: true, message: "Product updated successfully" });
    } catch (err) {
      console.error("❌ Error updating product:", err);
      res.status(500).json({ success: false, error: err.message });
    }
  });
  
  router.delete("/delete-product", async (req, res) => {
    try {
      const { id } = req.body;
  
      const deleted = await Inventory.updateOne(
        { "products._id": id },
        { $pull: { products: { _id: id } } }
      );
  
      if (deleted.modifiedCount === 0) {
        return res.status(404).json({ success: false, message: "Product not found" });
      }
  
      res.status(200).json({ success: true, message: "Product deleted successfully" });
    } catch (err) {
      console.error("❌ Error deleting product:", err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  
router.post("/inventoryget", async (req, res) => {
  try {
    const { email } = await req.body;
    if (!email) {
      return res.status(400).json({ success: false, error: "Email is required" });
    }

    const inventory = await Inventory.findOne({ email });
    const products = inventory ? inventory.products : [];
    res.status(200).json({ success: true, data: products });
  } catch (err) {
    console.error("❌ Error fetching inventory:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/inventory-data', async (req,res)=>{
  try{
        console.log("📩 Incoming request body:", req.body); // Add this
        const { email } = req.body;

        if (!email) return res.status(400).json({ success: false, error: "Email is required" });
        const inventory = await Inventory.findOne({ email });
        console.log(inventory) 
        const products = inventory ? inventory.products : [];
        const inventoryData = {
            totalProducts:products.length
        }

        return res.status(200).json({ success: true, data: inventoryData });

  }catch(err){
    console.error("❌ Error fetching inventory:", err.stack || err);
    res.status(500).json({ success: false, error: err.message });
  }
})
export default router;

