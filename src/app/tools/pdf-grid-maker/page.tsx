// File: src/app/tools/pdf-grid-maker/page.tsx
import PdfGridClient from './PdfGridClient';

export const metadata = {
  title: 'PDF Grid Maker — Combine Multiple Pages into One',
  description: 'Merge 2, 4, or more PDF pages onto a single sheet. Perfect for printing college notes or presentation slides to save paper.',
};

export default function PdfGridPage() {
  return <PdfGridClient />;
}