const sanitize = require("sanitize-filename");

function sanitizeFiles(files) {
  const cleanFiles = {};

  for (let filename in files) {
    const safeName = sanitize(filename);

    let content = files[filename];

    // 🚫 block dangerous code
    if (
      content.includes("eval(") ||
      content.includes("child_process") ||
      content.includes("fs.unlink") ||
      content.includes("rm -rf")
    ) {
      content = "// unsafe code removed";
    }

    cleanFiles[safeName] = content;
  }

  return cleanFiles;
}

module.exports = sanitizeFiles;