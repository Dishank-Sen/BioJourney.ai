import { PromptTemplate } from "@langchain/core/prompts";
import path from "path";
import fs from "fs"
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function promptTemplate(fileName, replacements){
    const filePath = path.join(__dirname, "../prompts", fileName);
    const content = fs.readFileSync(filePath, "utf8");

    const selectorTemplate = new PromptTemplate({
        template: content,
        inputVariables: replacements
    });
    
    return selectorTemplate;
}