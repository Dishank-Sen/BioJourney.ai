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

// DELETE /delete/:id
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  console.log(`[LOG] Received request to delete file with public_id: ${id}`);

  try {
    console.log(`[LOG] Calling Cloudinary to destroy file: ${id}`);
    
    // ✅ FIX: Removed the invalid { resource_type: "auto" } option.
    // The destroy function defaults to "image", which is correct for your PDFs.
    const result = await cloudinary.uploader.destroy(id);
    
    console.log(`[LOG] Successfully deleted file: ${id} from Cloudinary. Result:`, result);
    
    res.json({ status: "deleted", id });
  } catch (err) {
    console.error(`[ERROR] Cloudinary delete error for public_id: ${id}`, err);
    res.status(500).json({ error: "Failed to delete file" });
  }
});

export default router;