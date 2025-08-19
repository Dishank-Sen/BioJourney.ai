import fs from "fs";
import pdf from "pdf-parse";
import dotenv from "dotenv";
import { z } from "zod";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Flexible schema
const MedicalReportSchema = z.object({
  patient: z.object({
    name: z.string().nullable().optional(),
    age: z.union([z.string(), z.number()]).nullable().optional(),
    sex: z.string().nullable().optional(),
    id: z.string().nullable().optional()
  }).nullable().optional(),

  report_metadata: z.object({
    report_title: z.string().nullable().optional(),
    date: z.string().nullable().optional(),
    physician: z.string().nullable().optional(),
    institution: z.string().nullable().optional()
  }).nullable().optional(),

  sections: z.array(
    z.object({
      section_name: z.string().nullable().optional(),
      observations: z.any().nullable().optional()
    })
  ).nullable().optional(),

  findings: z.array(z.string()).nullable().optional(),
  recommendations: z.array(z.string()).nullable().optional()
});

// Post-processing to normalize report
function normalizeReport(parsed) {
  const findings = parsed.findings || [];
  const recommendations = parsed.recommendations || [];
  const sections = [];

  for (const section of parsed.sections || []) {
    if (!section.section_name) continue;

    const name = section.section_name.toLowerCase();
    if (name.includes("finding")) {
      if (Array.isArray(section.observations)) {
        findings.push(...section.observations.map(String));
      } else if (section.observations) {
        findings.push(String(section.observations));
      }
    } else if (name.includes("recommend")) {
      if (Array.isArray(section.observations)) {
        recommendations.push(...section.observations.map(String));
      } else if (section.observations) {
        recommendations.push(String(section.observations));
      }
    } else {
      sections.push(section); // keep normal sections
    }
  }

  return {
    ...parsed,
    sections,
    findings,
    recommendations
  };
}

export default async function extractStructuredPDF(path) {
    console.log("file path:",path)
  const pdfBuffer = fs.readFileSync(path);
  const pdfData = await pdf(pdfBuffer);
  const text = pdfData.text.replace(/\n\s*\n/g, "\n").trim();

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
You are an AI medical report parser.

Extract structured medical information from the text.

Rules:
- Capture patient and metadata if present.
- Group related details into "sections".
- Each section should have section_name and observations.
- Observations can be structured objects when numeric values are present:
  Example blood pressure: { "type": "Blood Pressure", "systolic": 142, "diastolic": 87, "unit": "mmHg" }
  Example lab test: { "type": "Hemoglobin", "value": 13.2, "unit": "g/dL", "reference_range": "13.0 - 17.0" }
- If descriptive text only, keep it as a string.
- Use "findings" for interpretations.
- Use "recommendations" for advice.
- Missing values should be null or [].
- Return only valid JSON.

${text}
`;

  const result = await model.generateContent(prompt);

  let responseText = result.response.text().trim();
  if (responseText.startsWith("```")) {
    responseText = responseText.replace(/```(json)?/g, "").trim();
  }

  let parsedJson;
  try {
    parsedJson = JSON.parse(responseText);
  } catch (e) {
    console.error("❌ JSON parse failed. Raw response:");
    console.error(responseText);
    throw e;
  }

  const parsed = MedicalReportSchema.safeParse(parsedJson);
  if (!parsed.success) {
    console.error("❌ Schema validation failed:", parsed.error.format());
    throw new Error("Invalid AI response format");
  }

  // ✅ Apply normalization
  console.log(normalizeReport(parsed.data))
  return normalizeReport(parsed.data);
}