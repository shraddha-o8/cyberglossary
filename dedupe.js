const fs = require('fs');
const path = require('path');

// Target root folder containing your nested JSON folders
const rootDataFolder = path.join(__dirname, 'data');

const seenTerms = new Set();
let totalDuplicatesFound = 0;

// Function to recursively scan all subfolders
function processFolder(folderPath) {
  const items = fs.readdirSync(folderPath);

  items.forEach(item => {
    const fullPath = path.join(folderPath, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // If it's a subfolder (like 'cybersecurity'), scan inside it
      processFolder(fullPath);
    } else if (fileIsJson(fullPath)) {
      cleanJsonFile(fullPath);
    }
  });
}

function fileIsJson(filePath) {
  return filePath.endsWith('.json');
}

function cleanJsonFile(filePath) {
  const relativePath = path.relative(__dirname, filePath);
  const rawData = fs.readFileSync(filePath, 'utf8');

  let terms;
  try {
    terms = JSON.parse(rawData);
  } catch (err) {
    console.error(`❌ Could not parse JSON: ${relativePath}`);
    return;
  }

  if (!Array.isArray(terms)) return;

  const initialCount = terms.length;

  // Filter out duplicate terms
  const uniqueTerms = terms.filter(entry => {
    if (!entry || !entry.term) return false;

    // Normalize term (lowercase + trim whitespace)
    const normalized = entry.term.toLowerCase().trim();

    if (seenTerms.has(normalized)) {
      console.warn(`[Duplicate Removed] "${entry.term}" from ${relativePath}`);
      totalDuplicatesFound++;
      return false; // Remove item
    }

    seenTerms.add(normalized);
    return true; // Keep item
  });

  // Overwrite the file if duplicates were found
  if (uniqueTerms.length < initialCount) {
    fs.writeFileSync(filePath, JSON.stringify(uniqueTerms, null, 2), 'utf8');
    console.log(`✅ Saved cleaned file: ${relativePath} (${initialCount - uniqueTerms.length} removed)\n`);
  }
}

console.log(`Scanning directory tree starting at: ${rootDataFolder}\n`);

if (fs.existsSync(rootDataFolder)) {
  processFolder(rootDataFolder);
  console.log(`🎉 Cleanup complete! Total duplicates removed: ${totalDuplicatesFound}`);
} else {
  console.error(`❌ Folder not found: ${rootDataFolder}`);
}
