const fs = require('fs');
const path = require('path');

const oldDb = path.join(__dirname, 'src', 'data', 'blog-posts.json');
const newDb = path.join(__dirname, 'src', 'data', 'blog-db.json');

if (fs.existsSync(oldDb)) {
  const oldPosts = JSON.parse(fs.readFileSync(oldDb, 'utf8'));
  const newPosts = oldPosts.map((post, index) => {
    // Convert old block array to single markdown string
    const markdownContent = post.content ? post.content.map(block => {
      if (block.type === 'h2') return `## ${block.text}\n\n`;
      if (block.type === 'p') return `${block.text}\n\n`;
      return '';
    }).join('') : 'Start writing your SEO content here...';

    return {
      id: Date.now().toString() + index,
      title: post.title,
      slug: post.slug,
      description: post.description,
      content: markdownContent,
      status: 'published',
      author: post.author || 'Seloice Team',
      category: post.category || 'Guides',
      readTime: post.readTime || '5 min read',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      image: null
    };
  });
  
  fs.writeFileSync(newDb, JSON.stringify(newPosts, null, 2));
  console.log('Migrated old blog posts to new blog-db.json');
}
