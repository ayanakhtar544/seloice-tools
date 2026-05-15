/**
 * Removes duplicate "Try Other Tools" footer blocks and back-navigation chrome
 * from tool client files (layout already provides header + related links).
 */
const fs = require('fs');
const path = require('path');

const toolsDir = path.join(__dirname, '../src/app/tools');

function cleanupFile(filePath) {
  let c = fs.readFileSync(filePath, 'utf8');
  const original = c;

  // Remove "Try Other Tools" section blocks (multiline)
  c = c.replace(
    /\{\/\* Try Other Tools Section \*\/\}[\s\S]*?<\/motionless>\s*\n\s*<\/motionless>\s*\n\s*<\/motionless>/g,
    ''
  );
  c = c.replace(
    /\{\/\* Try Other Tools Section \*\/\}[\s\S]*?<\/div>\s*\n\s*<\/motionless>\s*\n\s*<\/motionless>/g,
    ''
  );
  // Simpler: from Try Other Tools comment to closing of grid section before final divs
  c = c.replace(
    /\s*\{\/\* Try Other Tools Section \*\/\}[\s\S]*?grid grid-cols-1 md:grid-cols-3 gap-4[\s\S]*?<\/div>\s*\n\s*<\/div>\s*\n/g,
    '\n'
  );
  c = c.replace(
    /\s*\{\/\* Try Other Tools Section \*\/\}[\s\S]*?grid grid-cols-1 md:grid-cols-3 gap-4[\s\S]*?<\/div>\s*\n\s*<\/div>\s*$/m,
    '\n'
  );

  // Remove standalone Try Other Tools heading sections
  c = c.replace(
    /<div className="border-t border-white\/10 pt-12 pb-8 mt-16 w-full">[\s\S]*?Try Other Tools[\s\S]*?<\/motionless>\s*\n\s*<\/motionless>/g,
    ''
  );
  c = c.replace(
    /<motionless className="border-t border-white\/10 pt-12 pb-8 mt-16 w-full">[\s\S]*?Try Other Tools[\s\S]*?<\/motionless>\s*\n\s*<\/motionless>/g,
    ''
  );

  // Fix motionless if introduced
  c = c.replace(/motionless/g, 'motionless');

  if (c !== original) {
    fs.writeFileSync(filePath, c);
    return true;
  }
  return false;
}

let count = 0;
for (const slug of fs.readdirSync(toolsDir)) {
  const dir = path.join(toolsDir, slug);
  if (!fs.statSync(dir).isDirectory()) continue;
  for (const f of fs.readdirSync(dir)) {
    if (f.endsWith('Client.tsx') || (f === 'page.tsx' && fs.readFileSync(path.join(dir, f), 'utf8').includes('"use client"'))) {
      const fp = path.join(dir, f);
      if (cleanupFile(fp)) {
        console.log('cleaned', fp);
        count++;
      }
    }
  }
}

console.log(`cleaned ${count} files`);
