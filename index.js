import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import inventoryRoutes from "./routes/inventory.js"
import uploadRoute from "./routes/upload.js";
import smsRoutes from "./routes/sms.js";
import checkoutRoutes from "./routes/checkout.js"
import userRoutes from "./routes/user.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running");
});

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("MongoDB connected");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => console.log("DB Error:", err));

app.use("/api/inventory", inventoryRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoute);
app.use("/api/sms", smsRoutes);
app.use("/api/checkout",checkoutRoutes)
app.use("/api/user", userRoutes);