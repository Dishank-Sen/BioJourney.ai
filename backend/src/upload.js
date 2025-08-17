import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import { extractFromCSV } from "./utils/extractor.js";
import { generateInsights } from "./utils/insightGenerator.js";

dotenv.config();
const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// POST /upload
router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const ext = req.file.originalname.split(".").pop().toLowerCase();
    if (ext !== "csv") {
      return res.status(400).json({ error: "Only CSV files are supported" });
    }

    // Extract data from CSV
    const extracted = await extractFromCSV(req.file.buffer);

    // Generate insights
    const insights = generateInsights({
      data: extracted,
      fileName: req.file.originalname,
    });

    // Upload raw file to Cloudinary
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "auto", folder: "biojourney_docs" },
      (error, result) => {
        if (error) return res.status(500).json({ error: "Cloudinary upload failed" });
        res.json({
          status: "success",
          url: result.secure_url,
          public_id: result.public_id,
          extracted,
          insights,
        });
      }
    );
    stream.end(req.file.buffer);

  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
