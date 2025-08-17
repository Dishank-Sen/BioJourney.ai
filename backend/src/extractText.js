import vision from "@google-cloud/vision";
import fs from "fs";

const client = new vision.ImageAnnotatorClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

export async function extractTextFromImage(fileUrl) {
  try {
    const [result] = await client.textDetection(fileUrl);
    const detections = result.textAnnotations;
    const text = detections.length > 0 ? detections[0].description : "";
    return text;
  } catch (err) {
    console.error("OCR Error:", err);
    return "";
  }
}
