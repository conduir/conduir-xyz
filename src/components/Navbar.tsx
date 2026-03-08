import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Layers, BookOpen } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#0A0B10]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#E6007A] to-purple-600 flex items-center justify-center">
            <Layers className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight">Conduir</span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#problem" onClick={(e) => handleScroll(e, 'problem')} className="hover:text-white transition-colors cursor-pointer">The Problem</a>
          <a href="#solution" onClick={(e) => handleScroll(e, 'solution')} className="hover:text-white transition-colors cursor-pointer">How it Works</a>
          <a href="#benefits" onClick={(e) => handleScroll(e, 'benefits')} className="hover:text-white transition-colors cursor-pointer">Benefits</a>
          <a href="#dashboard" onClick={(e) => handleScroll(e, 'dashboard')} className="hover:text-white transition-colors cursor-pointer">App Preview</a>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/docs" className="hidden md:flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">
            <BookOpen className="w-4 h-4" />
            Docs
          </Link>
          <Link to="/app" className="bg-white text-black px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-slate-200 transition-colors flex items-center gap-2">
            Launch dApp <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </nav>
  );
}
