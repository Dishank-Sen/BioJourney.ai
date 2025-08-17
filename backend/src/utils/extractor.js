import csv from "csv-parser";
import { Readable } from "stream";
import pdf from "pdf-parse";
import vision from "@google-cloud/vision";

// Google Vision Client
const visionClient = new vision.ImageAnnotatorClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

// CSV Extractor
export async function extractFromCSV(buffer) {
  return new Promise((resolve, reject) => {
    const rows = [];
    Readable.from(buffer.toString())
      .pipe(csv())
      .on("data", (row) => rows.push(row))
      .on("end", () => resolve(rows))
      .on("error", reject);
  });
}

// PDF Extractor
export async function extractFromPDF(buffer) {
  try {
    const data = await pdf(buffer);
    return data.text;
  } catch (err) {
    console.error("PDF extraction failed:", err);
    return "";
  }
}

// Image Extractor (using local file path)
export async function extractFromImage(filePath) {
  try {
    const [result] = await visionClient.textDetection(filePath);
    const detections = result.textAnnotations;
    return detections.length ? detections[0].description : "";
  } catch (err) {
    console.error("Image OCR failed:", err);
    return "";
  }
}
