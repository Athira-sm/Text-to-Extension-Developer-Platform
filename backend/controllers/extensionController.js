const generateExtension = require("../services/geminiService");
const Extension = require("../models/Extension");
const createExtensionZip = require("../services/fileService");

// CLEAN JSON
function cleanJSON(aiResponse) {
  let cleaned = aiResponse
    .trim()
    .replace(/^[\s\S]*?(\{.*)$/, "$1")
    .replace(/(.*\})\s*[\s\S]*$/, "$1")
    .replace(/```json\s*/gi, "")
    .replace(/```/g, "")
    .replace(/,\s*([}\]])/g, "$1")
    .trim();

  if (!cleaned.startsWith("{")) cleaned = "{" + cleaned;
  if (!cleaned.endsWith("}")) cleaned += "}";

  return cleaned;
}

// ================= GENERATE =================
const generateExtensionController = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || prompt.length < 5) {
      return res.status(400).json({ message: "Invalid prompt" });
    }

    const aiResponse = await generateExtension(prompt);

    let cleaned = cleanJSON(aiResponse);

    let files;

    try {
      files = JSON.parse(cleaned);
    } catch (err) {
      console.error("JSON Error → Using fallback");

      // ✅ FINAL SAFETY FALLBACK
      files = {
        "manifest.json": JSON.stringify({
          manifest_version: 3,
          name: "Safe Extension",
          version: "1.0",
          permissions: ["activeTab", "scripting"],
          action: { default_popup: "popup.html" }
        }),

        "content.js": "document.body.style.backgroundColor = 'red';",

        "popup.html": `
<!DOCTYPE html>
<html>
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
      };
    }

    await Extension.create({ prompt, files });

    const zipPath = await createExtensionZip(files);

    res.download(zipPath, "extension.zip");

  } catch (error) {
    console.error("FINAL ERROR:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= GET =================
const getExtensions = async (req, res) => {
  const data = await Extension.find().sort({ createdAt: -1 });
  res.json({ success: true, data });
};

// ================= UPDATE =================
const updateExtension = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPrompt } = req.body;

    const aiResponse = await generateExtension(newPrompt);
    const cleaned = cleanJSON(aiResponse);

    const files = JSON.parse(cleaned);

    const updated = await Extension.findByIdAndUpdate(
      id,
      { prompt: newPrompt, files },
      { new: true }
    );

    res.json({ success: true, data: updated });

  } catch {
    res.status(500).json({ message: "Update failed" });
  }
};

// ================= DOWNLOAD =================
const downloadExistingExtension = async (req, res) => {
  try {
    const { id } = req.params;

    const ext = await Extension.findById(id);

    if (!ext) return res.status(404).json({ message: "Not found" });

    const zipPath = await createExtensionZip(ext.files);

    res.download(zipPath, "extension.zip");

  } catch {
    res.status(500).json({ message: "Download failed" });
  }
};

module.exports = {
  generateExtensionController,
  getExtensions,
  updateExtension,
  downloadExistingExtension,
};