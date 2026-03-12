const express = require("express");
const router = express.Router();
const { generateExtensionController } = require("../controllers/extensionController");

router.post("/generate-extension", generateExtensionController);

module.exports = router;