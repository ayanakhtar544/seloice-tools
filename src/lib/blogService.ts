// File: src/lib/blogService.ts
import { db } from './firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

// 🚀 SMART PARSER (Now 100% Client-Component Safe - No Functions inside!)
const parseFirestoreValue = (val: any): any => {
  if (!val) return null;
  if (val.stringValue !== undefined) return val.stringValue;
  if (val.integerValue !== undefined) return Number(val.integerValue);
  if (val.doubleValue !== undefined) return Number(val.doubleValue);
  if (val.booleanValue !== undefined) return val.booleanValue;
  
  // 🔥 THE FIX: Function ki jagah directly string return kar rahe hain
  if (val.timestampValue !== undefined) return val.timestampValue; 
  
  if (val.arrayValue !== undefined) {
    return val.arrayValue.values ? val.arrayValue.values.map((v: any) => parseFirestoreValue(v)) : [];
  }
  
  if (val.mapValue !== undefined) {
    const res: any = {};
    for (const [k, v] of Object.entries(val.mapValue.fields || {})) {
      res[k] = parseFirestoreValue(v);
    }
    return res;
  }
  
  return null;
};

const parseFirestoreDocument = (doc: any) => {
  if (!doc || !doc.fields) return null;
  const parsed: any = { id: doc.name.split('/').pop() };
  
  for (const [key, value] of Object.entries(doc.fields)) {
    parsed[key] = parseFirestoreValue(value);
  }
  return parsed;
};

// ... BAKI KA CODE SAME RAHEGA (getBlogBySlug aur getAllBlogsAdmin) ...
// 🚀 Direct REST API Fetch (SSR gRPC bypass)
export async function getBlogBySlug(slug: string) {
  try {
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents:runQuery`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        structuredQuery: {
          from: [{ collectionId: 'blogs' }],
          where: {
            fieldFilter: { field: { fieldPath: 'slug' }, op: 'EQUAL', value: { stringValue: slug } }
          },
          limit: 1
        }
      }),
      cache: 'no-store'
    });

    const data = await response.json();
    
    if (!data || !data[0] || !data[0].document) {
      return null;
    }

    return parseFirestoreDocument(data[0].document);
  } catch (error) {
    console.error("[CRITICAL ERROR] REST API Fetch Failed:", error);
    return null;
  }
}

export async function getAllBlogsAdmin() {
  try {
    const blogsRef = collection(db, 'blogs');
    const snapshot = await getDocs(blogsRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) { 
    console.error("Fetch Error:", error);
    return []; 
  }
}

export async function getPublishedBlogs() {
  try {
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents:runQuery`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        structuredQuery: {
          from: [{ collectionId: 'blogs' }],
          where: {
            fieldFilter: { field: { fieldPath: 'status' }, op: 'EQUAL', value: { stringValue: 'Published' } }
          },
          orderBy: [{ field: { fieldPath: 'createdAt' }, direction: 'DESCENDING' }]
        }
      }),
      cache: 'no-store'
    });

    const data = await response.json();
    
    if (!data || !Array.isArray(data)) return [];

    return data
      .filter(item => item.document)
      .map(item => parseFirestoreDocument(item.document));
  } catch (error) {
    console.error("[ERROR] Published Blogs Fetch Failed:", error);
    return [];
  }
}