const mongoose = require("mongoose");

const ExtensionSchema = new mongoose.Schema({
  prompt: {
    type: String,
    required: true,
  },
  files: {
    type: Object, 
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Extension", ExtensionSchema);