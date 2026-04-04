const sanitize = require("sanitize-filename");

function sanitizeFiles(files) {
  const cleanFiles = {};

  for (let filename in files) {
    const safeName = sanitize(filename);
    let content = files[filename];

    if (
      content.includes("eval(") ||
      content.includes("child_process") ||
      content.includes("fs.unlink") ||
      content.includes("rm -rf")
    ) {
      content = "// unsafe code removed";
    }

    if (safeName === "manifest.json") {
      try {
        let json = JSON.parse(content);

       
        delete json.icons;

        content = JSON.stringify(json, null, 2);
      } catch {}
    }

    cleanFiles[safeName] = content;
  }

  return cleanFiles;
}

module.exports = sanitizeFiles;