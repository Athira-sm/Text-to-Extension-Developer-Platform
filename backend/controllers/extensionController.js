const generateExtension = require("../services/geminiService");
const Extension = require("../models/Extension"); // if you want to save — optional

exports.generateExtensionController = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== "string" || prompt.trim().length < 5) {
      return res.status(400).json({ message: "Valid prompt is required" });
    }

    const aiResponse = await generateExtension(prompt.trim());

    // Aggressive cleaning — Gemini still sometimes adds junk
    let cleaned = aiResponse
      .trim()
      // Remove anything before first { and after last }
      .replace(/^[\s\S]*?(\{.*)$/, "$1")
      .replace(/(.*\})\s*[\s\S]*$/, "$1")
      // Remove common markdown fences
      .replace(/```json\s*/gi, "")
      .replace(/```[a-z]*\s*/gi, "")
      .replace(/`/g, "")
      // Remove possible leading/trailing quotes or partial JSON
      .replace(/^["']?/, "")
      .replace(/["']?$/, "")
      // Fix trailing commas (very common Gemini mistake)
      .replace(/,\s*([}\]])/g, "$1")
      .trim();

    // Final safety: make sure it starts and ends correctly
    if (!cleaned.startsWith("{")) cleaned = "{" + cleaned;
    if (!cleaned.endsWith("}")) cleaned += "}";

    let files;
    try {
      files = JSON.parse(cleaned);
    } catch (parseError) {
      console.error("JSON Parse failed. Raw AI response:", aiResponse);
      console.error("Cleaned version:", cleaned);
      return res.status(400).json({
        message: "AI did not return valid JSON",
        error: parseError.message,
        raw: aiResponse.substring(0, 800) + "...",
        cleanedAttempt: cleaned.substring(0, 800) + "...",
      });
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