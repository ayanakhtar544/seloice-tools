const fs = require('fs');
const path = require('path');

const toolsDir = path.join(__dirname, 'src', 'app', 'tools');
const toolDirs = fs.readdirSync(toolsDir).filter(f => fs.statSync(path.join(toolsDir, f)).isDirectory());

const recentToolsSection = `
        {/* Try Other Tools Section */}
        <div className="border-t border-white/10 pt-12 pb-8 mt-16 w-full">
          <div className="flex items-center justify-between mb-8">
             <h3 className="text-xl md:text-2xl font-black italic uppercase flex items-center gap-2">Try Other Tools</h3>
             <a href="/#tools" className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors">View All</a>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a href="/tools/video-compressor">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 hover:border-white/20 transition-all flex items-center gap-4 group">
                <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center text-orange-400 group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"/><rect x="2" y="6" width="14" height="12" rx="2"/></svg>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-200 group-hover:text-white transition-colors">Video Compressor</h4>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Free Tool</p>
                </div>
              </div>
            </a>
            <a href="/tools/auto-captions">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 hover:border-white/20 transition-all flex items-center gap-4 group">
                <div className="w-10 h-10 bg-cyan-500/20 rounded-xl flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 13h4"/><path d="M15 13h2"/><path d="M7 9h2"/><path d="M13 9h4"/><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-200 group-hover:text-white transition-colors">Auto Captions</h4>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Free Tool</p>
                </div>
              </div>
            </a>
            <a href="/tools/bg-remover">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 hover:border-white/20 transition-all flex items-center gap-4 group">
                <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-200 group-hover:text-white transition-colors">BG Remover</h4>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Free Tool</p>
                </div>
              </div>
            </a>
          </div>
        </div>
`;

for (const dir of toolDirs) {
  const pagePath = path.join(toolsDir, dir, 'page.tsx');
  if (fs.existsSync(pagePath)) {
    let content = fs.readFileSync(pagePath, 'utf8');

    // 1. Change min-h-screen to remove it so it fits in layout
    content = content.replace(/className="min-h-screen([^"]*)"/g, 'className="w-full $1"');
    content = content.replace(/className='min-h-screen([^']*)'/g, "className='w-full $1'");

    // 2. Inject Try Other Tools before the last two closing divs
    if (!content.includes('Try Other Tools Section')) {
      const lastDivIndex = content.lastIndexOf('</div>');
      if (lastDivIndex !== -1) {
        const secondLastDivIndex = content.lastIndexOf('</div>', lastDivIndex - 1);
        if (secondLastDivIndex !== -1) {
            content = content.slice(0, secondLastDivIndex) + recentToolsSection + content.slice(secondLastDivIndex);
        }
      }
    }
    
    // 3. Replace Back to Toolkit with Breadcrumbs
    const backBtnRegex = /<Link\s+href="\/"\s+className="inline-flex[^>]+>[\s\S]*?Back to Toolkit[\s\S]*?<\/Link>/g;
    
    // Helper to extract a title
    const titleMatch = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
    let title = dir.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    if (titleMatch) {
       title = titleMatch[1].replace(/<[^>]+>/g, '').trim();
    }

    const breadcrumb = `
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 mb-8 md:mb-12">
          <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">Home</Link>
          <span className="opacity-50">/</span>
          <Link href="/#tools" className="hover:text-white transition-colors">Tools</Link>
          <span className="opacity-50">/</span>
          <span className="text-white">${title}</span>
        </nav>
    `;

    if (backBtnRegex.test(content)) {
        content = content.replace(backBtnRegex, breadcrumb);
    } else if (!content.includes('Breadcrumb Navigation')) {
        // If not found, just insert after max-w-Xxl div or similar
        content = content.replace(/<div className="relative z-10 max-w-[^>]+>/, `$&` + breadcrumb);
    }

    fs.writeFileSync(pagePath, content);
    console.log(`Updated ${dir}`);
  }
}
