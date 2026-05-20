// File: src/app/tools/video-editor/components/ProjectDashboard.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
// 🔥 FIX: FolderVideo hata kar standard 'Film' aur 'Folder' use kiya hai taaki version mismatch ka error na aaye
import { Plus, Film, Clock, MoreVertical, ArrowLeft, Folder } from 'lucide-react';
import Link from 'next/link';

interface ProjectMeta {
  id: string;
  name: string;
  lastEdited: number;
}

interface Props {
  onSelectProject: (projectId: string, isNew?: boolean) => void;
}

export default function ProjectDashboard({ onSelectProject }: Props) {
  const [projects, setProjects] = useState<ProjectMeta[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  // 🔥 FIX: Hydration mismatch se bachne ke liye mounted state
  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem('seloice_projects');
    if (saved) {
      setProjects(JSON.parse(saved));
    }
  }, []);

  const createNewProject = () => {
    const newProject: ProjectMeta = {
      id: `proj_${Date.now()}`,
      name: `Untitled Project ${projects.length + 1}`,
      lastEdited: Date.now(),
    };
    
    const updatedProjects = [newProject, ...projects];
    setProjects(updatedProjects);
    localStorage.setItem('seloice_projects', JSON.stringify(updatedProjects));
    
    onSelectProject(newProject.id, true);
  };

  // Jab tak client-side mount nahi hota, kuch mat dikhao (Avoids SSR issues)
  if (!isMounted) return null;

  return (
    <div className="w-full min-h-screen bg-[#050505] text-white p-8 md:p-12 font-sans overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <Link href="/tools" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest mb-4">
              <ArrowLeft size={16} /> Back to Hub
            </Link>
            <h1 className="text-4xl font-black tracking-tight">Your Projects</h1>
            <p className="text-zinc-400 mt-2">Manage and continue your video editing sessions.</p>
          </div>
          
          <button 
            onClick={createNewProject}
            className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:brightness-110 px-6 py-3 rounded-xl font-bold shadow-lg shadow-violet-500/20 transition-all active:scale-95"
          >
            <Plus size={20} /> New Project
          </button>
        </div>

        {/* Project Grid */}
        {projects.length === 0 ? (
          <div className="w-full py-20 border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4">
              <Film size={32} className="text-zinc-500" />
            </div>
            <h3 className="text-xl font-bold mb-2">No projects yet</h3>
            <p className="text-zinc-500 max-w-sm mb-6">Create your first project to start editing highly engaging videos.</p>
            <button onClick={createNewProject} className="text-violet-400 font-bold hover:text-violet-300">
              + Create Blank Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {projects.map((proj) => (
              <motion.div 
                key={proj.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => onSelectProject(proj.id)}
                className="group bg-[#111] border border-white/10 hover:border-violet-500/50 rounded-2xl overflow-hidden cursor-pointer transition-all shadow-xl hover:shadow-violet-500/10 flex flex-col"
              >
                <div className="w-full aspect-video bg-[#0a0a0a] relative border-b border-white/5 flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Folder size={32} className="text-zinc-700 group-hover:text-violet-400 transition-colors relative z-10" />
                </div>
                
                <div className="p-4 flex items-start justify-between flex-1">
                  <div>
                    <h3 className="font-bold text-white text-sm truncate max-w-[150px]">{proj.name}</h3>
                    <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 mt-1.5 font-mono">
                      <Clock size={12} />
                      {new Date(proj.lastEdited).toLocaleDateString()}
                    </div>
                  </div>
                  <button className="text-zinc-600 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors" onClick={(e) => e.stopPropagation()}>
                    <MoreVertical size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}