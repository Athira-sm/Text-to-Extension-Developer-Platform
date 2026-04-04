const generateExtension = require("../services/geminiService");
const Extension = require("../models/Extension");
const createExtensionZip = require("../services/fileService");
const sanitizeFiles = require("../utils/sanitize");
const fs = require("fs");

function cleanJSON(aiResponse) {
  return aiResponse.replace(/```json|```/g, "").trim();
}


const generateExtensionController = async (req, res) => {
  try {
    const { prompt } = req.body;

    const aiResponse = await generateExtension(prompt);
    let files = sanitizeFiles(JSON.parse(cleanJSON(aiResponse)));

    await Extension.create({ prompt, files });

    const zipPath = await createExtensionZip(files);

    res.download(zipPath, "extension.zip", () => {
      fs.unlink(zipPath, () => {});
    });

  } catch {
    res.status(500).json({ message: "Error" });
  }
};


const getExtensions = async (req, res) => {
  const data = await Extension.find().sort({ createdAt: -1 });
  res.json({ success: true, data });
};

const updateExtension = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPrompt } = req.body;

    const aiResponse = await generateExtension(newPrompt);
    let files = sanitizeFiles(JSON.parse(cleanJSON(aiResponse)));

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


const downloadExistingExtension = async (req, res) => {
  try {
    const { id } = req.params;

    const ext = await Extension.findById(id);
    if (!ext) return res.status(404).json({ message: "Not found" });

    const zipPath = await createExtensionZip(ext.files);

    res.download(zipPath, "extension.zip", () => {
      fs.unlink(zipPath, () => {});
    });

  } catch {
    res.status(500).json({ message: "Download failed" });
  }
};
const deleteExtension = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Extension.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json({ success: true, message: "Deleted successfully" });

  } catch {
    res.status(500).json({ message: "Delete failed" });
  }
};

module.exports = {
  generateExtensionController,
  getExtensions,
  updateExtension,
  downloadExistingExtension,
  deleteExtension,
};