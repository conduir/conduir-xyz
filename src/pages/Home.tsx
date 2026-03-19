import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Shield, Activity, Layers, Lock, Zap, BookOpen, BarChart3, Wallet, ChevronLeft, CheckCircle2, Coins, FileText, TrendingUp, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className="relative overflow-hidden" style={{ paddingTop: '160px', paddingBottom: '96px' }}>
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#08090F] via-[#0A0B12] to-[#050508]" />

      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#FF0877]/10 rounded-full blur-[120px] opacity-60 pointer-events-none" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 grid-bg opacity-30" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm"
          >
            <span className="w-2 h-2 rounded-full bg-[#FF0877] shadow-[0_0_10px_rgba(255,8,119,0.6)] animate-pulse" />
            <span className="text-sm text-zinc-400 font-sans">Built for Polkadot Hub</span>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-[clamp(48px,8vw,76px)] font-display font-bold leading-[1.1] tracking-tight mb-8"
          >
            Liquidity Without
            <br />
            <span className="text-gradient-primary">The Liability.</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-[clamp(17px,2vw,20px)] text-zinc-400 leading-relaxed max-w-2xl mx-auto mb-12 font-sans"
          >
            Conduir separates Impermanent Loss from liquidity provision. DAO Treasuries earn protected yield. Protocols secure stable, non-mercenary liquidity.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <Link
              to="/app"
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-br from-[#FF0877] to-[#E6006A] text-white font-semibold text-base shadow-[0_0_40px_rgba(255,8,119,0.25)] transition-all duration-300 hover:shadow-[0_0_60px_rgba(255,8,119,0.4)] hover:-translate-y-1"
            >
              Launch dApp
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/docs"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-[#0C0C12] border border-white/[0.08] text-white font-semibold text-base transition-all duration-300 hover:bg-white/[0.05] hover:border-white/[0.15]"
            >
              Read the Docs
              <BookOpen className="w-5 h-5" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

const Problem = () => (
  <section id="problem" className="py-24 px-6 bg-[#050508]">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-[clamp(26px,3vw,32px)] font-display font-bold mb-4">The Liquidity Dilemma</h2>
        <p className="text-zinc-500 max-w-2xl mx-auto text-sm">
          Current AMM models force a compromise between capital efficiency and risk, creating a broken system for institutional players.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="card card-pink p-8 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-red-500/5 blur-[60px] group-hover:bg-red-500/10 transition-colors" />
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center mb-6 relative">
            <Activity className="w-7 h-7 text-red-400" />
          </div>
          <h3 className="text-xl font-display font-bold mb-3 text-white">For DAO Treasuries: The IL Trap</h3>
          <p className="text-zinc-500 text-sm leading-relaxed">
            Providing liquidity exposes treasuries to Impermanent Loss (IL). This existential risk makes traditional AMMs unsuitable for conservative treasury management, leaving capital idle.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="card card-amber p-8 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/5 blur-[60px] group-hover:bg-amber-500/10 transition-colors" />
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-6 relative">
            <Zap className="w-7 h-7 text-amber-400" />
          </div>
          <h3 className="text-xl font-display font-bold mb-3 text-white">For Protocols: Mercenary Capital</h3>
          <p className="text-zinc-500 text-sm leading-relaxed">
            High token emissions attract transient liquidity that vanishes the moment incentives dry up. Protocols bleed native tokens just to rent unstable market depth.
          </p>
        </motion.div>
      </div>
    </div>
  </section>
);

const Solution = () => (
  <section id="solution" className="py-24 px-6 border-y border-white/[0.05] bg-[#08090F]">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-[clamp(26px,3vw,32px)] font-display font-bold mb-4">Isolating Risk with the IL Voucher</h2>
        <p className="text-zinc-500 max-w-2xl mx-auto text-sm">
          Conduir's matching engine pairs risk-averse capital with protocols willing to underwrite IL for guaranteed liquidity.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 relative">
        {/* Connecting line */}
        <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/[0.1] to-transparent -translate-y-1/2 z-0" />

        {[
          {
            step: "01",
            title: "Supply Capital",
            desc: "DAOs deposit single-sided or dual-sided liquidity into Conduir Vaults, completely shielded from Impermanent Loss.",
            icon: <Lock className="w-6 h-6" />
          },
          {
            step: "02",
            title: "Underwrite Risk",
            desc: "Protocols deposit native tokens to underwrite the IL risk of the provided liquidity, securing long-term market depth.",
            icon: <Shield className="w-6 h-6" />
          },
          {
            step: "03",
            title: "The IL Voucher",
            desc: "Conduir mints an ERC-20 IL Voucher representing the underwritten risk, creating a secondary market for IL pricing.",
            icon: <Layers className="w-6 h-6" />
          }
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="card p-8 relative z-10"
          >
            <span className="absolute top-6 right-6 text-5xl font-display font-bold text-white/[0.03]">
              {item.step}
            </span>
            <div className="w-14 h-14 rounded-2xl bg-[#FF0877]/10 flex items-center justify-center mb-6">
              <span className="text-[#FF0877]">{item.icon}</span>
            </div>
            <h3 className="text-lg font-display font-bold mb-3 text-white">{item.title}</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const DualValue = () => (
  <section id="benefits" className="py-24 px-6">
    <div className="max-w-6xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-data uppercase tracking-wider mb-4">
              For DAO Treasuries
            </span>
            <h2 className="text-[clamp(24px,3vw,32px)] font-display font-bold mb-4">Protected Treasury Yield</h2>
            <p className="text-zinc-400 text-base leading-relaxed">
              Deploy idle treasury assets into productive DeFi strategies without the existential risk of Impermanent Loss. Predictable returns, zero IL.
            </p>
          </div>
          <ul className="space-y-4">
            {['100% IL Protection Guarantee', 'Single-sided deposit options', 'Predictable, stable yield generation'].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-zinc-300 text-sm">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-8 md:pl-6 lg:pl-12 border-l-0 lg:border-l border-white/[0.08]"
        >
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-data uppercase tracking-wider mb-4">
              For DeFi Protocols
            </span>
            <h2 className="text-[clamp(24px,3vw,32px)] font-display font-bold mb-4">Sustainable Market Depth</h2>
            <p className="text-zinc-400 text-base leading-relaxed">
              Bootstrap liquidity without hyper-inflationary token emissions. Pay for IL only when it happens, securing loyal, long-term capital.
            </p>
          </div>
          <ul className="space-y-4">
            {['End mercenary capital reliance', 'Lower cost of liquidity acquisition', 'Tradeable IL risk via Vouchers'].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-zinc-300 text-sm">
                <span className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="w-2 h-2 rounded-full bg-blue-400" />
                </span>
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
  <section id="dashboard" className="py-24 px-6 bg-[#0C0C12] border-y border-white/[0.05]">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-[clamp(26px,3vw,32px)] font-display font-bold mb-4">Conduir App Architecture</h2>
        <p className="text-zinc-500 max-w-2xl mx-auto text-sm">
          A brief overview of the dApp interface designed for institutional users.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card p-6">
          <div className="flex items-center gap-3 pb-4 border-b border-white/[0.06] mb-6">
            <Wallet className="w-5 h-5 text-emerald-400" />
            <span className="font-semibold text-white">DAO Treasury Vault View</span>
          </div>
          <div className="space-y-6">
            <div className="stat-cell p-5">
              <p className="text-xs text-zinc-500 mb-2 font-data uppercase tracking-wider">Total Protected Value</p>
              <p className="text-2xl font-display font-bold text-white">$24,500,000.00</p>
            </div>
            <ul className="space-y-3">
              {['Portfolio overview & IL-protected yield metrics', 'Single-asset deposit flows', 'Historical performance reports'].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-zinc-500">
                  <ChevronRight className="w-4 h-4 text-[#FF0877] flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-3 pb-4 border-b border-white/[0.06] mb-6">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            <span className="font-semibold text-white">Protocol Listing View</span>
          </div>
          <div className="space-y-6">
            <div className="stat-cell p-5">
              <p className="text-xs text-zinc-500 mb-2 font-data uppercase tracking-wider">Active IL Liability</p>
              <p className="text-2xl font-display font-bold text-blue-400">$1,240,500.00</p>
            </div>
            <ul className="space-y-3">
              {['Liquidity underwriting interface', 'IL Voucher management & secondary market', 'Real-time IL liability tracking'].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-zinc-500">
                  <ChevronRight className="w-4 h-4 text-[#FF0877] flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// Flow Walkthrough Component
type FlowType = 'deposit' | 'voucher' | 'fees';

interface FlowStep {
  title: string;
  description: string;
  icon: React.ReactNode;
  details?: string[];
}

const flows: Record<FlowType, { title: string; description: string; color: string; steps: FlowStep[] }> = {
  deposit: {
    title: 'LP Deposit & Vault Matching',
    description: 'DAO Treasuries deposit assets and get automatically matched to the best vaults with IL protection.',
    color: '#FF0877',
    steps: [
      {
        title: 'Deposit Assets',
        description: 'DAO deposits single-sided (DOT, USDT) or dual-sided liquidity via the Vault Router.',
        icon: <Lock className="w-6 h-6" />,
        details: ['Select asset and amount', 'Choose single or dual-sided deposit', 'Connect Safe multi-sig wallet']
      },
      {
        title: 'Automatic Matching',
        description: "Conduir's matching engine routes your deposit to the highest-APY vault with available capacity.",
        icon: <TrendingUp className="w-6 h-6" />,
        details: ['Algorithmic APY/capacity optimization', 'Real-time vault availability check', 'Instant routing confirmation']
      },
      {
        title: 'Receipt Tokens',
        description: 'Receive ERC-20 receipt tokens representing your deposit and claim to future yield.',
        icon: <Coins className="w-6 h-6" />,
        details: ['Tokens minted 1:1 with deposit value', 'Transferable and tradable', 'Redeemable anytime']
      },
      {
        title: 'IL Protection',
        description: 'Any impermanent loss is covered by protocol collateral—not your treasury.',
        icon: <Shield className="w-6 h-6" />,
        details: ['100% IL protection guarantee', 'Protected at smart contract level', 'No IL exposure to LP']
      }
    ]
  },
  voucher: {
    title: 'IL Voucher Lifecycle',
    description: 'Protocols underwrite IL risk by depositing collateral and receiving tradable IL Voucher tokens.',
    color: '#3b82f6',
    steps: [
      {
        title: 'Protocol Registration',
        description: 'Register your vault and pay the listing fee to the Fee Splitter contract.',
        icon: <FileText className="w-6 h-6" />,
        details: ['Select target trading pair (e.g., DOT/USDC)', 'Pay 40/60 hybrid listing fee', 'Vault appears in DAO marketplace']
      },
      {
        title: 'Collateral Deposit',
        description: 'Deposit native tokens as collateral to underwrite potential IL payouts.',
        icon: <Coins className="w-6 h-6" />,
        details: ['Collateral based on IL volatility', 'Locked for vault duration', 'Refunded if no IL occurs']
      },
      {
        title: 'Mint IL Vouchers',
        description: 'Receive ERC-20 ILV tokens representing your underwritten risk exposure.',
        icon: <Layers className="w-6 h-6" />,
        details: ['Tradeable on secondary markets', 'Priced by market demand', 'Hedge or speculate on IL']
      },
      {
        title: 'Settlement',
        description: 'If IL occurs, oracles report it and vouchers are burned to pay out LPs.',
        icon: <CheckCircle2 className="w-6 h-6" />,
        details: ['Chainlink/Pyth price feeds', 'Automated IL calculation', 'Transparent on-chain settlement']
      }
    ]
  },
  fees: {
    title: 'Fee Collection Mechanism',
    description: 'Hybrid fee model aligns DAO revenue with protocol sustainability through 40/60 split.',
    color: '#10b981',
    steps: [
      {
        title: 'Listing Fee Split',
        description: 'Protocol pays listing fee split into immediate (40%) and accrued (60%) portions.',
        icon: <Coins className="w-6 h-6" />,
        details: ['40% goes to DAO treasury immediately', '60% earned over time via trading fees', 'Transparent Fee Splitter contract']
      },
      {
        title: 'Trading Fee Distribution',
        description: 'LPs earn 100% of trading fees, with 60% diverted to DAO until accrued portion is covered.',
        icon: <TrendingUp className="w-6 h-6" />,
        details: ['LPs receive full trading fee revenue', '60% of fees go to DAO (vested)', 'Continuous yield stream']
      },
      {
        title: 'Vault Expiration',
        description: 'When vault expires, any remaining accrued fees are returned to the protocol.',
        icon: <Activity className="w-6 h-6" />,
        details: ['Unused collateral refunded', 'Residual fees returned to protocol', 'Clean settlement']
      },
      {
        title: 'Fee Summary',
        description: 'Full transparency into all fee flows and revenue distribution.',
        icon: <BarChart3 className="w-6 h-6" />,
        details: ['Real-time fee breakdown', 'Historical revenue tracking', 'Audit trail on-chain']
      }
    ]
  }
};

const FlowWalkthrough = () => {
  const [activeFlow, setActiveFlow] = useState<FlowType>('deposit');
  const [currentStep, setCurrentStep] = useState(0);
  const flow = flows[activeFlow];

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, flow.steps.length - 1));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  return (
    <section className="py-24 px-6 bg-[#050508]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-[clamp(26px,3vw,32px)] font-display font-bold mb-4">Interactive Protocol Flows</h2>
          <p className="text-zinc-500 max-w-2xl mx-auto text-sm">
            Step through each protocol flow to understand how Conduir separates IL risk from liquidity provision.
          </p>
        </div>

        {/* Flow Selector */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {[
            { key: 'deposit' as FlowType, label: 'LP Deposit', icon: <Wallet className="w-5 h-5" /> },
            { key: 'voucher' as FlowType, label: 'IL Voucher', icon: <Layers className="w-5 h-5" /> },
            { key: 'fees' as FlowType, label: 'Fee Collection', icon: <Coins className="w-5 h-5" /> }
          ].map((flowBtn) => (
            <button
              key={flowBtn.key}
              onClick={() => { setActiveFlow(flowBtn.key); setCurrentStep(0); }}
              className={`flex items-center gap-3 px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 ${
                activeFlow === flowBtn.key
                  ? 'bg-[#FF0877] text-white shadow-[0_8px_32px_rgba(255,8,119,0.3)] scale-105'
                  : 'bg-[#0C0C12] text-zinc-500 border border-white/[0.08] hover:text-white hover:border-white/[0.15]'
              }`}
            >
              {flowBtn.icon}
              {flowBtn.label}
            </button>
          ))}
        </div>

        {/* Flow Display */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Steps Navigation */}
          <div className="lg:col-span-1">
            <div className="card p-6">
              <h3 className="text-lg font-display font-bold mb-6 text-white">Flow Steps</h3>
              <div className="flex flex-col gap-2">
                {flow.steps.map((step, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentStep(index)}
                    className={`w-full text-left p-4 rounded-xl transition-all duration-200 border ${
                      currentStep === index
                        ? 'bg-[#FF0877]/20 border-[#FF0877]'
                        : 'bg-transparent border-white/[0.05] hover:border-white/[0.15]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                        currentStep === index ? 'bg-[#FF0877] text-white' : 'bg-white/[0.05] text-zinc-600'
                      }`}>
                        {index + 1}
                      </span>
                      <span className={`text-sm font-medium ${
                        currentStep === index ? 'text-white' : 'text-zinc-500'
                      }`}>
                        {step.title}
                      </span>
                      {index < currentStep && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 ml-auto" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Step Detail */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeFlow}-${currentStep}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="card p-8 h-full"
              >
                <div className="flex items-start gap-6 mb-8">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${flow.color}20` }}>
                    <span style={{ color: flow.color }}>{flow.steps[currentStep].icon}</span>
                  </div>
                  <div>
                    <span className="text-xs font-medium mb-2 block" style={{ color: flow.color }}>
                      Step {currentStep + 1} of {flow.steps.length}
                    </span>
                    <h3 className="text-2xl font-display font-bold mb-3 text-white">
                      {flow.steps[currentStep].title}
                    </h3>
                    <p className="text-zinc-500 leading-relaxed">
                      {flow.steps[currentStep].description}
                    </p>
                  </div>
                </div>

                {flow.steps[currentStep].details && (
                  <div className="stat-cell p-6 mb-8">
                    <h4 className="text-sm font-semibold text-zinc-500 mb-4 font-data uppercase tracking-wider">
                      Key Details
                    </h4>
                    <ul className="space-y-3">
                      {flow.steps[currentStep].details?.map((detail, i) => (
                        <li key={i} className="flex items-center gap-3 text-zinc-400 text-sm">
                          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: flow.color }} />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Progress Bar */}
                <div className="mb-8">
                  <div className="flex justify-between text-xs text-zinc-600 mb-2 font-data">
                    <span>Progress</span>
                    <span>{Math.round((currentStep + 1) / flow.steps.length * 100)}%</span>
                  </div>
                  <div className="h-2 bg-white/[0.05] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: flow.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${(currentStep + 1) / flow.steps.length * 100}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      currentStep === 0
                        ? 'text-zinc-600 cursor-not-allowed'
                        : 'text-zinc-500 hover:text-white hover:bg-white/[0.05]'
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>

                  {currentStep === flow.steps.length - 1 ? (
                    <Link
                      to="/app"
                      className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-white transition-transform hover:scale-105"
                      style={{ backgroundColor: flow.color }}
                    >
                      Try in dApp
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  ) : (
                    <button
                      onClick={nextStep}
                      className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-white transition-transform hover:scale-105"
                      style={{ backgroundColor: flow.color }}
                    >
                      Next Step
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default function Home() {
  return (
    <div>
      <Hero />
      <Problem />
      <Solution />
      <DualValue />
      <DashboardPreview />
      <FlowWalkthrough />
    </div>
  );
}
