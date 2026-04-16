const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const systemPrompt = `
You are an expert Chrome Extension developer.

STRICT RULES:
- Output ONLY valid JSON
- No explanation
- No markdown
- Escape quotes properly using \\\"
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
- Always generate WORKING JavaScript

IMPORTANT LOGIC:
- If user asks to remove images:
  Use this exact logic in content.js:
  document.querySelectorAll("img").forEach(img => img.remove());

- If user asks to replace images:
  Replace each <img> with a colored box

- content.js must contain DOM manipulation based on user request
`;

async function generateExtension(prompt) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const result = await model.generateContent(
      systemPrompt + "\nUser Request:\n" + prompt
    );

    return result.response.text();

  } catch (error) {
    console.error("AI Error:", error.message);

    // 🔥 Improved fallback (REMOVE IMAGES)
    return JSON.stringify({
      "manifest.json": JSON.stringify({
        manifest_version: 3,
        name: "Image Remover",
        version: "1.0",
        permissions: ["activeTab", "scripting"],
        action: { default_popup: "popup.html" }
      }),

      "content.js": `
document.querySelectorAll("img").forEach(img => {
  img.remove();
});
`.trim(),

      "popup.html": `
<!DOCTYPE html>
<html>
<head><title>Image Remover</title></head>
<body>
<button id="btn">Remove Images</button>
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
}

module.exports = generateExtension;