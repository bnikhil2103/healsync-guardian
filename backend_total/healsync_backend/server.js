require("dotenv").config();

const admin = require("firebase-admin");
const serviceAccount = require("./firebaseKey.json");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
const QRCode = require("qrcode");
const path = require("path");
const twilio = require("twilio");
const axios = require("axios");

// Firebase init
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Twilio client
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "frontend")));

// CREATE PROFILE
app.post("/create-profile", async (req, res) => {
  try {
    const id = uuidv4();

    const profile = {
      id,
      uid: req.body.uid || "",
      fullName: req.body.fullName || "",
      age: req.body.age || "",
      bloodGroup: req.body.bloodGroup || "",
      allergies: req.body.allergies || "",
      diseases: req.body.diseases || "",
      medications: req.body.medications || "",
      insurance: req.body.insurance || "",
      address: req.body.address || "",
      contact1Name: req.body.contact1Name || "",
      contact1Phone: req.body.contact1Phone || "",
      contact2Name: req.body.contact2Name || "",
      contact2Phone: req.body.contact2Phone || "",
      contact3Name: req.body.contact3Name || "",
      contact3Phone: req.body.contact3Phone || "",
      reports: req.body.reports || [],
      createdAt: new Date().toISOString()
    };

    await db.collection("users").doc(id).set(profile);

    const link = `http://10.170.227.21:8080/emergency/${id}`;
    const qr = await QRCode.toDataURL(link);

    res.json({
      success: true,
      message: "Profile created successfully",
      id,
      qr,
      link
    });
  } catch (error) {
    console.error("CREATE PROFILE ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create profile",
      error: error.message
    });
  }
});

// BASIC PROFILE
app.get("/profile/:id", async (req, res) => {
  try {
    const doc = await db.collection("users").doc(req.params.id).get();

    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const user = doc.data();

    res.json({
      success: true,
      id: user.id,
      fullName: user.fullName,
      age: user.age,
      bloodGroup: user.bloodGroup,
      contact1Name: user.contact1Name,
      contact1Phone: user.contact1Phone
    });
  } catch (error) {
    console.error("BASIC PROFILE ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
      error: error.message
    });
  }
});

// FULL PROFILE
app.get("/profile-full/:id", async (req, res) => {
  try {
    const doc = await db.collection("users").doc(req.params.id).get();

    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      ...doc.data()
    });
  } catch (error) {
    console.error("FULL PROFILE ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch full medical profile",
      error: error.message
    });
  }
});

// SEND OTP
app.post("/send-otp", async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required"
      });
    }

    const verification = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verifications.create({
        to: phoneNumber,
        channel: "sms"
      });

    res.json({
      success: true,
      status: verification.status,
      message: "OTP sent successfully"
    });
  } catch (error) {
    console.error("SEND OTP ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send OTP",
      error: error.message
    });
  }
});

// VERIFY OTP
app.post("/verify-otp", async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;

    if (!phoneNumber || !otp) {
      return res.status(400).json({
        success: false,
        message: "Phone number and OTP are required"
      });
    }

    const verificationCheck = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verificationChecks.create({
        to: phoneNumber,
        code: otp
      });

    if (verificationCheck.status === "approved") {
      return res.json({
        success: true,
        status: "verified"
      });
    }

    return res.json({
      success: false,
      status: "failed"
    });
  } catch (error) {
    console.error("VERIFY OTP ERROR:", error);
    res.status(500).json({
      success: false,
      message: "OTP verification failed",
      error: error.message
    });
  }
});

// OCR EXTRACT TEXT
app.post("/extract-text", async (req, res) => {
  try {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: "Image URL is required"
      });
    }

    const response = await axios.post(
      "https://api.ocr.space/parse/image",
      new URLSearchParams({
        apikey: process.env.OCR_API_KEY,
        url: imageUrl,
        language: "eng"
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );

    const extractedText =
      response.data?.ParsedResults?.[0]?.ParsedText || "No text detected";

    res.json({
      success: true,
      text: extractedText
    });
  } catch (error) {
    console.error("OCR ERROR:", error?.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: "OCR extraction failed",
      error: error.message
    });
  }
});

// SCAN LOG
app.post("/scan-log", async (req, res) => {
  try {
    const { userId, location } = req.body;

    await db.collection("scanLogs").add({
      userId,
      location: location || "Unknown",
      scannedAt: new Date().toISOString()
    });

    res.json({
      success: true,
      message: "Scan logged"
    });
  } catch (error) {
    console.error("SCAN LOG ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to save scan log",
      error: error.message
    });
  }
});

// HOME
app.get("/", (req, res) => {
  res.send("HealSync backend running");
});

// START SERVER
app.listen(5000, "0.0.0.0", () => {
  console.log("HealSync backend running on port 5000");
});