import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen } from 'lucide-react';
import { useAccount } from 'wagmi';
import { WalletButton } from './web3/WalletButton';
import logo from '../public/logo.png';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isConnected } = useAccount();

  const isAppRoute = location.pathname.startsWith('/app');

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
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-[#050508]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="Conduir" className="w-10 h-10" />
          <span className="font-display font-bold text-xl tracking-tight text-white">Conduir</span>
        </Link>

        <div className="hidden md:flex items-center gap-10">
          {[
            { label: 'The Problem', id: 'problem' },
            { label: 'How it Works', id: 'solution' },
            { label: 'Benefits', id: 'benefits' },
          ].map(({ label, id }) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={e => handleScroll(e, id)}
              className="font-data text-xs uppercase tracking-[0.15em] text-zinc-500 hover:text-white transition-colors"
            >
              {label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/docs"
            className="hidden md:flex items-center gap-2 font-data text-xs uppercase tracking-[0.15em] text-zinc-500 hover:text-white transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            Docs
          </Link>
          {isAppRoute ? (
            <WalletButton />
          ) : (
            <Link
              to="/app"
              className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-br from-[#FF0877] to-[#E6006A] text-white font-display font-bold text-xs uppercase tracking-[0.08em] shadow-[0_0_20px_rgba(255,8,119,0.25)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,8,119,0.4)] hover:-translate-y-0.5"
            >
              Launch dApp
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
