const express = require("express");
const router = express.Router();

const {
  generateExtensionController,
  getExtensions,
  updateExtension,
  downloadExistingExtension,
  deleteExtension,
} = require("../controllers/extensionController");

const checkSubscription = require("../middleware/subscription");


router.post("/generate-extension", checkSubscription, generateExtensionController);

router.get("/extensions", getExtensions);
router.put("/extension/:id", updateExtension);
router.get("/download/:id", downloadExistingExtension);
router.delete("/extension/:id", deleteExtension);
module.exports = router;