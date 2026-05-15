import { chromium } from 'playwright';

const BASE = process.env.BASE_URL || 'http://localhost:3010';

import { readdirSync } from 'fs';
import { join } from 'path';

const toolsDir = join(process.cwd(), 'src/app/tools');
const toolSlugs = readdirSync(toolsDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);

const paths = [
  '/',
  '/tools',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/blogs',
  ...toolSlugs.map((s) => `/tools/${s}`),
];

const IGNORE_PATTERNS = [
  /favicon/i,
  /Download the React DevTools/i,
  /\[Fast Refresh\]/i,
  /webpack/i,
  /HMR/i,
  /Failed to load resource.*404/i,
  /preloaded using link preload but not used/i,
  /googlesyndication\.com/i,
  /doubleclick\.net/i,
  /googleads/i,
  /adsbygoogle/i,
  /net::ERR_ABORTED/i,
  /\?_rsc=/i,
];

function shouldIgnore(text) {
  return IGNORE_PATTERNS.some((p) => p.test(text));
}

const browser = await chromium.launch();
const page = await browser.newPage();

const allIssues = [];

for (const path of paths) {
  const issues = [];
  const handler = (msg) => {
    const type = msg.type();
    if (type === 'error' || type === 'warning') {
      const text = msg.text();
      if (!shouldIgnore(text)) issues.push({ type, text });
    }
  };
  page.on('console', handler);
  page.on('pageerror', (err) => {
    if (!shouldIgnore(err.message)) issues.push({ type: 'pageerror', text: err.message });
  });
  page.on('requestfailed', (req) => {
    const failure = req.failure();
    const url = req.url();
    const text = `${failure?.errorText || 'failed'} ${url}`;
    if (!shouldIgnore(text) && !url.includes('_next/static')) {
      issues.push({ type: 'requestfailed', text });
    }
  });

  try {
    await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(2500);
    if (toolSlugs.some((s) => path === `/tools/${s}` && ['bg-remover','video-compressor','mp4-to-mp3','auto-captions'].includes(s))) {
      const launch = page.getByRole('button', { name: /launch|open/i });
      if (await launch.count()) {
        await launch.first().click({ timeout: 3000 }).catch(() => {});
        await page.waitForTimeout(2000);
      }
    }
  } catch (e) {
    issues.push({ type: 'navigation', text: String(e) });
  }

  page.off('console', handler);
  if (issues.length) allIssues.push({ path, issues });
  console.log(`${path}: ${issues.length} issue(s)`);
}

await browser.close();

if (allIssues.length) {
  console.log('\n=== CONSOLE ISSUES ===\n');
  console.log(JSON.stringify(allIssues, null, 2));
  process.exit(1);
}

console.log('\nAll audited routes: no console errors/warnings.');
