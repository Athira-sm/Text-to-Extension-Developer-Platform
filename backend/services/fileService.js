const fs = require("fs");
const path = require("path");
const archiver = require("archiver");

async function createExtensionZip(files) {
  const tempDir = path.join(__dirname, "../tmp");

  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }

  const folderName = `extension_${Date.now()}`;
  const extensionDir = path.join(tempDir, folderName);

  fs.mkdirSync(extensionDir);

  // WRITE FILES (WITH SUBFOLDER SUPPORT)
  for (const filename in files) {
    const filePath = path.join(extensionDir, filename);

    // CREATE SUBFOLDERS IF NEEDED
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(filePath, files[filename]);
  }

  const zipPath = path.join(tempDir, `${folderName}.zip`);

  const output = fs.createWriteStream(zipPath);
  const archive = archiver("zip", { zlib: { level: 9 } });

  archive.pipe(output);
  archive.directory(extensionDir, false);

  await archive.finalize();

  return zipPath;
}

module.exports = createExtensionZip;