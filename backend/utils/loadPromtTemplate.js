import fs from "fs"
import path from "path";
import { fileURLToPath } from "url";

// Get the absolute path of the current file
const __filename = fileURLToPath(import.meta.url);

// Get the directory of the current file
const __dirname = path.dirname(__filename);

export default function loadPromptTemplate(fileName, replacements) {
  const filePath = path.join(__dirname, "../prompts", fileName);
  let template = fs.readFileSync(filePath, "utf8");

  for (const key in replacements) {
    const regex = new RegExp(`{{${key}}}`, "g");
    template = template.replace(regex, replacements[key]);
  }

  return template;
}