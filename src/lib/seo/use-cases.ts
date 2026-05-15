import fs from 'fs';
import path from 'path';

export interface UseCasePage {
  slug: string;
  title: string;
  description: string;
  h1: string;
  platform: string;
  primaryTool: string;
  relatedTools: string[];
  faqs: { question: string; answer: string }[];
}

const DATA_PATH = path.join(process.cwd(), 'src', 'data', 'use-cases.json');
const GENERATED_DATA_PATH = path.join(process.cwd(), 'src', 'data', 'use-cases-generated.json');

export function getAllUseCases(): UseCasePage[] {
  let useCases: UseCasePage[] = [];
  
  if (fs.existsSync(DATA_PATH)) {
    try {
      const manual = JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8')) as UseCasePage[];
      useCases = useCases.concat(manual);
    } catch (e) {
      // ignore
    }
  }

  if (fs.existsSync(GENERATED_DATA_PATH)) {
    try {
      const generated = JSON.parse(fs.readFileSync(GENERATED_DATA_PATH, 'utf-8')) as UseCasePage[];
      useCases = useCases.concat(generated);
    } catch (e) {
      // ignore
    }
  }

  return useCases;
}

export function getUseCaseBySlug(slug: string): UseCasePage | undefined {
  return getAllUseCases().find((p) => p.slug === slug);
}

export function getUseCaseSlugs(): string[] {
  return getAllUseCases().map((p) => p.slug);
}
