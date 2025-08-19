import express from "express";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GET /files → list uploaded files
router.get("/", async (req, res) => {
  try {
    const result = await cloudinary.search
      .expression("folder:biojourney_docs")
      .sort_by("created_at", "desc")
      .max_results(30)
      .execute();

    res.json(result.resources.map(file => ({
      url: file.secure_url,
      public_id: file.public_id,
    })));
  } catch (err) {
    console.error("Get files error:", err);
    res.status(500).json({ error: "Failed to fetch images" });
  }
});

export default router;