const fs = require("fs");
const path = require("path");
const archiver = require("archiver");

async function createExtensionZip(files) {
  return new Promise((resolve, reject) => {
    const tempDir = path.join(__dirname, "../tmp");

    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

    const folderName = `ext_${Date.now()}`;
    const extensionDir = path.join(tempDir, folderName);

    fs.mkdirSync(extensionDir);

    for (const filename in files) {
      const filePath = path.join(extensionDir, filename);

      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      fs.writeFileSync(filePath, files[filename]);
    }

    const zipPath = path.join(tempDir, `${folderName}.zip`);

    const output = fs.createWriteStream(zipPath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    output.on("close", () => {
      fs.rmSync(extensionDir, { recursive: true, force: true });
      resolve(zipPath);
    });

    archive.on("error", (err) => reject(err));

    archive.pipe(output);
   archive.directory(extensionDir, folderName);
    archive.finalize();
  });
}

module.exports = createExtensionZip;