import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Shield, Activity, Layers, Lock, Zap, ChevronRight, BookOpen, BarChart3, Wallet, ChevronLeft, CheckCircle2, Coins, FileText, TrendingUp } from 'lucide-react';
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
    color: '#E6007A',
    steps: [
      {
        title: 'Deposit Assets',
        description: 'DAO deposits single-sided (DOT, USDT) or dual-sided liquidity via the Vault Router.',
        icon: <Lock className="w-6 h-6" />,
        details: ['Select asset and amount', 'Choose single or dual-sided deposit', 'Connect Safe multi-sig wallet']
      },
      {
        title: 'Automatic Matching',
        description: 'Conduir\'s matching engine routes your deposit to the highest-APY vault with available capacity.',
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
    <section className="py-24 px-6 bg-[#0A0B10]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Interactive Protocol Flows</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">Step through each protocol flow to understand how Conduir separates IL risk from liquidity provision.</p>
        </div>

        {/* Flow Selector */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {(
            [
              { key: 'deposit' as FlowType, label: 'LP Deposit', icon: <Wallet className="w-5 h-5" /> },
              { key: 'voucher' as FlowType, label: 'IL Voucher', icon: <Layers className="w-5 h-5" /> },
              { key: 'fees' as FlowType, label: 'Fee Collection', icon: <Coins className="w-5 h-5" /> }
            ]
          ).map((flowBtn) => (
            <button
              key={flowBtn.key}
              onClick={() => { setActiveFlow(flowBtn.key); setCurrentStep(0); }}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                activeFlow === flowBtn.key
                  ? 'shadow-lg scale-105'
                  : 'bg-[#13141C] border border-white/10 text-slate-400 hover:text-white hover:bg-white/5'
              }`}
              style={{
                backgroundColor: activeFlow === flowBtn.key ? flow.color : undefined,
                color: activeFlow === flowBtn.key ? '#fff' : undefined
              }}
            >
              {flowBtn.icon}
              {flowBtn.label}
            </button>
          ))}
        </div>

        {/* Flow Display */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Steps Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-[#13141C] border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-6">Flow Steps</h3>
              <div className="space-y-2">
                {flow.steps.map((step, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentStep(index)}
                    className={`w-full text-left p-4 rounded-xl transition-all ${
                      currentStep === index
                        ? 'border-2'
                        : 'border border-white/5 hover:border-white/20'
                    }`}
                    style={{
                      borderColor: currentStep === index ? flow.color : undefined,
                      backgroundColor: currentStep === index ? `${flow.color}10` : undefined
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                        currentStep === index ? 'text-white' : 'text-slate-500'
                      }`}
                      style={{
                        backgroundColor: currentStep === index ? flow.color : 'rgba(255,255,255,0.05)'
                      }}
                      >
                        {index + 1}
                      </div>
                      <span className={`text-sm font-medium ${currentStep === index ? 'text-white' : 'text-slate-400'}`}>
                        {step.title}
                      </span>
                      {index < currentStep && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 ml-auto" />
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
                className="bg-[#13141C] border border-white/10 rounded-2xl p-8 h-full"
              >
                <div className="flex items-start gap-6 mb-8">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${flow.color}20` }}
                  >
                    <div style={{ color: flow.color }}>
                      {flow.steps[currentStep].icon}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-2" style={{ color: flow.color }}>
                      Step {currentStep + 1} of {flow.steps.length}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">{flow.steps[currentStep].title}</h3>
                    <p className="text-slate-400 leading-relaxed">{flow.steps[currentStep].description}</p>
                  </div>
                </div>

                {flow.steps[currentStep].details && (
                  <div className="bg-[#0A0B10] rounded-xl p-6 mb-8">
                    <h4 className="text-sm font-semibold text-slate-400 mb-4">Key Details</h4>
                    <ul className="space-y-3">
                      {flow.steps[currentStep].details?.map((detail, i) => (
                        <li key={i} className="flex items-center gap-3 text-slate-300">
                          <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: flow.color }} />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-xs text-slate-500 mb-2">
                    <span>Progress</span>
                    <span>{Math.round((currentStep + 1) / flow.steps.length * 100)}%</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
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
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/5 text-slate-400 hover:text-white"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>

                  {currentStep === flow.steps.length - 1 ? (
                    <Link
                      to="/app"
                      className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-white transition-all hover:scale-105"
                      style={{ backgroundColor: flow.color }}
                    >
                      Try in dApp <ArrowRight className="w-4 h-4" />
                    </Link>
                  ) : (
                    <button
                      onClick={nextStep}
                      className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-white transition-all hover:scale-105"
                      style={{ backgroundColor: flow.color }}
                    >
                      Next Step <ArrowRight className="w-4 h-4" />
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
