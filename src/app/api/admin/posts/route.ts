import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'src', 'data', 'blog-db.json');

// Initialize DB if not exists
if (!fs.existsSync(DB_PATH)) {
  fs.writeFileSync(DB_PATH, JSON.stringify([], null, 2));
}

const getPosts = () => JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
const savePosts = (posts: any) => fs.writeFileSync(DB_PATH, JSON.stringify(posts, null, 2));

export async function GET() {
  try {
    const posts = getPosts();
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const posts = getPosts();
    
    const newPost = {
      id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    posts.push(newPost);
    savePosts(posts);
    
    return NextResponse.json(newPost);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const posts = getPosts();
    
    const index = posts.findIndex((p: any) => p.id === body.id);
    if (index === -1) return NextResponse.json({ error: 'Post not found' }, { status: 404 });

    posts[index] = {
      ...posts[index],
      ...body,
      updatedAt: new Date().toISOString(),
    };
    
    savePosts(posts);
    return NextResponse.json(posts[index]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    const posts = getPosts();
    const filtered = posts.filter((p: any) => p.id !== id);
    savePosts(filtered);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
