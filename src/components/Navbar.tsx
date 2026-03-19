import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Layers, BookOpen } from 'lucide-react';
import { useAccount } from 'wagmi';
import { WalletButton } from './web3/WalletButton';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isConnected } = useAccount();

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' }), 100);
    } else {
      document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.07] bg-[#07080D]/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#E6007A] to-purple-600 flex items-center justify-center">
            <Layers className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight">Conduir</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {[
            { label: 'The Problem', id: 'problem' },
            { label: 'How it Works', id: 'solution' },
            { label: 'Benefits', id: 'benefits' },
          ].map(({ label, id }) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={e => handleScroll(e, id)}
              className="font-data text-[11px] uppercase tracking-[0.15em] text-zinc-400 hover:text-white transition-colors"
            >
              {label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/docs"
            className="hidden md:flex items-center gap-2 font-data text-[11px] uppercase tracking-[0.15em] text-zinc-400 hover:text-white transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" />
            Docs
          </Link>
          {isConnected || location.pathname === '/app' ? (
            <WalletButton />
          ) : (
            <Link
              to="/app"
              className="inline-flex items-center gap-2 font-display font-bold text-[11px] uppercase tracking-[0.07em] px-5 py-2.5 rounded-[10px] bg-[#E6007A] text-white hover:bg-[#C20066] transition-colors"
            >
              Launch dApp <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
