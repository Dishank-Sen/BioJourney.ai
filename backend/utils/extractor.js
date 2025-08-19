import csv from "csv-parser";
import { Readable } from "stream";

// ---------------- CSV Extractor ----------------
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