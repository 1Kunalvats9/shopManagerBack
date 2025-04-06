import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  quantity: { type: Number, required: true },
  retailPrice: { type: Number, required: true },
  wholesalePrice: { type: Number, required: true },
  url:{type:String, required:false}
});

const InventorySchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true }, 
  products: [ProductSchema],
  createdAt: { type: Date, default: Date.now },
});
const Inventory = mongoose.models.Inventory || mongoose.model("Inventory", InventorySchema, "inventory");

export default Inventory;
