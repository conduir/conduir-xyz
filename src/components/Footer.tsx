import React from 'react';
import { Layers, Github, Twitter, Disc as Discord } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-white/10 bg-[#0A0B10]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <Link to="/" className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-[#E6007A]" />
          <span className="font-display font-bold text-lg tracking-tight">Conduir</span>
        </Link>
        
        <div className="flex items-center gap-6 text-slate-400">
          <a href="#" className="hover:text-white transition-colors"><Github className="w-5 h-5" /></a>
          <a href="#" className="hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
          <a href="#" className="hover:text-white transition-colors"><Discord className="w-5 h-5" /></a>
        </div>
        
        <div className="text-sm text-slate-500">
          © {new Date().getFullYear()} Conduir Protocol. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
