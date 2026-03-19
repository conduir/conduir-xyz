import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAccount } from 'wagmi';
import { WalletButton } from './web3/WalletButton';
import logo from '../public/logo.png';

const NAV_LINKS = [
  { label: 'The Problem', id: 'problem' },
  { label: 'How it Works', id: 'solution' },
  { label: 'Benefits', id: 'benefits' },
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isConnected } = useAccount();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAppRoute = location.pathname.startsWith('/app');

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    setMobileOpen(false);
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
        <Link to="/" className="flex items-center gap-3" onClick={() => setMobileOpen(false)}>
          <img src={logo} alt="Conduir" className="w-10 h-10" />
          <span className="font-display font-bold text-xl tracking-tight text-white">Conduir</span>
        </Link>

        {/* Desktop nav links */}
        {!isAppRoute && (
          <div className="hidden md:flex items-center gap-10">
            {NAV_LINKS.map(({ label, id }) => (
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
        )}

        {/* Desktop right */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/docs"
            className="flex items-center gap-2 font-data text-xs uppercase tracking-[0.15em] text-zinc-500 hover:text-white transition-colors"
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

        {/* Mobile right */}
        <div className="flex md:hidden items-center gap-3">
          {isAppRoute && <WalletButton />}
          <button
            onClick={() => setMobileOpen(o => !o)}
            className="w-9 h-9 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden border-t border-white/[0.06] bg-[#050508]/95 backdrop-blur-xl"
          >
            <div className="px-6 py-4 space-y-1">
              {!isAppRoute && NAV_LINKS.map(({ label, id }) => (
                <a
                  key={id}
                  href={`#${id}`}
                  onClick={e => handleScroll(e, id)}
                  className="block py-3 font-data text-xs uppercase tracking-[0.15em] text-zinc-500 hover:text-white transition-colors border-b border-white/[0.04]"
                >
                  {label}
                </a>
              ))}
              <Link
                to="/docs"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 py-3 font-data text-xs uppercase tracking-[0.15em] text-zinc-500 hover:text-white transition-colors border-b border-white/[0.04]"
              >
                <BookOpen className="w-4 h-4" />
                Docs
              </Link>
              {!isAppRoute && (
                <div className="pt-3">
                  <Link
                    to="/app"
                    onClick={() => setMobileOpen(false)}
                    className="inline-flex items-center justify-center gap-2 w-full px-5 py-2.5 rounded-xl bg-gradient-to-br from-[#FF0877] to-[#E6006A] text-white font-display font-bold text-xs uppercase tracking-[0.08em] shadow-[0_0_20px_rgba(255,8,119,0.25)]"
                  >
                    Launch dApp
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
