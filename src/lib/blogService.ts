// File: src/lib/blogService.ts
import { db } from './firebase';
import { collection, getDocs, getDoc, doc, query, where, orderBy, updateDoc, increment, limit } from 'firebase/firestore';

export interface FAQ {
  question: string;
  answer: string;
}

export interface Blog {
  id: string;
  title: string;
  metaTitle?: string;
  metaDescription?: string;
  slug: string;
  excerpt?: string;
  content: string;
  category: string;
  tags?: string[];
  faqs?: FAQ[];
  relatedTools?: string[];
  ogDescription?: string;
  author?: string;
  coverImage?: string;
  status?: string;
  views?: number;
  likes?: number;
  createdAt?: any; // Firestore timestamp
}

// 1. Fetch All Blogs (For Admin)
export async function getAllBlogsAdmin() {
  const q = query(collection(db, "blogs"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Blog[];
}

// 2. Fetch Published Blogs (For Public Website)
export async function getPublishedBlogs() {
  const q = query(collection(db, "blogs"), where("status", "==", "Published"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Blog[];
}

// 3. Fetch Single Blog by Slug
export async function getBlogBySlug(slug: string): Promise<Blog | null> {
  const q = query(collection(db, "blogs"), where("slug", "==", slug));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const docData = snapshot.docs[0];
  return { id: docData.id, ...docData.data() } as Blog;
}

// 4. Fetch Related Blogs
export async function getRelatedBlogs(category: string, currentBlogId: string, limitCount: number = 3) {
  const q = query(
    collection(db, "blogs"), 
    where("status", "==", "Published"),
    where("category", "==", category),
    limit(limitCount + 1) // Fetch one extra to filter out the current blog
  );
  const snapshot = await getDocs(q);
  const blogs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Blog[];
  return blogs.filter(b => b.id !== currentBlogId).slice(0, limitCount);
}

// 5. Increment View Count Real-time
export async function incrementBlogView(blogId: string) {
  const blogRef = doc(db, "blogs", blogId);
  await updateDoc(blogRef, {
    views: increment(1)
  });
}

// 6. Increment Like Count Real-time
export async function likeBlog(blogId: string) {
  const blogRef = doc(db, "blogs", blogId);
  await updateDoc(blogRef, {
    likes: increment(1)
  });
}