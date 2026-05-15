/**
 * Removes duplicate back-link + hero blocks from tool *Client.tsx files.
 * ToolPageHeader in tools/layout.tsx already provides H1 + breadcrumbs.
 */
const fs = require('fs');
const path = require('path');

const toolsDir = path.join(__dirname, '../src/app/tools');

function stripChrome(content) {
  let c = content;
  const original = c;

  // Back to Tools link block (Link wrapping ArrowLeft)
  c = c.replace(
    /\s*<Link href="\/" className="inline-flex items-center gap-2[^"]*"[^>]*>[\s\S]*?Back to Tools[\s\S]*?<\/Link>\s*/g,
    '\n',
  );

  // Hero section comment + following motion.div with h2 (up to closing motion.div)
  c = c.replace(
    /\s*\{\/\* Hero Section \*\/\}\s*<motion\.div[^>]*>[\s\S]*?<\/motion\.div>\s*/g,
    '\n',
  );

  return c === original ? null : c;
}

let n = 0;
for (const slug of fs.readdirSync(toolsDir)) {
  const dir = path.join(toolsDir, slug);
  if (!fs.statSync(dir).isDirectory()) continue;
  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith('Client.tsx')) continue;
    const fp = path.join(dir, file);
    const updated = stripChrome(fs.readFileSync(fp, 'utf8'));
    if (updated) {
      fs.writeFileSync(fp, updated);
      console.log('cleaned', fp);
      n++;
    }
  }
}
console.log(`cleaned ${n} files`);
