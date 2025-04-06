import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLODUINARY_API,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

// POST /api/upload/upload-file
router.post("/upload-file", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const fileBase64 = req.file.buffer.toString("base64");
    const dataUri = `data:${req.file.mimetype};base64,${fileBase64}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      resource_type: "auto",
    });

    return res.status(200).json({ url: result.secure_url });
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({ error: err.message });
  }
});


export default router;
