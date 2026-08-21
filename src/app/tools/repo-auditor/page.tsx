// File: src/app/tools/repo-auditor/page.tsx
import RepoAuditorClient from './RepoAuditorClient';

export const metadata = {
  title: 'Repo Auditor — Generate GitHub Context for LLMs',
  description: 'Paste a GitHub link and instantly generate a single LLM-optimized context file. Supports public and private repositories.',
};

export default function RepoAuditorPage() {
  return <RepoAuditorClient />;
}