import { Metadata } from 'next';
import FacelessMakerClient from './FacelessMakerClient';

export const metadata: Metadata = {
  title: 'Faceless Video Generator | Seloice Tools',
  description: 'Generate viral Reddit-style faceless shorts automatically with AI story and TTS.',
};

export default function FacelessMakerPage() {
  return <FacelessMakerClient />;
}