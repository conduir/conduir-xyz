import React, { useState } from 'react';
import { BookOpen, FileText, Code, Shield, Layers, ChevronRight, ArrowRight, AlertTriangle, CheckCircle, ExternalLink, Github, Zap, DoorOpen, Droplets, BarChart2, Ticket, Landmark, Eye, XCircle, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type DocSection = 'introduction' | 'architecture' | 'il-vouchers' | 'matching-engine' | 'smart-contracts' | 'api-reference' | 'protocol-guide' | 'lp-guide';

const SECTION_TITLES: Record<DocSection, string> = {
  'introduction': 'Introduction to Conduir',
  'architecture': 'Protocol Architecture',
  'il-vouchers': 'IL Vouchers',
  'matching-engine': 'Matching Engine',
  'smart-contracts': 'Smart Contracts',
  'api-reference': 'API Reference',
  'protocol-guide': 'Protocol Integration Guide',
  'lp-guide': 'LP Guide',
};

const SECTION_CATEGORIES: Record<string, DocSection[]> = {
  'Getting Started': ['introduction', 'architecture'],
  'Core Concepts': ['il-vouchers', 'matching-engine'],
  'Developers': ['smart-contracts', 'api-reference'],
  'Guides': ['protocol-guide', 'lp-guide'],
};

export default function Docs() {
  const [activeSection, setActiveSection] = useState<DocSection>('introduction');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderSection = () => {
    switch (activeSection) {
      case 'introduction':
        return (
          <div className="space-y-12 text-slate-300 leading-relaxed">
            <section>
              <h2 className="text-[clamp(24px,3vw,32px)] font-bold mb-4 font-display">The Problem with Traditional AMMs</h2>
              <p className="mb-4">
                In traditional Automated Market Makers (AMMs), Liquidity Providers (LPs) are forced to bear the risk of Impermanent Loss. This existential risk makes it difficult for conservative capital, such as DAO Treasuries, to participate in DeFi yield generation.
              </p>
              <p className="mb-4">
                Conversely, protocols seeking to bootstrap liquidity are forced to emit highly inflationary native tokens to attract "mercenary capital"—liquidity that vanishes the moment incentives dry up.
              </p>
            </section>

            <section>
              <h2 className="text-[clamp(24px,3vw,32px)] font-bold mb-4 font-display">The Conduir Solution</h2>
              <p className="mb-4">
                Conduir solves this by decoupling the capital provision from the IL risk. We introduce a matching engine that pairs two distinct types of users:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-6 text-slate-400">
                <li><strong className="text-white">DAO Treasuries (Capital Suppliers):</strong> Provide single-sided or dual-sided liquidity into Conduir Vaults, earning yield with a 100% guarantee against Impermanent Loss.</li>
                <li><strong className="text-white">DeFi Protocols (Risk Underwriters):</strong> Deposit native tokens to underwrite the IL risk of the provided liquidity, securing long-term, stable market depth without hyper-inflationary emissions.</li>
              </ul>
            </section>

            <section className="bg-[#13141C] border border-white/10 p-8 rounded-2xl">
              <h3 className="text-xl font-bold flex items-center gap-3 mb-4 font-display">
                <Layers className="w-6 h-6 text-[#E6007A]" />
                The IL Voucher (ILV)
              </h3>
              <p className="mb-4">
                When a protocol underwrites risk, Conduir mints an ERC-20 token called the <strong>IL Voucher</strong>. This token represents the specific IL risk exposure for that pool.
              </p>
              <p>
                By tokenizing IL risk, Conduir creates a secondary market where risk can be priced, traded, and hedged independently of the underlying liquidity.
              </p>
            </section>

            <section className="bg-gradient-to-r from-[#FF0877]/10 to-[#E6006A]/10 border border-[#FF0877]/20 p-8 rounded-2xl">
              <h3 className="text-xl font-bold flex items-center gap-3 mb-4 font-display">
                <Zap className="w-6 h-6 text-[#FF0877]" />
                Try the Demo
              </h3>
              <p className="mb-4">
                Experience Conduir firsthand on the Polkadot Hub TestNet. Deposit liquidity, observe IL protection in action, and see how protocols can bootstrap stable liquidity.
              </p>
              <a
                href="/app"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#FF0877] to-[#E6006A] text-white font-bold text-sm uppercase tracking-wider hover:shadow-lg hover:shadow-[#FF0877]/25 transition-all"
              >
                Launch dApp <ArrowRight className="w-4 h-4" />
              </a>
            </section>
          </div>
        );

      case 'architecture':
        return (
          <div className="space-y-12 text-slate-300 leading-relaxed">
            <section>
              <h2 className="text-[clamp(24px,3vw,32px)] font-bold mb-4 font-display">System Architecture</h2>
              <p className="mb-6">
                Conduir is built as a modular system of smart contracts on the Polkadot Hub, designed for security, upgradeability, and composability.
              </p>

              <div className="bg-[#13141C] border border-white/10 p-6 rounded-2xl mb-8">
                <pre className="text-sm text-slate-400 overflow-x-auto">
{`contracts/src/
├── Router.sol             -- Main entry point for all user interactions
├── ConstantAMM.sol        -- AMM liquidity pool (x * y = k)
├── ILVault.sol            -- Records positions & calculates IL
├── ILVoucher.sol          -- ERC-20 token representing IL obligation
├── CollateralManager.sol  -- Protocol collateral "bank"
├── OracleAdapter.sol      -- Price & volatility data provider
└── interface/             -- Contract interface definitions`}
                </pre>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-bold mb-4 font-display">Flow Diagram</h3>
              <div className="bg-[#13141C] border border-white/10 p-6 rounded-2xl">
                <pre className="text-sm text-slate-400 overflow-x-auto">
{`[Protocol] -- pay listing fee + collateral --> [Router] --> [CollateralManager]
[LP]       -- deposit tokenA + tokenB -------> [Router] --> [ConstantAMM] (LP Token)
                                                          --> [ILVault]    (mint Voucher)
[LP]       -- withdraw after lock expires ----> [Router] --> [ILVault.settleIL()] --> pay IL
                                                          --> [ConstantAMM.removeLiquidity()]`}
                </pre>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-bold mb-4 font-display">Contract Interactions</h3>
              <div className="grid gap-4">
                {[
                  { name: 'Router', desc: 'Main entry point — validates input and forwards commands', icon: <DoorOpen className="w-6 h-6 text-slate-400" /> },
                  { name: 'ConstantAMM', desc: 'Liquidity pool using constant product formula (x × y = k)', icon: <Droplets className="w-6 h-6 text-slate-400" /> },
                  { name: 'ILVault', desc: "The \"brain\" of IL protection — records positions and calculates IL", icon: <BarChart2 className="w-6 h-6 text-slate-400" /> },
                  { name: 'ILVoucher', desc: "ERC-20 token as proof of IL obligation from Protocol to LP", icon: <Ticket className="w-6 h-6 text-slate-400" /> },
                  { name: 'CollateralManager', desc: 'Stores and manages Protocol collateral deposits', icon: <Landmark className="w-6 h-6 text-slate-400" /> },
                  { name: 'OracleAdapter', desc: 'Provides token prices and volatility data', icon: <Eye className="w-6 h-6 text-slate-400" /> },
                ].map((contract) => (
                  <div key={contract.name} className="stat-cell p-4 flex items-start gap-4">
                    <span className="flex-shrink-0 mt-0.5">{contract.icon}</span>
                    <div>
                      <h4 className="font-bold text-white mb-1">{contract.name}</h4>
                      <p className="text-sm text-slate-400">{contract.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-xl font-bold mb-4 font-display">Deployed Contracts</h3>
              <p className="mb-4 text-slate-400">
                Conduir is deployed on the Polkadot Hub TestNet. View contracts on Blockscout:
              </p>
              <div className="bg-[#13141C] border border-white/10 p-6 rounded-2xl overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-2 text-slate-500 font-medium">Contract</th>
                      <th className="text-left py-2 text-slate-500 font-medium">Address</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-400">
                    <tr className="border-b border-white/5"><td className="py-2">Mock USDC (Listing Token)</td><td className="py-2 font-mono text-xs">0x3186e53cdd421a032ac18bbb0540a35e4cd57413</td></tr>
                    <tr className="border-b border-white/5"><td className="py-2">Mock Token A</td><td className="py-2 font-mono text-xs">0xb40f8d939251377c1b84a833c3be6113b28560d3</td></tr>
                    <tr className="border-b border-white/5"><td className="py-2">Mock Token B</td><td className="py-2 font-mono text-xs">0x024b24bd9689ef58a24ebf28491536321f853fc6</td></tr>
                    <tr className="border-b border-white/5"><td className="py-2">Router</td><td className="py-2 font-mono text-xs">0x17e25f1f032161f6a3438ee01b91be756ec3a6e9</td></tr>
                    <tr className="border-b border-white/5"><td className="py-2">ILVault</td><td className="py-2 font-mono text-xs">0x68dc51f53857343ee09feb44b86772de4c9e89c9</td></tr>
                    <tr className="border-b border-white/5"><td className="py-2">ConstantAMM</td><td className="py-2 font-mono text-xs">0x1508b920fee8dc674ce15b835d95e73166125c81</td></tr>
                    <tr className="border-b border-white/5"><td className="py-2">ILVoucher</td><td className="py-2 font-mono text-xs">0x03a55a333889eacf39a7f92840e8a3153b8d9943</td></tr>
                    <tr className="border-b border-white/5"><td className="py-2">CollateralManager</td><td className="py-2 font-mono text-xs">0xd27dbb83cfc71614ae1b90b8374d0513eabcb8cb</td></tr>
                    <tr><td className="py-2">OracleAdapter</td><td className="py-2 font-mono text-xs">0x6fa61b1ebae12d0b6c77d7aaa45ef3cc3675ed4d</td></tr>
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        );

      case 'il-vouchers':
        return (
          <div className="space-y-12 text-slate-300 leading-relaxed">
            <section>
              <h2 className="text-[clamp(24px,3vw,32px)] font-bold mb-4 font-display">What is an IL Voucher?</h2>
              <p className="mb-6">
                The IL Voucher (ILV) is an ERC-20 token that represents a Protocol's obligation to cover Impermanent Loss for LPs in their pool. When an LP deposits liquidity, an equivalent amount of ILV is minted to the Protocol.
              </p>
              <div className="bg-[#13141C] border border-white/10 p-6 rounded-2xl">
                <h3 className="text-lg font-bold mb-3 font-display text-[#E6007A]">Key Properties</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2"><CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" /><span>Standard ERC-20 token — can be transferred, traded, or held</span></li>
                  <li className="flex items-start gap-2"><CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" /><span>Minted 1:1 with LP's Token A deposit amount</span></li>
                  <li className="flex items-start gap-2"><CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" /><span>Burned upon IL settlement</span></li>
                  <li className="flex items-start gap-2"><CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" /><span>Pool-specific — each AMM pool has unique vouchers</span></li>
                </ul>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-bold mb-4 font-display">IL Voucher Lifecycle</h3>
              <div className="space-y-4">
                {[
                  { step: '1', title: 'LP Deposits', desc: 'LP deposits Token A + Token B into the pool' },
                  { step: '2', title: 'Voucher Minted', desc: 'ILV equal to Token A amount is minted to Protocol' },
                  { step: '3', title: 'Price Moves', desc: 'If price changes, IL is calculated' },
                  { step: '4', title: 'LP Withdraws', desc: 'Voucher is burned, IL paid from Protocol collateral' },
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-4 p-4 stat-cell">
                    <span className="w-8 h-8 rounded-full bg-[#FF0877]/20 flex items-center justify-center text-[#FF0877] font-bold text-sm flex-shrink-0">{item.step}</span>
                    <div>
                      <h4 className="font-bold text-white mb-1">{item.title}</h4>
                      <p className="text-sm text-slate-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-xl font-bold mb-4 font-display">Trading IL Risk</h3>
              <p className="mb-4">
                Since IL Vouchers are standard ERC-20 tokens, they create a secondary market for IL risk:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-6 text-slate-400">
                <li>Protocols can sell vouchers to hedge funds or specialized underwriters</li>
                <li>Market makers can provide liquidity for IL risk exposure</li>
                <li>Derivative products can be built on top of IL Vouchers</li>
              </ul>
              <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-400/80">
                  <strong>Important:</strong> If a Protocol sells/transfers its IL Vouchers, it can no longer settle LP positions. Ensure vouchers are available before withdrawal.
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-bold mb-4 font-display">Voucher vs Traditional Insurance</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-[#13141C] border border-white/10 p-5 rounded-xl">
                  <h4 className="font-bold text-white mb-3">IL Voucher</h4>
                  <ul className="text-sm space-y-2 text-slate-400">
                    <li>• Tokenized, tradeable asset</li>
                    <li>• Automatic settlement</li>
                    <li>• No claims process</li>
                    <li>• Market-driven pricing</li>
                  </ul>
                </div>
                <div className="bg-[#13141C] border border-white/10 p-5 rounded-xl">
                  <h4 className="font-bold text-white mb-3">Traditional Insurance</h4>
                  <ul className="text-sm space-y-2 text-slate-400">
                    <li>• Non-transferable policy</li>
                    <li>• Manual claims required</li>
                    <li>• Subject to underwriter approval</li>
                    <li>• Premium-based pricing</li>
                  </ul>
                </div>
              </div>
            </section>
          </div>
        );

      case 'matching-engine':
        return (
          <div className="space-y-12 text-slate-300 leading-relaxed">
            <section>
              <h2 className="text-[clamp(24px,3vw,32px)] font-bold mb-4 font-display">The Matching Engine</h2>
              <p className="mb-6">
                Conduir's matching engine pairs two types of participants: Capital Suppliers (LPs) and Risk Underwriters (Protocols). This creates a mutually beneficial ecosystem.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold mb-4 font-display">Participant Roles</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 p-6 rounded-2xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-emerald-400" />
                    </div>
                    <h4 className="font-bold text-lg text-emerald-400">LP (Capital Supplier)</h4>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li>• Deposits Token A + Token B liquidity</li>
                    <li>• Earns trading fees from swaps</li>
                    <li>• 100% IL protection guarantee</li>
                    <li>• Lock period: 7-365 days</li>
                    <li>• No counterparty risk needed</li>
                  </ul>
                </div>
                <div className="bg-gradient-to-br from-[#FF0877]/10 to-[#E6006A]/5 border border-[#FF0877]/20 p-6 rounded-2xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#FF0877]/20 flex items-center justify-center">
                      <Zap className="w-5 h-5 text-[#FF0877]" />
                    </div>
                    <h4 className="font-bold text-lg text-[#FF0877]">Protocol (Risk Underwriter)</h4>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li>• Pays listing fee + collateral</li>
                    <li>• Receives IL Vouchers (ERC-20)</li>
                    <li>• Secures long-term liquidity</li>
                    <li>• No token emissions needed</li>
                    <li>• Monthly fee from collateral</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-bold mb-4 font-display">Collateral Tiers</h3>
              <p className="mb-4">
                Protocols are assigned tiers based on pool volatility, determining collateral requirements:
              </p>
              <div className="space-y-3">
                {[
                  { tier: 'TIER 1', volatility: '< 30%', collateral: 'Low collateral requirement', color: 'emerald' },
                  { tier: 'TIER 2', volatility: '30–60%', collateral: 'Medium collateral requirement', color: 'amber' },
                  { tier: 'TIER 3', volatility: '> 60%', collateral: 'High collateral requirement', color: 'red' },
                ].map((t) => (
                  <div key={t.tier} className={`bg-${t.color}-500/10 border border-${t.color}-500/20 p-4 rounded-xl flex items-center justify-between`}>
                    <div className="flex items-center gap-4">
                      <span className={`font-mono text-sm font-bold text-${t.color}-400 px-2 py-1 rounded bg-${t.color}-500/20`}>{t.tier}</span>
                      <span className="text-slate-400">Volatility: {t.volatility}</span>
                    </div>
                    <span className="text-white font-medium">{t.collateral}</span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-xl font-bold mb-4 font-display">Health Ratio System</h3>
              <p className="mb-4">
                The CollateralManager monitors Protocol health to ensure LPs remain protected:
              </p>
              <div className="bg-[#13141C] border border-white/10 p-6 rounded-2xl">
                <pre className="text-sm text-slate-400 mb-4">
{`minimumRequired = matchedTVL * maxILPercentage
healthRatio = (collateralBalance / minimumRequired) * 100%`}
                </pre>
                <div className="grid md:grid-cols-3 gap-4 mt-6">
                  <div className="text-center p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <div className="text-2xl font-bold text-emerald-400 mb-1">≥ 150%</div>
                    <div className="text-sm text-slate-400">HEALTHY</div>
                    <div className="text-xs text-slate-500 mt-1">Can accept new LPs</div>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <div className="text-2xl font-bold text-amber-400 mb-1">100-149%</div>
                    <div className="text-sm text-slate-400">WARNING</div>
                    <div className="text-xs text-slate-500 mt-1">New deposits blocked</div>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                    <div className="text-2xl font-bold text-red-400 mb-1">&lt; 100%</div>
                    <div className="text-sm text-slate-400">CRITICAL</div>
                    <div className="text-xs text-slate-500 mt-1">Matching blocked</div>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-bold mb-4 font-display">Fee Structure</h3>
              <div className="space-y-4">
                <div className="stat-cell p-4">
                  <h4 className="font-bold text-white mb-2">Listing Fee (One-Time)</h4>
                  <p className="text-sm text-slate-400 mb-2">Paid upon protocol registration</p>
                  <div className="text-2xl font-mono text-[#E6007A]">100 USDC</div>
                  <p className="text-xs text-slate-500 mt-1">Sent to Conduir Treasury (non-refundable)</p>
                </div>
                <div className="stat-cell p-4">
                  <h4 className="font-bold text-white mb-2">Monthly Fee</h4>
                  <p className="text-sm text-slate-400 mb-2">Deducted from collateral every 30 days</p>
                  <div className="text-2xl font-mono text-[#E6007A]">10 USDC/month</div>
                  <p className="text-xs text-slate-500 mt-1">Per 1000 USDC of protected TVL</p>
                </div>
              </div>
            </section>
          </div>
        );

      case 'smart-contracts':
        return (
          <div className="space-y-12 text-slate-300 leading-relaxed">
            <section>
              <h2 className="text-[clamp(24px,3vw,32px)] font-bold mb-4 font-display">Smart Contract Overview</h2>
              <p className="mb-6">
                Conduir is built with Solidity 0.8.27 using Foundry. All contracts are designed with security-first principles and have been thoroughly tested.
              </p>
              <a
                href="https://github.com/conduir/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
              >
                <Github className="w-4 h-4" />
                View on GitHub <ExternalLink className="w-3 h-3" />
              </a>
            </section>

            <section>
              <h3 className="text-xl font-bold mb-4 font-display">Contract Functions</h3>

              <div className="space-y-6">
                <div className="bg-[#13141C] border border-white/10 p-6 rounded-2xl">
                  <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#FF0877]"></span>
                    Router.sol
                  </h4>
                  <p className="text-sm text-slate-400 mb-4">Main entry point for all user interactions</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left py-2 text-slate-500">Function</th>
                          <th className="text-left py-2 text-slate-500">Caller</th>
                          <th className="text-left py-2 text-slate-500">Description</th>
                        </tr>
                      </thead>
                      <tbody className="text-slate-400">
                        <tr className="border-b border-white/5"><td className="py-2 font-mono text-xs">setCoreDependencies()</td><td>Admin (once)</td><td>Connects Router to ILVault, CollateralManager, OracleAdapter</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 font-mono text-xs">registerProtocol()</td><td>Protocol</td><td>Register with fee + collateral</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 font-mono text-xs">deposit()</td><td>LP</td><td>Deposit assets with IL protection</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 font-mono text-xs">withdraw()</td><td>LP</td><td>Withdraw + IL payout</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 font-mono text-xs">addPool()</td><td>Admin</td><td>Register new AMM pool</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 font-mono text-xs">removePool()</td><td>Admin</td><td>Deactivate pool (new deposits blocked, withdrawals still allowed)</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 font-mono text-xs">replacePool()</td><td>Admin</td><td>Replace the AMM contract of a problematic pool</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 font-mono text-xs">collectAccruedFee()</td><td>Admin</td><td>Collect monthly fees from Protocol collateral</td></tr>
                        <tr><td className="py-2 font-mono text-xs">pause() / unpause()</td><td>Admin</td><td>Emergency stop for the entire system</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-[#13141C] border border-white/10 p-6 rounded-2xl">
                  <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                    ILVault.sol
                  </h4>
                  <p className="text-sm text-slate-400 mb-4">Records positions and calculates IL</p>
                  <div className="bg-black/30 p-4 rounded-xl mb-4">
                    <p className="text-xs text-slate-500 mb-2">IL Formula:</p>
                    <code className="text-sm text-emerald-400">IL% = (2 * √P / (1 + P)) - 1, where P = currentPrice / entryPrice</code>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left py-2 text-slate-500">Function</th>
                          <th className="text-left py-2 text-slate-500">Description</th>
                        </tr>
                      </thead>
                      <tbody className="text-slate-400">
                        <tr className="border-b border-white/5"><td className="py-2 font-mono text-xs">setAddresses()</td><td>Connects ILVault to ILVoucher, ConstantAMM, Oracle, and CollateralManager. Called by Router (once).</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 font-mono text-xs">recordPosition()</td><td>Record new LP position, mints IL Voucher to Protocol</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 font-mono text-xs">settleIL()</td><td>Calculate and pay IL on withdrawal</td></tr>
                        <tr><td className="py-2 font-mono text-xs">getPosition()</td><td>Retrieve position data by positionId</td></tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4 bg-[#0A0B10] border border-white/10 p-4 rounded-xl">
                    <p className="text-xs text-slate-500 mb-2 font-medium uppercase tracking-wider">Position Statuses</p>
                    <div className="space-y-1 text-sm text-slate-400">
                      <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0"></span><span><strong className="text-white">ACTIVE</strong> — LP has deposited, position is ongoing</span></div>
                      <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0"></span><span><strong className="text-white">SETTLED</strong> — LP has withdrawn, IL calculated and paid</span></div>
                      <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-slate-400 flex-shrink-0"></span><span><strong className="text-white">EXPIRED</strong> — LP has withdrawn, price did not move, IL = 0</span></div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#13141C] border border-white/10 p-6 rounded-2xl">
                  <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                    CollateralManager.sol
                  </h4>
                  <p className="text-sm text-slate-400 mb-4">Manages protocol collateral and health</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left py-2 text-slate-500">Function</th>
                          <th className="text-left py-2 text-slate-500">Description</th>
                        </tr>
                      </thead>
                      <tbody className="text-slate-400">
                        <tr className="border-b border-white/5"><td className="py-2 font-mono text-xs">depositCollateral()</td><td>Add collateral to protocol</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 font-mono text-xs">deductCollateral()</td><td>Pay IL or fees</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 font-mono text-xs">getCollateralHealth()</td><td>Get health ratio</td></tr>
                        <tr><td className="py-2 font-mono text-xs">updateMatchedTVL()</td><td>Update protected TVL</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-bold mb-4 font-display">Important Constraints</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-4 bg-[#13141C] border border-white/10 rounded-xl">
                  <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-white mb-1">One-Time Setup Functions</h4>
                    <p className="text-sm text-slate-400">
                      <code className="text-[#E6007A]">setCoreDependencies()</code>, <code className="text-[#E6007A]">setAuthorizedCallers()</code>, and <code className="text-[#E6007A]">initialize()</code> can only be called once. Additionally, the <code className="text-[#E6007A]">ILVoucher</code> constructor sets <code className="text-[#E6007A]">ilVault</code> as an <code className="text-[#E6007A]">immutable</code> — it cannot be changed after deployment.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-[#13141C] border border-white/10 rounded-xl">
                  <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-white mb-1">Lock Duration Limits</h4>
                    <p className="text-sm text-slate-400">LP deposits must be locked between 7 days (minimum) and 365 days (maximum).</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-[#13141C] border border-white/10 rounded-xl">
                  <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-white mb-1">replacePool() Can Trap LPs</h4>
                    <p className="text-sm text-slate-400">
                      If Admin calls <code className="text-[#E6007A]">replacePool()</code> while LPs are still active in the old pool, those LPs will be unable to withdraw — the Router now points to the new AMM while their LP tokens are from the old one. Perform manual LP migration before replacing the pool contract.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-[#13141C] border border-white/10 rounded-xl">
                  <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-white mb-1">Oracle Must Be Replaced</h4>
                    <p className="text-sm text-slate-400">
                      The current <code className="text-[#E6007A]">OracleAdapter</code> uses manual prices. Replace with Chainlink or Pyth before mainnet.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-bold mb-4 font-display">Test Coverage</h3>
              <p className="mb-4">Conduir has comprehensive test coverage including unit tests and integration tests:</p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="stat-cell p-4 text-center">
                  <div className="text-3xl font-bold text-[#E6007A] mb-1">19+</div>
                  <div className="text-sm text-slate-400">Integration Tests</div>
                </div>
                <div className="stat-cell p-4 text-center">
                  <div className="text-3xl font-bold text-emerald-400 mb-1">100%</div>
                  <div className="text-sm text-slate-400">Core Path Coverage</div>
                </div>
                <div className="stat-cell p-4 text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-1">Foundry</div>
                  <div className="text-sm text-slate-400">Testing Framework</div>
                </div>
              </div>
            </section>
          </div>
        );

      case 'api-reference':
        return (
          <div className="space-y-12 text-slate-300 leading-relaxed">
            <section>
              <h2 className="text-[clamp(24px,3vw,32px)] font-bold mb-4 font-display">API Reference</h2>
              <p className="mb-6">
                Reference for interacting with Conduir smart contracts directly or through the web3 frontend.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold mb-4 font-display">Contract Addresses</h3>
              <div className="bg-[#13141C] border border-white/10 p-6 rounded-2xl overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-2 text-slate-500">Name</th>
                      <th className="text-left py-2 text-slate-500">Address (Polkadot TestNet)</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-400 font-mono text-xs">
                    <tr className="border-b border-white/5"><td className="py-2">Mock USDC (Listing Token)</td><td className="py-2">0x3186e53cdd421a032ac18bbb0540a35e4cd57413</td></tr>
                    <tr className="border-b border-white/5"><td className="py-2">Mock Token A</td><td className="py-2">0xb40f8d939251377c1b84a833c3be6113b28560d3</td></tr>
                    <tr className="border-b border-white/5"><td className="py-2">Mock Token B</td><td className="py-2">0x024b24bd9689ef58a24ebf28491536321f853fc6</td></tr>
                    <tr className="border-b border-white/5"><td className="py-2">Router</td><td className="py-2">0x17e25f1f032161f6a3438ee01b91be756ec3a6e9</td></tr>
                    <tr className="border-b border-white/5"><td className="py-2">ILVault</td><td className="py-2">0x68dc51f53857343ee09feb44b86772de4c9e89c9</td></tr>
                    <tr className="border-b border-white/5"><td className="py-2">ConstantAMM</td><td className="py-2">0x1508b920fee8dc674ce15b835d95e73166125c81</td></tr>
                    <tr className="border-b border-white/5"><td className="py-2">ILVoucher</td><td className="py-2">0x03a55a333889eacf39a7f92840e8a3153b8d9943</td></tr>
                    <tr className="border-b border-white/5"><td className="py-2">CollateralManager</td><td className="py-2">0xd27dbb83cfc71614ae1b90b8374d0513eabcb8cb</td></tr>
                    <tr><td className="py-2">OracleAdapter</td><td className="py-2">0x6fa61b1ebae12d0b6c77d7aaa45ef3cc3675ed4d</td></tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-bold mb-4 font-display">Frontend Hooks</h3>
              <p className="mb-4 text-slate-400">The Conduir frontend provides React hooks for interacting with the protocol:</p>

              <div className="space-y-4">
                <div className="bg-[#13141C] border border-white/10 p-5 rounded-xl">
                  <h4 className="font-bold text-white mb-2 font-mono text-sm">useTokenPrice(address)</h4>
                  <p className="text-sm text-slate-400 mb-3">Fetches the current price of a token from the Oracle.</p>
                  <div className="text-xs text-slate-500">
                    Returns: <code className="text-[#E6007A]">{`{ price, formattedPrice, updatedAt, isLoading, isFetched, error, isDemoMode, refetch }`}</code>
                  </div>
                </div>

                <div className="bg-[#13141C] border border-white/10 p-5 rounded-xl">
                  <h4 className="font-bold text-white mb-2 font-mono text-sm">useUserPositions(address)</h4>
                  <p className="text-sm text-slate-400 mb-3">Fetches all LP positions for a given user address.</p>
                  <div className="text-xs text-slate-500">
                    Returns: <code className="text-[#E6007A]">{`{ positions, isLoading, refetch }`}</code>
                  </div>
                </div>

                <div className="bg-[#13141C] border border-white/10 p-5 rounded-xl">
                  <h4 className="font-bold text-white mb-2 font-mono text-sm">useSettleIL(position)</h4>
                  <p className="text-sm text-slate-400 mb-3">Calculates estimated IL payout for a position (client-side).</p>
                  <div className="text-xs text-slate-500">
                    Returns: <code className="text-[#E6007A]">{`{ estimate, currentPrice, isDemoMode, ilPercentage }`}</code>
                  </div>
                </div>

                <div className="bg-[#13141C] border border-white/10 p-5 rounded-xl">
                  <h4 className="font-bold text-white mb-2 font-mono text-sm">useRouter()</h4>
                  <p className="text-sm text-slate-400 mb-3">Provides write functions for Router interactions.</p>
                  <div className="text-xs text-slate-500">
                    Returns: <code className="text-[#E6007A]">{`{ deposit, withdraw, registerProtocol }`}</code>
                  </div>
                </div>

                <div className="bg-[#13141C] border border-white/10 p-5 rounded-xl">
                  <h4 className="font-bold text-white mb-2 font-mono text-sm">useDepositFlow(userAddress, protocolAddress)</h4>
                  <p className="text-sm text-slate-400 mb-3">State machine hook for the LP deposit flow. Accepts a protocol address to deposit against.</p>
                  <div className="text-xs text-slate-500">
                    Returns: <code className="text-[#E6007A]">{`{ state, balanceA, balanceB, actions }`}</code>
                  </div>
                </div>

                <div className="bg-[#13141C] border border-white/10 p-5 rounded-xl">
                  <h4 className="font-bold text-white mb-2 font-mono text-sm">useRegisterProtocolFlow(userAddress)</h4>
                  <p className="text-sm text-slate-400 mb-3">State machine hook for the Protocol registration flow. Handles USDC approval (listing fee + collateral) and <code className="text-[#E6007A]">registerProtocol</code> call.</p>
                  <div className="text-xs text-slate-500">
                    Returns: <code className="text-[#E6007A]">{`{ state, totalApproval, actions }`}</code>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-bold mb-4 font-display">Key Constants</h3>
              <div className="bg-[#13141C] border border-white/10 p-6 rounded-2xl overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-2 text-slate-500">Constant</th>
                      <th className="text-left py-2 text-slate-500">Value</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-400">
                    <tr className="border-b border-white/5"><td className="py-2">Price Scale</td><td className="py-2 font-mono text-xs">1e18 (18 decimals)</td></tr>
                    <tr className="border-b border-white/5"><td className="py-2">Min Lock Duration</td><td className="py-2 font-mono text-xs">7 days</td></tr>
                    <tr className="border-b border-white/5"><td className="py-2">Max Lock Duration</td><td className="py-2 font-mono text-xs">365 days</td></tr>
                    <tr className="border-b border-white/5"><td className="py-2">Listing Fee</td><td className="py-2 font-mono text-xs">100e18 USDC</td></tr>
                    <tr className="border-b border-white/5"><td className="py-2">Monthly Fee</td><td className="py-2 font-mono text-xs">10e18 USDC</td></tr>
                    <tr><td className="py-2">Epoch Duration</td><td className="py-2 font-mono text-xs">30 days</td></tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-bold mb-4 font-display">Block Explorer</h3>
              <p className="mb-4">View transactions and contract interactions on:</p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://blockscout-testnet.polkadot.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-sm"
                >
                  Blockscout <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href="https://polkadot.testnet.routescan.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-sm"
                >
                  RouteScan <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-bold mb-4 font-display">Resources</h3>
              <div className="space-y-3">
                <a
                  href="https://github.com/conduir/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-[#13141C] border border-white/10 rounded-xl hover:border-[#FF0877]/30 transition-colors"
                >
                  <Github className="w-5 h-5 text-slate-400" />
                  <div>
                    <div className="font-bold text-white">GitHub Repository</div>
                    <div className="text-sm text-slate-400">Smart contracts and frontend code</div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-500 ml-auto" />
                </a>
                <a
                  href="https://polkadot.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-[#13141C] border border-white/10 rounded-xl hover:border-[#FF0877]/30 transition-colors"
                >
                  <BookOpen className="w-5 h-5 text-slate-400" />
                  <div>
                    <div className="font-bold text-white">Polkadot Hub</div>
                    <div className="text-sm text-slate-400">Learn about the underlying blockchain</div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-500 ml-auto" />
                </a>
              </div>
            </section>
          </div>
        );

      case 'protocol-guide':
        return (
          <div className="space-y-12 text-slate-300 leading-relaxed">
            <section>
              <h2 className="text-[clamp(24px,3vw,32px)] font-bold mb-4 font-display">Integrating Conduir into Your Protocol</h2>
              <p className="mb-6">
                This guide walks through the steps a DeFi Protocol takes to offer IL protection to its LPs through Conduir. By registering with Conduir, your protocol secures long-term, stable liquidity without relying on inflationary token emissions.
              </p>
            </section>

            <section className="bg-gradient-to-r from-[#FF0877]/10 to-[#E6006A]/10 border border-[#FF0877]/20 p-6 rounded-2xl">
              <h3 className="text-lg font-bold flex items-center gap-3 mb-4 font-display">
                <Zap className="w-5 h-5 text-[#FF0877]" />
                Using the dApp
              </h3>
              <p className="text-sm text-slate-300 mb-4">Register directly from the Conduir dashboard — no code required:</p>
              <ol className="space-y-2 text-sm text-slate-400">
                <li className="flex items-start gap-2"><span className="text-[#FF0877] font-bold flex-shrink-0">1.</span> Connect your wallet to Polkadot Hub TestNet</li>
                <li className="flex items-start gap-2"><span className="text-[#FF0877] font-bold flex-shrink-0">2.</span> Switch to the <strong className="text-white">Protocol</strong> tab in the dashboard</li>
                <li className="flex items-start gap-2"><span className="text-[#FF0877] font-bold flex-shrink-0">3.</span> Click <strong className="text-white">Register Protocol</strong> and enter your initial collateral amount</li>
                <li className="flex items-start gap-2"><span className="text-[#FF0877] font-bold flex-shrink-0">4.</span> Approve USDC (listing fee + collateral in one transaction)</li>
                <li className="flex items-start gap-2"><span className="text-[#FF0877] font-bold flex-shrink-0">5.</span> Confirm registration — your protocol is now live</li>
              </ol>
              <a href="/app" className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF0877] to-[#E6006A] text-white font-bold text-sm uppercase tracking-wider hover:shadow-lg hover:shadow-[#FF0877]/25 transition-all">
                Open Dashboard <ArrowRight className="w-4 h-4" />
              </a>
            </section>

            <section>
              <h3 className="text-xl font-bold mb-4 font-display">Understanding the Fund Flows</h3>
              <p className="mb-4">Before registering, understand the two types of payments charged to your protocol:</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-[#13141C] border border-white/10 p-5 rounded-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="w-5 h-5 text-[#E6007A]" />
                    <h4 className="font-bold text-white">Listing Fee (One-Time)</h4>
                  </div>
                  <ul className="text-sm space-y-1 text-slate-400">
                    <li>• Paid once upon registration</li>
                    <li>• Sent directly to Conduir Treasury</li>
                    <li>• Non-refundable</li>
                    <li>• Amount: 100 USDC</li>
                  </ul>
                </div>
                <div className="bg-[#13141C] border border-white/10 p-5 rounded-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <Landmark className="w-5 h-5 text-blue-400" />
                    <h4 className="font-bold text-white">Initial Collateral</h4>
                  </div>
                  <ul className="text-sm space-y-1 text-slate-400">
                    <li>• Held in CollateralManager</li>
                    <li>• Deducted to pay LP IL compensation</li>
                    <li>• Deducted monthly as platform fee (10 USDC per 1000 USDC TVL)</li>
                    <li>• Must stay healthy (≥ 150% ratio)</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-bold mb-4 font-display">Registration Steps</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 stat-cell">
                  <span className="w-8 h-8 rounded-full bg-[#FF0877]/20 flex items-center justify-center text-[#FF0877] font-bold text-sm flex-shrink-0">1</span>
                  <div className="flex-1">
                    <h4 className="font-bold text-white mb-2">Approve Token</h4>
                    <p className="text-sm text-slate-400 mb-2">Approve the Router to spend your listing fee + initial collateral:</p>
                    <div className="bg-black/30 p-3 rounded-xl">
                      <code className="text-xs text-emerald-400">{`IERC20(feeToken).approve(address(router), listingFeeAmount + initialCollateral);`}</code>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 stat-cell">
                  <span className="w-8 h-8 rounded-full bg-[#FF0877]/20 flex items-center justify-center text-[#FF0877] font-bold text-sm flex-shrink-0">2</span>
                  <div className="flex-1">
                    <h4 className="font-bold text-white mb-2">Register Protocol</h4>
                    <p className="text-sm text-slate-400 mb-2">Register with the pool ID you want to associate with your protocol:</p>
                    <div className="bg-black/30 p-3 rounded-xl">
                      <code className="text-xs text-emerald-400">{`router.registerProtocol(poolId, initialCollateral);`}</code>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">After this: listing fee goes to treasury, collateral is stored in CollateralManager, and your protocol is assigned a tier (TIER_1/2/3) based on pool volatility from the Oracle.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 stat-cell">
                  <span className="w-8 h-8 rounded-full bg-[#FF0877]/20 flex items-center justify-center text-[#FF0877] font-bold text-sm flex-shrink-0">3</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-white">Receive IL Vouchers</h4>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">Automatic</span>
                    </div>
                    <p className="text-sm text-slate-400">Whenever an LP deposits into your pool, you automatically receive IL Vouchers equal to the LP's Token A deposit amount. No action required.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 stat-cell">
                  <span className="w-8 h-8 rounded-full bg-[#FF0877]/20 flex items-center justify-center text-[#FF0877] font-bold text-sm flex-shrink-0">4</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-white">Pay Monthly Fee</h4>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">Automatic</span>
                    </div>
                    <p className="text-sm text-slate-400">Every 30 days, the Conduir Admin collects a monthly fee from your collateral. No action required — just ensure your collateral balance stays healthy.</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-bold mb-4 font-display">Maintaining Collateral Health</h3>
              <p className="mb-4 text-slate-400">Keep your collateral health above 150% to continue accepting new LPs. Top up collateral at any time:</p>
              <div className="bg-[#13141C] border border-white/10 p-4 rounded-xl mb-4">
                <code className="text-xs text-emerald-400">{`IERC20(feeToken).approve(address(router), topUpAmount);\nrouter.depositCollateral(topUpAmount);`}</code>
              </div>
              <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-400/80">
                  <strong>Important:</strong> Do not transfer or sell your IL Vouchers. If your protocol no longer holds the vouchers, LPs will be unable to withdraw and the transaction will revert.
                </p>
              </div>
            </section>
          </div>
        );

      case 'lp-guide':
        return (
          <div className="space-y-12 text-slate-300 leading-relaxed">
            <section>
              <h2 className="text-[clamp(24px,3vw,32px)] font-bold mb-4 font-display">Depositing Liquidity with IL Protection</h2>
              <p className="mb-6">
                This guide walks through how an LP deposits assets into a Conduir pool and receives a guarantee against Impermanent Loss. Your IL is covered by the Protocol's collateral — automatically, with no claims process.
              </p>
            </section>

            <section className="bg-gradient-to-r from-[#FF0877]/10 to-[#E6006A]/10 border border-[#FF0877]/20 p-6 rounded-2xl">
              <h3 className="text-lg font-bold flex items-center gap-3 mb-4 font-display">
                <Zap className="w-5 h-5 text-[#FF0877]" />
                Using the dApp
              </h3>
              <p className="text-sm text-slate-300 mb-4">Deposit directly from the Conduir dashboard — no code required:</p>
              <ol className="space-y-2 text-sm text-slate-400">
                <li className="flex items-start gap-2"><span className="text-[#FF0877] font-bold flex-shrink-0">1.</span> Connect your wallet to Polkadot Hub TestNet</li>
                <li className="flex items-start gap-2"><span className="text-[#FF0877] font-bold flex-shrink-0">2.</span> Stay on the <strong className="text-white">LP</strong> tab and click <strong className="text-white">Deposit into Pool</strong></li>
                <li className="flex items-start gap-2"><span className="text-[#FF0877] font-bold flex-shrink-0">3.</span> Enter Token A and Token B amounts, set your lock duration</li>
                <li className="flex items-start gap-2"><span className="text-[#FF0877] font-bold flex-shrink-0">4.</span> Approve Token A and Token B (the dApp handles the protocol address for you)</li>
                <li className="flex items-start gap-2"><span className="text-[#FF0877] font-bold flex-shrink-0">5.</span> Confirm deposit — your position is now IL-protected</li>
              </ol>
              <a href="/app" className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF0877] to-[#E6006A] text-white font-bold text-sm uppercase tracking-wider hover:shadow-lg hover:shadow-[#FF0877]/25 transition-all">
                Open Dashboard <ArrowRight className="w-4 h-4" />
              </a>
            </section>

            <section>
              <h3 className="text-xl font-bold mb-4 font-display">Steps</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 stat-cell">
                  <span className="w-8 h-8 rounded-full bg-[#FF0877]/20 flex items-center justify-center text-[#FF0877] font-bold text-sm flex-shrink-0">1</span>
                  <div className="flex-1">
                    <h4 className="font-bold text-white mb-2">Approve Tokens</h4>
                    <p className="text-sm text-slate-400 mb-2">Approve the Router to spend your Token A and Token B:</p>
                    <div className="bg-black/30 p-3 rounded-xl">
                      <code className="text-xs text-emerald-400">{`IERC20(tokenA).approve(address(router), amountA);\nIERC20(tokenB).approve(address(router), amountB);`}</code>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 stat-cell">
                  <span className="w-8 h-8 rounded-full bg-[#FF0877]/20 flex items-center justify-center text-[#FF0877] font-bold text-sm flex-shrink-0">2</span>
                  <div className="flex-1">
                    <h4 className="font-bold text-white mb-2">Deposit to Pool</h4>
                    <p className="text-sm text-slate-400 mb-2">Deposit into the pool with a lock duration (7–365 days):</p>
                    <div className="bg-black/30 p-3 rounded-xl">
                      <code className="text-xs text-emerald-400">{`// lockDuration in seconds (min 7 days, max 365 days)\n// protocolAddress: a registered protocol — the dApp selects this for you\nrouter.deposit(poolId, protocolAddress, amountA, amountB, lockDuration);`}</code>
                    </div>
                    <div className="mt-3 bg-[#0A0B10] border border-white/10 p-3 rounded-xl">
                      <p className="text-xs text-slate-500 mb-1 font-medium uppercase tracking-wider">After deposit you receive:</p>
                      <ul className="text-xs text-slate-400 space-y-1">
                        <li>• LP Tokens from ConstantAMM as proof of pool ownership</li>
                        <li>• Position recorded in ILVault with your entry price saved</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 stat-cell">
                  <span className="w-8 h-8 rounded-full bg-[#FF0877]/20 flex items-center justify-center text-[#FF0877] font-bold text-sm flex-shrink-0">3</span>
                  <div className="flex-1">
                    <h4 className="font-bold text-white mb-2">Wait for Lock Period</h4>
                    <p className="text-sm text-slate-400 mb-3">You cannot withdraw before the lock period expires. The lock is chosen at deposit time.</p>
                    <div className="flex gap-4">
                      <div className="text-center p-3 rounded-xl bg-[#13141C] border border-white/10 flex-1">
                        <div className="font-bold text-white">7 days</div>
                        <div className="text-xs text-slate-500">Minimum</div>
                      </div>
                      <div className="text-center p-3 rounded-xl bg-[#13141C] border border-white/10 flex-1">
                        <div className="font-bold text-white">365 days</div>
                        <div className="text-xs text-slate-500">Maximum</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 stat-cell">
                  <span className="w-8 h-8 rounded-full bg-[#FF0877]/20 flex items-center justify-center text-[#FF0877] font-bold text-sm flex-shrink-0">4</span>
                  <div className="flex-1">
                    <h4 className="font-bold text-white mb-2">Withdraw</h4>
                    <p className="text-sm text-slate-400 mb-2">Approve your LP tokens to the Router, then withdraw:</p>
                    <div className="bg-black/30 p-3 rounded-xl">
                      <code className="text-xs text-emerald-400">{`// positionIndex: order of position in your array (0-based)\n// lpAmount: amount of LP tokens to redeem\nIERC20(lpToken).approve(address(router), lpAmount);\nrouter.withdraw(positionIndex, lpAmount);`}</code>
                    </div>
                    <div className="mt-3 bg-[#0A0B10] border border-white/10 p-3 rounded-xl">
                      <p className="text-xs text-slate-500 mb-1 font-medium uppercase tracking-wider">After withdrawal you receive:</p>
                      <ul className="text-xs text-slate-400 space-y-1">
                        <li>• Token A + Token B returned from the pool</li>
                        <li>• Additional IL payment (if price moved) from Protocol collateral</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-bold mb-4 font-display">Token Approval Summary</h3>
              <div className="bg-[#13141C] border border-white/10 p-6 rounded-2xl overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-2 text-slate-500">Action</th>
                      <th className="text-left py-2 text-slate-500">Approval Required</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-400 font-mono text-xs">
                    <tr className="border-b border-white/5"><td className="py-2">deposit()</td><td className="py-2">tokenA.approve(router, amountA) + tokenB.approve(router, amountB)</td></tr>
                    <tr className="border-b border-white/5"><td className="py-2">withdraw()</td><td className="py-2">lpToken.approve(router, lpAmount)</td></tr>
                    <tr><td className="py-2">registerProtocol()</td><td className="py-2">mockUsdc.approve(router, listingFee + initialCollateral)</td></tr>
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        );
    }
  };

  const getCategory = (section: DocSection): string | null => {
    for (const [category, sections] of Object.entries(SECTION_CATEGORIES)) {
      if (sections.includes(section)) return category;
    }
    return null;
  };

  const getCurrentCategory = () => getCategory(activeSection) ?? 'Getting Started';

  return (
    <div className="pt-20 min-h-screen bg-[#0A0B10] flex flex-col md:flex-row">
      {/* Mobile section picker */}
      <div className="md:hidden sticky top-20 z-30 bg-[#0A0B10] border-b border-white/10 px-4 py-3">
        <button
          onClick={() => setSidebarOpen(o => !o)}
          className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-[#13141C] border border-white/10 text-sm text-white"
        >
          <span className="font-medium">{SECTION_TITLES[activeSection]}</span>
          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${sidebarOpen ? 'rotate-180' : ''}`} />
        </button>
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden mt-2 rounded-xl bg-[#13141C] border border-white/10"
            >
              {Object.entries(SECTION_CATEGORIES).map(([category, sections]) => (
                <div key={category} className="px-3 py-2">
                  <div className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider px-2 py-1">{category}</div>
                  {sections.map((section) => {
                    const titles: Record<DocSection, string> = {
                      'introduction': 'Introduction', 'architecture': 'Architecture',
                      'il-vouchers': 'IL Vouchers', 'matching-engine': 'Matching Engine',
                      'smart-contracts': 'Smart Contracts', 'api-reference': 'API Reference',
                      'protocol-guide': 'Protocol Integration', 'lp-guide': 'LP Guide',
                    };
                    return (
                      <button
                        key={section}
                        onClick={() => { setActiveSection(section); setSidebarOpen(false); }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          activeSection === section ? 'text-white bg-white/5' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {titles[section]}
                      </button>
                    );
                  })}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-shrink-0 border-r border-white/10 bg-[#13141C] p-6 flex-col gap-6">
        {Object.entries(SECTION_CATEGORIES).map(([category, sections]) => (
          <div key={category} className="space-y-1">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">{category}</div>
            {sections.map((section) => {
              const icons: Record<DocSection, React.ReactNode> = {
                'introduction': <BookOpen className="w-4 h-4" />,
                'architecture': <Layers className="w-4 h-4" />,
                'il-vouchers': <FileText className="w-4 h-4" />,
                'matching-engine': <Shield className="w-4 h-4" />,
                'smart-contracts': <Code className="w-4 h-4" />,
                'api-reference': <Code className="w-4 h-4" />,
                'protocol-guide': <Zap className="w-4 h-4" />,
                'lp-guide': <BookOpen className="w-4 h-4" />,
              };
              const titles: Record<DocSection, string> = {
                'introduction': 'Introduction',
                'architecture': 'Architecture',
                'il-vouchers': 'IL Vouchers',
                'matching-engine': 'Matching Engine',
                'smart-contracts': 'Smart Contracts',
                'api-reference': 'API Reference',
                'protocol-guide': 'Protocol Integration',
                'lp-guide': 'LP Guide',
              };
              return (
                <button
                  key={section}
                  onClick={() => setActiveSection(section)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    activeSection === section
                      ? 'bg-white/5 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {icons[section]}
                  {titles[section]}
                </button>
              );
            })}
          </div>
        ))}
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 lg:p-20 overflow-y-auto">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-sm text-[#E6007A] font-medium mb-4">
            Docs <ChevronRight className="w-4 h-4" /> {getCurrentCategory()} <ChevronRight className="w-4 h-4" /> {SECTION_TITLES[activeSection]}
          </div>

          <h1 className="text-[clamp(36px,5vw,48px)] font-bold mb-6 font-display">{SECTION_TITLES[activeSection]}</h1>

          {renderSection()}

          <div className="flex justify-between items-center pt-8 border-t border-white/10 mt-16">
            <button
              onClick={() => {
                const sections = Object.keys(SECTION_TITLES) as DocSection[];
                const idx = sections.indexOf(activeSection);
                if (idx > 0) setActiveSection(sections[idx - 1]);
              }}
              disabled={activeSection === 'introduction'}
              className={`flex items-center gap-2 font-medium transition-colors ${
                activeSection === 'introduction'
                  ? 'text-slate-600 cursor-not-allowed'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              Previous
            </button>
            <button
              onClick={() => {
                const sections = Object.keys(SECTION_TITLES) as DocSection[];
                const idx = sections.indexOf(activeSection);
                if (idx < sections.length - 1) setActiveSection(sections[idx + 1]);
              }}
              disabled={activeSection === 'lp-guide'}
              className={`flex items-center gap-2 font-medium transition-colors ${
                activeSection === 'lp-guide'
                  ? 'text-slate-600 cursor-not-allowed'
                  : 'text-[#E6007A] hover:text-[#C20066]'
              }`}
            >
              {activeSection === 'introduction' ? 'Get Started' : `Next: ${SECTION_TITLES[Object.keys(SECTION_TITLES)[Object.keys(SECTION_TITLES).indexOf(activeSection) + 1] as DocSection]}`}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
