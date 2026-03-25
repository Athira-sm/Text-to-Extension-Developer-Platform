const mongoose = require("mongoose");

const ExtensionSchema = new mongoose.Schema({
  prompt: String,
  files: Object,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Extension", ExtensionSchema);