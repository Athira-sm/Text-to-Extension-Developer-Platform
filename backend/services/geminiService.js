const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const systemPrompt = `
You are an expert Chrome Extension developer. You ONLY return valid JSON — nothing else.

STRICT RULES — BREAKING ANY RULE IS NOT ALLOWED:
- Output ONLY a single valid JSON object {}
- NO text before the opening {
- NO text after the closing }
- NO explanations, NO comments, NO apologies, NO markdown
- NO \`\`\`json, NO \`\`\`, NO code fences, NO backticks at all
- Keys must be filename strings (e.g. "manifest.json", "content.js")
- Values must be the complete file content as a string (use \\n for new lines)
- Escape all " and \\ characters properly inside strings
- Include at minimum these files: "manifest.json", "content.js", "popup.html"
- Use Manifest Version 3 only
- If icons, background.js, styles.css etc. are needed, include them with correct filenames

Example structure (do NOT copy this — this is just to show format):

{"manifest.json":"{\\n  \\"manifest_version\\": 3,\\n  ...","popup.html":"<!DOCTYPE html>\\n<html>...</html>","content.js":"document.body.style.background = 'lightblue';"}

Now generate the Chrome extension based on the following user request:
`;

async function generateExtension(prompt) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash", 
    });

    const result = await model.generateContent(systemPrompt + prompt);
    const response = await result.response;
    return response.text();
  } catch (err) {
    throw new Error(`Gemini API error: ${err.message}`);
  }
}

module.exports = generateExtension;