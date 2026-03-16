import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Shield, Activity, Layers, Lock, Zap, ChevronRight, BookOpen, BarChart3, Wallet, ChevronLeft, CheckCircle2, Coins, FileText, TrendingUp } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();
  return (
    <section
      style={{
        paddingTop: '160px',
        paddingBottom: '96px',
        paddingLeft: '24px',
        paddingRight: '24px',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(180deg, #0A0B10 0%, #13141C 100%)'
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '800px',
          height: '800px',
          background: 'radial-gradient(circle, rgba(230,0,122,0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(120px)',
          opacity: '0.6',
          pointerEvents: 'none'
        }}
      />

      <div style={{ maxWidth: '80rem', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 10 }}>
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
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '9999px',
              marginBottom: '32px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#E6007A',
                boxShadow: '0 0 10px rgba(230,0,122,0.5)',
                animation: 'pulse 2s infinite'
              }}
            />
            <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-sans)' }}>
              Built for the Polkadot Hub
            </span>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              fontSize: 'clamp(48px, 8vw, 80px)',
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              marginBottom: '32px',
              fontFamily: '"Space Grotesk", "Inter", sans-serif'
            }}
          >
            Liquidity Without{' '}
            <br />
            <span
              style={{
                background: 'linear-gradient(135deg, #E6007A 0%, #9333EA 50%, #7C3AED 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                display: 'inline-block'
              }}
            >
              The Liability.
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{
              fontSize: 'clamp(18px, 2vw, 22px)',
              color: 'rgba(161, 161, 170, 1)',
              lineHeight: 1.7,
              maxWidth: '48rem',
              margin: '0 auto 48px',
              fontFamily: 'var(--font-sans)'
            }}
          >
            Conduir separates Impermanent Loss from liquidity provision. DAO Treasuries earn protected yield. Protocols secure stable, non-mercenary liquidity.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}
          >
            <Link
              to="/app"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '16px 32px',
                borderRadius: '12px',
                fontWeight: 600,
                fontSize: '16px',
                background: 'linear-gradient(135deg, #E6007A 0%, #C20066 100%)',
                color: '#FFFFFF',
                boxShadow: '0 0 40px rgba(230, 0, 122, 0.3)',
                minWidth: '180px',
                textDecoration: 'none',
                transition: 'transform 0.2s, box-shadow 0.2s',
                fontFamily: 'var(--font-sans)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              Launch dApp <ArrowRight style={{ width: '20px', height: '20px' }} />
            </Link>
            <Link
              to="/docs"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '16px 32px',
                borderRadius: '12px',
                fontWeight: 600,
                fontSize: '16px',
                background: '#13141C',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#FFFFFF',
                minWidth: '180px',
                textDecoration: 'none',
                transition: 'transform 0.2s, background 0.2s',
                fontFamily: 'var(--font-sans)'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.background = '#13141C'; }}
            >
              Read the Docs <BookOpen style={{ width: '20px', height: '20px' }} />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

const Problem = () => (
  <section id="problem" className="py-24 px-6 bg-[#0A0B10]">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 style={{
          fontSize: 'clamp(24px, 3vw, 32px)',
          fontWeight: 700,
          marginBottom: '16px',
          fontFamily: '"Space Grotesk", "Inter", sans-serif'
        }}>The Liquidity Dilemma</h2>
        <p style={{
          color: 'rgba(161, 161, 170, 1)',
          maxWidth: '42rem',
          margin: '0 auto',
          fontFamily: 'var(--font-sans)',
          fontSize: 'var(--text-base)'
        }}>Current AMM models force a compromise between capital efficiency and risk, creating a broken system for institutional players.</p>
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
          <h3 style={{
            fontSize: 'var(--text-xl)',
            fontWeight: 700,
            marginBottom: '12px',
            fontFamily: '"Space Grotesk", "Inter", sans-serif',
            color: '#FFFFFF'
          }}>For DAO Treasuries: The IL Trap</h3>
          <p style={{ color: 'rgba(161, 161, 170, 1)', lineHeight: 1.6, fontFamily: 'var(--font-sans)' }}>
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
          <h3 style={{
            fontSize: 'var(--text-xl)',
            fontWeight: 700,
            marginBottom: '12px',
            fontFamily: '"Space Grotesk", "Inter", sans-serif',
            color: '#FFFFFF'
          }}>For Protocols: Mercenary Capital</h3>
          <p style={{ color: 'rgba(161, 161, 170, 1)', lineHeight: 1.6, fontFamily: 'var(--font-sans)' }}>
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
        <h2 style={{
          fontSize: 'clamp(24px, 3vw, 32px)',
          fontWeight: 700,
          marginBottom: '16px',
          fontFamily: '"Space Grotesk", "Inter", sans-serif'
        }}>Isolating Risk with the IL Voucher</h2>
        <p style={{
          color: 'rgba(161, 161, 170, 1)',
          maxWidth: '42rem',
          margin: '0 auto',
          fontFamily: 'var(--font-sans)',
          fontSize: 'var(--text-base)'
        }}>Conduir's matching engine pairs risk-averse capital with protocols willing to underwrite IL for guaranteed liquidity.</p>
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
            <div style={{ fontSize: '3rem', fontFamily: '"Space Grotesk", "Inter", sans-serif', fontWeight: 700, color: 'rgba(255,255,255,0.05)', position: 'absolute', top: '24px', right: '24px' }}>{item.step}</div>
            <div className="w-12 h-12 rounded-xl bg-[#E6007A]/10 flex items-center justify-center mb-6">
              {item.icon}
            </div>
            <h3 style={{
              fontSize: 'var(--text-xl)',
              fontWeight: 700,
              marginBottom: '12px',
              fontFamily: '"Space Grotesk", "Inter", sans-serif',
              color: '#FFFFFF'
            }}>{item.title}</h3>
            <p style={{ color: 'rgba(161, 161, 170, 1)', fontSize: 'var(--text-sm)', lineHeight: 1.6, fontFamily: 'var(--font-sans)' }}>{item.desc}</p>
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
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 12px',
              borderRadius: '9999px',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              fontSize: 'var(--text-sm)',
              color: 'rgba(52, 211, 153, 1)',
              marginBottom: '16px',
              fontFamily: 'var(--font-sans)'
            }}>
              For DAO Treasuries
            </div>
            <h2 style={{
              fontSize: 'clamp(24px, 3vw, 32px)',
              fontWeight: 700,
              marginBottom: '16px',
              fontFamily: '"Space Grotesk", "Inter", sans-serif'
            }}>Protected Treasury Yield</h2>
            <p style={{ color: 'rgba(161, 161, 170, 1)', fontSize: 'var(--text-lg)', lineHeight: 1.6, fontFamily: 'var(--font-sans)' }}>
              Deploy idle treasury assets into productive DeFi strategies without the existential risk of Impermanent Loss. Predictable returns, zero IL.
            </p>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {['100% IL Protection Guarantee', 'Single-sided deposit options', 'Predictable, stable yield generation'].map((item, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'rgba(214, 211, 209, 1)', fontFamily: 'var(--font-sans)' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'rgba(16, 185, 129, 1)' }} />
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
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 12px',
              borderRadius: '9999px',
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              fontSize: 'var(--text-sm)',
              color: 'rgba(96, 165, 250, 1)',
              marginBottom: '16px',
              fontFamily: 'var(--font-sans)'
            }}>
              For DeFi Protocols
            </div>
            <h2 style={{
              fontSize: 'clamp(24px, 3vw, 32px)',
              fontWeight: 700,
              marginBottom: '16px',
              fontFamily: '"Space Grotesk", "Inter", sans-serif'
            }}>Sustainable Market Depth</h2>
            <p style={{ color: 'rgba(161, 161, 170, 1)', fontSize: 'var(--text-lg)', lineHeight: 1.6, fontFamily: 'var(--font-sans)' }}>
              Bootstrap liquidity without hyper-inflationary token emissions. Pay for IL only when it happens, securing loyal, long-term capital.
            </p>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {['End mercenary capital reliance', 'Lower cost of liquidity acquisition', 'Tradeable IL risk via Vouchers'].map((item, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'rgba(214, 211, 209, 1)', fontFamily: 'var(--font-sans)' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'rgba(59, 130, 246, 1)' }} />
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
        <h2 style={{
          fontSize: 'clamp(24px, 3vw, 32px)',
          fontWeight: 700,
          marginBottom: '16px',
          fontFamily: '"Space Grotesk", "Inter", sans-serif'
        }}>Conduir App Architecture</h2>
        <p style={{
          color: 'rgba(161, 161, 170, 1)',
          maxWidth: '42rem',
          margin: '0 auto',
          fontFamily: 'var(--font-sans)',
          fontSize: 'var(--text-base)'
        }}>A brief overview of the dApp interface designed for institutional users.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-[#0A0B10] border border-white/10 rounded-2xl overflow-hidden flex flex-col">
          <div className="p-4 border-b border-white/10 flex items-center gap-3 bg-white/[0.02]">
            <Wallet className="w-5 h-5 text-emerald-400" />
            <span style={{ fontWeight: 600, fontFamily: 'var(--font-sans)', color: '#FFFFFF' }}>DAO Treasury Vault View</span>
          </div>
          <div className="p-6 flex-1 space-y-4">
            <div className="h-24 rounded-xl bg-white/5 border border-white/5 flex items-center px-6">
              <div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'rgba(161, 161, 170, 1)', marginBottom: '4px', fontFamily: 'var(--font-sans)' }}>Total Protected Value</div>
                <div style={{ fontSize: 'var(--text-2xl)', fontFamily: '"Space Grotesk", "Inter", sans-serif', fontWeight: 700 }}>$24,500,000.00</div>
              </div>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-sm)', color: 'rgba(161, 161, 170, 1)', fontFamily: 'var(--font-sans)', marginBottom: '12px' }}><ChevronRight className="w-4 h-4 text-[#E6007A]" /> Portfolio overview & IL-protected yield metrics</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-sm)', color: 'rgba(161, 161, 170, 1)', fontFamily: 'var(--font-sans)', marginBottom: '12px' }}><ChevronRight className="w-4 h-4 text-[#E6007A]" /> Single-asset deposit flows</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-sm)', color: 'rgba(161, 161, 170, 1)', fontFamily: 'var(--font-sans)' }}><ChevronRight className="w-4 h-4 text-[#E6007A]" /> Historical performance reports</li>
            </ul>
          </div>
        </div>

        <div className="bg-[#0A0B10] border border-white/10 rounded-2xl overflow-hidden flex flex-col">
          <div className="p-4 border-b border-white/10 flex items-center gap-3 bg-white/[0.02]">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            <span style={{ fontWeight: 600, fontFamily: 'var(--font-sans)', color: '#FFFFFF' }}>Protocol Listing View</span>
          </div>
          <div className="p-6 flex-1 space-y-4">
            <div className="h-24 rounded-xl bg-white/5 border border-white/5 flex items-center px-6">
              <div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'rgba(161, 161, 170, 1)', marginBottom: '4px', fontFamily: 'var(--font-sans)' }}>Active IL Liability</div>
                <div style={{ fontSize: 'var(--text-2xl)', fontFamily: '"Space Grotesk", "Inter", sans-serif', fontWeight: 700, color: 'rgba(96, 165, 250, 1)' }}>$1,240,500.00</div>
              </div>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-sm)', color: 'rgba(161, 161, 170, 1)', fontFamily: 'var(--font-sans)', marginBottom: '12px' }}><ChevronRight className="w-4 h-4 text-[#E6007A]" /> Liquidity underwriting interface</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-sm)', color: 'rgba(161, 161, 170, 1)', fontFamily: 'var(--font-sans)', marginBottom: '12px' }}><ChevronRight className="w-4 h-4 text-[#E6007A]" /> IL Voucher management & secondary market</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-sm)', color: 'rgba(161, 161, 170, 1)', fontFamily: 'var(--font-sans)' }}><ChevronRight className="w-4 h-4 text-[#E6007A]" /> Real-time IL liability tracking</li>
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
          <h2 style={{
            fontSize: 'clamp(24px, 3vw, 32px)',
            fontWeight: 700,
            marginBottom: '16px',
            fontFamily: '"Space Grotesk", "Inter", sans-serif'
          }}>Interactive Protocol Flows</h2>
          <p style={{
            color: 'rgba(161, 161, 170, 1)',
            maxWidth: '42rem',
            margin: '0 auto',
            fontFamily: 'var(--font-sans)',
            fontSize: 'var(--text-base)'
          }}>Step through each protocol flow to understand how Conduir separates IL risk from liquidity provision.</p>
        </div>

        {/* Flow Selector */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px', marginBottom: '48px' }}>
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
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                borderRadius: '12px',
                fontWeight: 500,
                transition: 'all 0.2s',
                backgroundColor: activeFlow === flowBtn.key ? flow.color : '#13141C',
                color: activeFlow === flowBtn.key ? '#fff' : 'rgba(161, 161, 170, 1)',
                border: activeFlow === flowBtn.key ? 'none' : '1px solid rgba(255,255,255,0.1)',
                boxShadow: activeFlow === flowBtn.key ? '0 10px 25px rgba(0,0,0,0.3)' : 'none',
                transform: activeFlow === flowBtn.key ? 'scale(1.05)' : 'scale(1)',
                fontFamily: 'var(--font-sans)',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                if (activeFlow !== flowBtn.key) {
                  e.currentTarget.style.color = '#fff';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeFlow !== flowBtn.key) {
                  e.currentTarget.style.color = 'rgba(161, 161, 170, 1)';
                  e.currentTarget.style.background = '#13141C';
                }
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
              <h3 style={{
                fontSize: 'var(--text-lg)',
                fontWeight: 700,
                marginBottom: '24px',
                fontFamily: '"Space Grotesk", "Inter", sans-serif',
                color: '#FFFFFF'
              }}>Flow Steps</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {flow.steps.map((step, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentStep(index)}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '16px',
                      borderRadius: '12px',
                      transition: 'all 0.2s',
                      border: currentStep === index ? '2px solid' : '1px solid rgba(255,255,255,0.05)',
                      borderColor: currentStep === index ? flow.color : undefined,
                      backgroundColor: currentStep === index ? `${flow.color}20` : 'transparent',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-sans)'
                    }}
                    onMouseEnter={(e) => {
                      if (currentStep !== index) {
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (currentStep !== index) {
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                      }
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 700,
                        color: currentStep === index ? '#fff' : 'rgba(107, 114, 128, 1)',
                        backgroundColor: currentStep === index ? flow.color : 'rgba(255,255,255,0.05)',
                        fontFamily: 'var(--font-sans)'
                      }}
                      >
                        {index + 1}
                      </div>
                      <span style={{
                        fontSize: 'var(--text-sm)',
                        fontWeight: 500,
                        color: currentStep === index ? '#fff' : 'rgba(161, 161, 170, 1)',
                        fontFamily: 'var(--font-sans)'
                      }}>
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
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '24px', marginBottom: '32px' }}>
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      backgroundColor: `${flow.color}33`
                    }}
                  >
                    <div style={{ color: flow.color }}>
                      {flow.steps[currentStep].icon}
                    </div>
                  </div>
                  <div>
                    <div style={{
                      fontSize: 'var(--text-sm)',
                      fontWeight: 500,
                      marginBottom: '8px',
                      color: flow.color,
                      fontFamily: 'var(--font-sans)'
                    }}>
                      Step {currentStep + 1} of {flow.steps.length}
                    </div>
                    <h3 style={{
                      fontSize: 'var(--text-2xl)',
                      fontWeight: 700,
                      marginBottom: '12px',
                      fontFamily: '"Space Grotesk", "Inter", sans-serif',
                      color: '#FFFFFF'
                    }}>{flow.steps[currentStep].title}</h3>
                    <p style={{
                      color: 'rgba(161, 161, 170, 1)',
                      lineHeight: 1.6,
                      fontFamily: 'var(--font-sans)'
                    }}>{flow.steps[currentStep].description}</p>
                  </div>
                </div>

                {flow.steps[currentStep].details && (
                  <div style={{ backgroundColor: '#0A0B10', borderRadius: '12px', padding: '24px', marginBottom: '32px' }}>
                    <h4 style={{
                      fontSize: 'var(--text-sm)',
                      fontWeight: 600,
                      color: 'rgba(161, 161, 170, 1)',
                      marginBottom: '16px',
                      fontFamily: 'var(--font-sans)'
                    }}>Key Details</h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {flow.steps[currentStep].details?.map((detail, i) => (
                        <li key={i} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          color: 'rgba(214, 211, 209, 1)',
                          fontFamily: 'var(--font-sans)'
                        }}>
                          <div style={{ width: '6px', height: '6px', borderRadius: '50%', flexShrink: 0, backgroundColor: flow.color }} />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Progress Bar */}
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', color: 'rgba(107, 114, 128, 1)', marginBottom: '8px', fontFamily: 'var(--font-sans)' }}>
                    <span>Progress</span>
                    <span>{Math.round((currentStep + 1) / flow.steps.length * 100)}%</span>
                  </div>
                  <div style={{ height: '8px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '9999px', overflow: 'hidden' }}>
                    <motion.div
                      style={{ height: '100%', borderRadius: '9999px', backgroundColor: flow.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${(currentStep + 1) / flow.steps.length * 100}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>

                {/* Navigation */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <button
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 500,
                      transition: 'all 0.2s',
                      opacity: currentStep === 0 ? 0.5 : 1,
                      cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
                      color: 'rgba(161, 161, 170, 1)',
                      backgroundColor: 'transparent',
                      border: 'none',
                      fontFamily: 'var(--font-sans)'
                    }}
                    onMouseEnter={(e) => {
                      if (currentStep !== 0) {
                        e.currentTarget.style.color = '#fff';
                        e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'rgba(161, 161, 170, 1)';
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>

                  {currentStep === flow.steps.length - 1 ? (
                    <Link
                      to="/app"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '12px 24px',
                        borderRadius: '12px',
                        fontWeight: 500,
                        color: '#fff',
                        backgroundColor: flow.color,
                        textDecoration: 'none',
                        transition: 'transform 0.2s',
                        fontFamily: 'var(--font-sans)'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      Try in dApp <ArrowRight className="w-4 h-4" />
                    </Link>
                  ) : (
                    <button
                      onClick={nextStep}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '12px 24px',
                        borderRadius: '12px',
                        fontWeight: 500,
                        color: '#fff',
                        backgroundColor: flow.color,
                        border: 'none',
                        transition: 'transform 0.2s',
                        fontFamily: 'var(--font-sans)',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
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
