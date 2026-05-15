/**
 * Removes duplicate "Try Other Tools" footer blocks from tool client files.
 */
const fs = require('fs');
const path = require('path');

const toolsDir = path.join(__dirname, '../src/app/tools');

function stripTryOtherTools(content) {
  const marker = '{/* Try Other Tools Section */}';
  const idx = content.indexOf(marker);
  if (idx === -1) return content;

  const tagStart = content.indexOf('<', idx + marker.length);
  if (tagStart === -1) return content;

  let depth = 0;
  let i = tagStart;

  while (i < content.length) {
    const rest = content.slice(i);
    const motionOpen = rest.match(/^<motion\.div\b/);
    const divOpen = !motionOpen && rest.match(/^<div\b/);
    const motionClose = rest.match(/^<\/motion\.div>/);
    const divClose = !motionClose && rest.match(/^<\/div>/);

    if (motionOpen) {
      depth++;
      i += motionOpen[0].length;
      continue;
    }
    if (divOpen) {
      depth++;
      i += divOpen[0].length;
      continue;
    }
    if (motionClose || divClose) {
      depth--;
      i += (motionClose || divClose)[0].length;
      if (depth === 0) {
        const before = content.slice(0, idx).trimEnd();
        const after = content.slice(i).replace(/^\s*\n/, '\n');
        return before + '\n' + after;
      }
      continue;
    }
    i++;
  }

  return content;
}

let n = 0;

for (const slug of fs.readdirSync(toolsDir)) {
  const dir = path.join(toolsDir, slug);
  if (!fs.statSync(dir).isDirectory()) continue;

  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith('.tsx') || file === 'page.tsx' || file === 'layout.tsx') continue;
    const fp = path.join(dir, file);
    const original = fs.readFileSync(fp, 'utf8');
    const updated = stripTryOtherTools(original);
    if (updated !== original) {
      fs.writeFileSync(fp, updated);
      console.log('stripped', fp);
      n++;
    }
  }
}

console.log(`stripped ${n} files`);
