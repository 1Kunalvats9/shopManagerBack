import express from "express";
import twilio from "twilio";
const router = express.Router();


const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);
// POST /api/sms/send
router.post("/send", async (req, res) => {
  try {
    console.log("Twilio Account SID:", process.env.TWILIO_ACCOUNT_SID);
    console.log("Twilio Auth Token:", process.env.TWILIO_AUTH_TOKEN);
    const { phoneNumber, billDetails } = req.body;

    const message = await client.messages.create({
      body: `🧾 Bill from ShopManager:\n${billDetails}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `+91${phoneNumber}`, // E.164 format
    });

    res.status(200).json({ success: true, sid: message.sid });
  } catch (err) {
    console.error("❌ SMS Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
