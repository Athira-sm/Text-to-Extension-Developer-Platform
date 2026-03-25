const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const systemPrompt = `
You are an expert Chrome Extension developer.

STRICT RULES:
- Output ONLY valid JSON
- No explanation
- No markdown
- Escape quotes properly using \\"
- Use \\n for new lines

FORMAT:
{
  "manifest.json": "...",
  "content.js": "...",
  "popup.html": "...",
  "popup.js": "..."
}

RULES:
- Manifest V3
- popup.html must not contain inline JS
- Use popup.js
`;

async function generateExtension(prompt) {
  const models = ["gemini-2.5-flash"];

  for (let modelName of models) {
    let attempts = 2;

    while (attempts > 0) {
      try {
        console.log(`Trying model: ${modelName}`);

        const model = genAI.getGenerativeModel({
          model: modelName,
        });

        const result = await model.generateContent(
          systemPrompt + "\nUser Request:\n" + prompt
        );

        const text = result.response.text();

        console.log("AI Success");

        return text;

      } catch (error) {
        console.error("Gemini Error:", error.message);

        if (error.message.includes("503") && attempts > 1) {
          console.log("Retrying...");
          await new Promise(res => setTimeout(res, 2000));
          attempts--;
        } else {
          break;
        }
      }
    }
  }

  // ✅ FINAL FALLBACK (100% SAFE)
  console.log("Using fallback response");

  return JSON.stringify({
    "manifest.json": JSON.stringify({
      manifest_version: 3,
      name: "Fallback Extension",
      version: "1.0",
      permissions: ["activeTab", "scripting"],
      action: { default_popup: "popup.html" }
    }),

    "content.js": "document.body.style.backgroundColor = 'red';",

    "popup.html": `
<!DOCTYPE html>
<html>
<head><title>Extension</title></head>
<body>
<button id="btn">Click</button>
<script src="popup.js"></script>
</body>
</html>
`.trim(),

    "popup.js": `
document.getElementById("btn").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      files: ["content.js"]
    });
  });
});
`.trim()
  });
}

module.exports = generateExtension;