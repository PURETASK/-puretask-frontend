// scripts/analyze-bundle.js
// Frontend bundle size analysis

const fs = require("fs");
const path = require("path");

/**
 * Analyze Next.js build output
 */
function analyzeBundle() {
  const nextBuildPath = path.join(__dirname, "../.next");
  
  if (!fs.existsSync(nextBuildPath)) {
    console.log("❌ .next folder not found. Run 'npm run build' first.");
    return;
  }

  // Analyze static chunks
  const staticPath = path.join(nextBuildPath, "static");
  if (fs.existsSync(staticPath)) {
    analyzeDirectory(staticPath, "Static Assets");
  }

  // Analyze server chunks
  const serverPath = path.join(nextBuildPath, "server");
  if (fs.existsSync(serverPath)) {
    analyzeDirectory(serverPath, "Server Chunks");
  }
}

function analyzeDirectory(dir, label) {
  const files = getAllFiles(dir);
  const sizes = files.map((file) => ({
    path: path.relative(dir, file),
    size: fs.statSync(file).size,
    sizeKB: (fs.statSync(file).size / 1024).toFixed(2),
    sizeMB: (fs.statSync(file).size / (1024 * 1024)).toFixed(2),
  }));

  sizes.sort((a, b) => b.size - a.size);

  console.log(`\n📦 ${label} Analysis\n`);
  console.log("=".repeat(80));
  console.log(`${"File".padEnd(50)} ${"Size".padStart(10)} ${"KB".padStart(10)} ${"MB".padStart(10)}`);
  console.log("=".repeat(80));

  let totalSize = 0;
  sizes.slice(0, 20).forEach((file) => {
    totalSize += file.size;
    console.log(
      `${file.path.padEnd(50)} ${file.size.toString().padStart(10)} ${file.sizeKB.padStart(10)} ${file.sizeMB.padStart(10)}`
    );
  });

  if (sizes.length > 20) {
    console.log(`... and ${sizes.length - 20} more files`);
  }

  console.log("=".repeat(80));
  console.log(
    `Total: ${totalSize.toString().padStart(10)} ${(totalSize / 1024).toFixed(2).padStart(10)} ${(totalSize / (1024 * 1024)).toFixed(2).padStart(10)}`
  );
  console.log("=".repeat(80));
}

function getAllFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllFiles(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  });

  return fileList;
}

// Run analysis
analyzeBundle();
