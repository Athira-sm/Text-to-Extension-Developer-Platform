const express = require("express");
const router = express.Router();

const {
  generateExtensionController,
  getExtensions,
} = require("../controllers/extensionController");


router.post("/generate-extension", generateExtensionController);

router.get("/extensions", getExtensions);

module.exports = router;