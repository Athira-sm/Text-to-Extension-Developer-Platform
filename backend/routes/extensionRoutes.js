const express = require("express");
const router = express.Router();

const {
  generateExtensionController,
  getExtensions,
  updateExtension,
  downloadExistingExtension,
} = require("../controllers/extensionController");

// ✅ CORRECT ROUTES
router.post("/generate-extension", generateExtensionController);
router.get("/extensions", getExtensions);
router.put("/extension/:id", updateExtension);
router.get("/download/:id", downloadExistingExtension);

module.exports = router;