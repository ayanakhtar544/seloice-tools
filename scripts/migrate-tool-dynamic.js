const fs = require('fs');
const path = require('path');

const toolsDir = path.join(__dirname, '../src/app/tools');

function slugToClientName(slug) {
  return slug.split('-').map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join('') + 'Client';
}

function slugToLabel(slug) {
  return slug.split('-').join(' ') + '…';
}

const pageTemplate = (clientName, label) => `import dynamic from 'next/dynamic';
import ToolLoadingSkeleton from '@/components/seo/ToolLoadingSkeleton';

const ${clientName} = dynamic(() => import('./${clientName}'), {
  ssr: false,
  loading: () => <ToolLoadingSkeleton label="Loading ${label}" />,
});

export default function Page() {
  return <${clientName} />;
}
`;

let migrated = 0;
let skipped = 0;

for (const slug of fs.readdirSync(toolsDir)) {
  const dir = path.join(toolsDir, slug);
  if (!fs.statSync(dir).isDirectory()) continue;

  const pagePath = path.join(dir, 'page.tsx');
  if (!fs.existsSync(pagePath)) continue;

  const pageContent = fs.readFileSync(pagePath, 'utf8');
  const clientName = slugToClientName(slug);
  const clientPath = path.join(dir, `${clientName}.tsx`);

  if (pageContent.includes('dynamic(() => import') && !pageContent.includes('"use client"')) {
    skipped++;
    continue;
  }

  if (fs.existsSync(clientPath) && pageContent.includes(`import('./${clientName}')`)) {
    skipped++;
    continue;
  }

  if (!pageContent.includes('"use client"')) {
    skipped++;
    continue;
  }

  if (!fs.existsSync(clientPath)) {
    let clientContent = pageContent;
    const exportMatch = clientContent.match(/export default function (\w+)/);
    if (exportMatch) {
      clientContent = clientContent.replace(
        `export default function ${exportMatch[1]}`,
        `export default function ${clientName}`
      );
    }
    fs.writeFileSync(clientPath, clientContent);
  }

  fs.writeFileSync(pagePath, pageTemplate(clientName, slugToLabel(slug)));
  console.log('migrated', slug);
  migrated++;
}

console.log(`Done. migrated=${migrated} skipped=${skipped}`);
