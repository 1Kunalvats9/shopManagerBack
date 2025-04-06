import express from "express";
import User from "../models/userModel.js";

const router = express.Router();

// POST /api/user/get
router.post("/get", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, error: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, error: "User does not exist" });
    }
    return res.status(200).json({ success: true, data: user });

  } catch (err) {
    console.error("Error in /api/user/get:", err.message);
    return res.status(500).json({ success: false, error: "Error in fetching user details" });
  }
});

export default router;
