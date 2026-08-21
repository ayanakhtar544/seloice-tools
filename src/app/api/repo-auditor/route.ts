// File: src/app/api/repo-auditor/route.ts
import { NextResponse } from 'next/server';

const IGNORE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif', '.ico', '.svg', '.mp4', '.webm', '.ttf', '.woff', '.woff2', '.pdf', '.zip', '.tar', '.gz'];
const IGNORE_PATHS = ['node_modules/', 'dist/', 'build/', '.git/', '.next/', 'package-lock.json', 'yarn.lock'];

export async function POST(req: Request) {
  try {
    // 🔥 Frontend se ab userToken bhi aayega
    const { repoUrl, userToken } = await req.json();

    if (!repoUrl || !repoUrl.includes('github.com')) {
      return NextResponse.json({ error: 'Valid GitHub URL is required' }, { status: 400 });
    }

    console.log(`[AUDITOR] Starting audit for: ${repoUrl}`);

    const urlParts = repoUrl.replace('https://github.com/', '').replace(/\/$/, '').split('/');
    const owner = urlParts[0];
    const repo = urlParts[1];

    if (!owner || !repo) {
      return NextResponse.json({ error: 'Invalid repository format' }, { status: 400 });
    }

    const headers: any = {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Seloice-Repo-Auditor'
    };
    
    // 🔥 Agar user ne token diya hai toh wo use karo, warna server ka fallback
    if (userToken) {
        headers['Authorization'] = `token ${userToken}`;
    } else if (process.env.GITHUB_TOKEN) {
        headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
    }

    const repoInfoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });
    
    if (!repoInfoRes.ok) {
      if (repoInfoRes.status === 404) {
        throw new Error('Repository not found. If it is private, please provide a GitHub API Key.');
      } else if (repoInfoRes.status === 403) {
        throw new Error('GitHub API rate limit exceeded. Please provide an API Key to continue.');
      }
      throw new Error(`GitHub API Error: ${repoInfoRes.statusText}`);
    }
    
    const repoInfo = await repoInfoRes.json();
    const defaultBranch = repoInfo.default_branch;

    const treeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`, { headers });
    if (!treeRes.ok) throw new Error('Failed to fetch repository tree structure.');
    const treeData = await treeRes.json();

    const validFiles = treeData.tree.filter((item: any) => {
      if (item.type !== 'blob') return false; 
      const isIgnoredPath = IGNORE_PATHS.some(ignore => item.path.includes(ignore));
      if (isIgnoredPath) return false;
      const isIgnoredExt = IGNORE_EXTENSIONS.some(ext => item.path.toLowerCase().endsWith(ext));
      if (isIgnoredExt) return false;
      return true;
    });

    let compiledResult = `# Repository: ${owner}/${repo}\n\n`;
    compiledResult += `## 📂 Directory Structure\n\`\`\`\n`;
    validFiles.forEach((file: any) => {
      compiledResult += `- ${file.path}\n`;
    });
    compiledResult += `\`\`\`\n\n`;
    compiledResult += `## 📄 File Contents\n\n`;

    const MAX_FILES = 50; 
    const filesToFetch = validFiles.slice(0, MAX_FILES);

    for (const file of filesToFetch) {
      // Raw fetch ko bhi API through route karte hain taaki private files fetch ho sakein
      const fileRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${file.path}?ref=${defaultBranch}`, { headers });
      
      if (fileRes.ok) {
        const fileData = await fileRes.json();
        if (fileData.content) {
            // GitHub base64 me bhejta hai, usko decode karna hoga
            const content = Buffer.from(fileData.content, 'base64').toString('utf-8');
            compiledResult += `### Path: \`${file.path}\`\n\`\`\`\n${content}\n\`\`\`\n\n`;
        }
      }
    }

    if (validFiles.length > MAX_FILES) {
        compiledResult += `\n> ⚠️ Note: Repository is too large. Only the first ${MAX_FILES} files were processed to prevent token overflow.\n`;
    }

    console.log('[AUDITOR] Successfully compiled repo context!');

    return NextResponse.json({ success: true, result: compiledResult });

  } catch (error: any) {
    console.error('[AUDITOR ERROR]', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}