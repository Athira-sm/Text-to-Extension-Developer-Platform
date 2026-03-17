const generateExtension = require("../services/geminiService");
const Extension = require("../models/Extension"); // if you want to save — optional

exports.generateExtensionController = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== "string" || prompt.trim().length < 5) {
      return res.status(400).json({ message: "Valid prompt is required" });
    }

    const aiResponse = await generateExtension(prompt.trim());

    let cleaned = aiResponse
      .trim()
      .replace(/^[\s\S]*?(\{.*)$/, "$1")
      .replace(/(.*\})\s*[\s\S]*$/, "$1")
      .replace(/```json\s*/gi, "")
      .replace(/```[a-z]*\s*/gi, "")
      .replace(/`/g, "")
      .replace(/^["']?/, "")
      .replace(/["']?$/, "")
      .replace(/,\s*([}\]])/g, "$1")
      .trim();

    if (!cleaned.startsWith("{")) cleaned = "{" + cleaned;
    if (!cleaned.endsWith("}")) cleaned += "}";

    let files;

    try {
      files = JSON.parse(cleaned);
    } catch (error) {
      return res.status(400).json({
        message: "AI did not return valid JSON",
        error: error.message,
      });
    }

    // REQUIRED FILE VALIDATION
    const requiredFiles = ["manifest.json", "content.js", "popup.html"];

    for (const file of requiredFiles) {
      if (!files[file]) {
        return res.status(400).json({
          message: `AI response missing required file: ${file}`,
        });
      }
    }

    res.json({
      success: true,
      files,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};