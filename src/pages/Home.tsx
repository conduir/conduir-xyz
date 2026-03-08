import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Shield, Activity, Layers, Lock, Zap, ChevronRight, BookOpen, BarChart3, Wallet } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className="pt-40 pb-24 px-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#E6007A]/20 rounded-full blur-[120px] opacity-50 pointer-events-none" />
      
      <div className="max-w-5xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-slate-300 mb-8">
            <span className="w-2 h-2 rounded-full bg-[#E6007A] animate-pulse" />
            Built for the Polkadot Hub
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 leading-[1.1]">
            Liquidity Without <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E6007A] to-purple-500">
              The Liability.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed">
            Conduir separates Impermanent Loss from liquidity provision. DAO Treasuries earn protected yield. Protocols secure stable, non-mercenary liquidity.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/app" className="w-full sm:w-auto bg-[#E6007A] hover:bg-[#C20066] text-white px-8 py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(230,0,122,0.3)]">
              Launch dApp <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/docs" className="w-full sm:w-auto bg-[#13141C] border border-white/10 hover:bg-white/5 text-white px-8 py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2">
              Read the Docs <BookOpen className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Problem = () => (
  <section id="problem" className="py-24 px-6 bg-[#0A0B10]">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">The Liquidity Dilemma</h2>
        <p className="text-slate-400 max-w-2xl mx-auto">Current AMM models force a compromise between capital efficiency and risk, creating a broken system for institutional players.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-[#13141C] border border-white/5 p-8 rounded-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-[50px]" />
          <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mb-6">
            <Activity className="w-6 h-6 text-red-500" />
          </div>
          <h3 className="text-xl font-bold mb-3">For DAO Treasuries: The IL Trap</h3>
          <p className="text-slate-400 leading-relaxed">
            Providing liquidity exposes treasuries to Impermanent Loss (IL). This existential risk makes traditional AMMs unsuitable for conservative treasury management, leaving capital idle.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-[#13141C] border border-white/5 p-8 rounded-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-[50px]" />
          <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-6">
            <Zap className="w-6 h-6 text-orange-500" />
          </div>
          <h3 className="text-xl font-bold mb-3">For Protocols: Mercenary Capital</h3>
          <p className="text-slate-400 leading-relaxed">
            High token emissions attract transient liquidity that vanishes the moment incentives dry up. Protocols bleed native tokens just to rent unstable market depth.
          </p>
        </motion.div>
      </div>
    </div>
  </section>
);

const Solution = () => (
  <section id="solution" className="py-24 px-6 border-y border-white/5 bg-[#0A0B10]/50">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Isolating Risk with the IL Voucher</h2>
        <p className="text-slate-400 max-w-2xl mx-auto">Conduir's matching engine pairs risk-averse capital with protocols willing to underwrite IL for guaranteed liquidity.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 relative">
        {/* Connecting line for desktop */}
        <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-y-1/2 z-0" />

        {[
          {
            step: "01",
            title: "Supply Capital",
            desc: "DAOs deposit single-sided or dual-sided liquidity into Conduir Vaults, completely shielded from Impermanent Loss.",
            icon: <Lock className="w-6 h-6 text-[#E6007A]" />
          },
          {
            step: "02",
            title: "Underwrite Risk",
            desc: "Protocols deposit native tokens to underwrite the IL risk of the provided liquidity, securing long-term market depth.",
            icon: <Shield className="w-6 h-6 text-[#E6007A]" />
          },
          {
            step: "03",
            title: "The IL Voucher",
            desc: "Conduir mints an ERC-20 IL Voucher representing the underwritten risk, creating a secondary market for IL pricing.",
            icon: <Layers className="w-6 h-6 text-[#E6007A]" />
          }
        ].map((item, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.2 }}
            className="bg-[#13141C] border border-white/10 p-8 rounded-2xl relative z-10"
          >
            <div className="text-5xl font-display font-bold text-white/5 absolute top-6 right-6">{item.step}</div>
            <div className="w-12 h-12 rounded-xl bg-[#E6007A]/10 flex items-center justify-center mb-6">
              {item.icon}
            </div>
            <h3 className="text-xl font-bold mb-3">{item.title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const DualValue = () => (
  <section id="benefits" className="py-24 px-6">
    <div className="max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-sm text-emerald-400 mb-4">
              For DAO Treasuries
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Protected Treasury Yield</h2>
            <p className="text-slate-400 text-lg leading-relaxed">
              Deploy idle treasury assets into productive DeFi strategies without the existential risk of Impermanent Loss. Predictable returns, zero IL.
            </p>
          </div>
          <ul className="space-y-4">
            {['100% IL Protection Guarantee', 'Single-sided deposit options', 'Predictable, stable yield generation'].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-slate-300">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
                {item}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-8 lg:pl-12 border-l-0 lg:border-l border-white/10"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-sm text-blue-400 mb-4">
              For DeFi Protocols
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Sustainable Market Depth</h2>
            <p className="text-slate-400 text-lg leading-relaxed">
              Bootstrap liquidity without hyper-inflationary token emissions. Pay for IL only when it happens, securing loyal, long-term capital.
            </p>
          </div>
          <ul className="space-y-4">
            {['End mercenary capital reliance', 'Lower cost of liquidity acquisition', 'Tradeable IL risk via Vouchers'].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-slate-300">
                <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                </div>
                {item}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  </section>
);

const DashboardPreview = () => (
  <section id="dashboard" className="py-24 px-6 bg-[#13141C] border-y border-white/5">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Conduir App Architecture</h2>
        <p className="text-slate-400 max-w-2xl mx-auto">A brief overview of the dApp interface designed for institutional users.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-[#0A0B10] border border-white/10 rounded-2xl overflow-hidden flex flex-col">
          <div className="p-4 border-b border-white/10 flex items-center gap-3 bg-white/[0.02]">
            <Wallet className="w-5 h-5 text-emerald-400" />
            <span className="font-semibold">DAO Treasury Vault View</span>
          </div>
          <div className="p-6 flex-1 space-y-4">
            <div className="h-24 rounded-xl bg-white/5 border border-white/5 flex items-center px-6">
              <div>
                <div className="text-sm text-slate-400 mb-1">Total Protected Value</div>
                <div className="text-2xl font-display font-bold">$24,500,000.00</div>
              </div>
            </div>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-[#E6007A]" /> Portfolio overview & IL-protected yield metrics</li>
              <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-[#E6007A]" /> Single-asset deposit flows</li>
              <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-[#E6007A]" /> Historical performance reports</li>
            </ul>
          </div>
        </div>

        <div className="bg-[#0A0B10] border border-white/10 rounded-2xl overflow-hidden flex flex-col">
          <div className="p-4 border-b border-white/10 flex items-center gap-3 bg-white/[0.02]">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            <span className="font-semibold">Protocol Listing View</span>
          </div>
          <div className="p-6 flex-1 space-y-4">
            <div className="h-24 rounded-xl bg-white/5 border border-white/5 flex items-center px-6">
              <div>
                <div className="text-sm text-slate-400 mb-1">Active IL Liability</div>
                <div className="text-2xl font-display font-bold text-blue-400">$1,240,500.00</div>
              </div>
            </div>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-[#E6007A]" /> Liquidity underwriting interface</li>
              <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-[#E6007A]" /> IL Voucher management & secondary market</li>
              <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-[#E6007A]" /> Real-time IL liability tracking</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default function Home() {
  return (
    <div>
      <Hero />
      <Problem />
      <Solution />
      <DualValue />
      <DashboardPreview />
    </div>
  );
}
