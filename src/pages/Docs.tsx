import React from 'react';
import { BookOpen, FileText, Code, Shield, Layers, ChevronRight } from 'lucide-react';

export default function Docs() {
  return (
    <div className="pt-20 min-h-screen bg-[#0A0B10] flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 border-r border-white/10 bg-[#13141C] p-6 flex flex-col gap-8">
        <div className="space-y-2">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Getting Started</div>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium bg-white/5 text-white transition-colors">
            <BookOpen className="w-4 h-4" />
            Introduction
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
            <Layers className="w-4 h-4" />
            Architecture
          </button>
        </div>

        <div className="space-y-2">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Core Concepts</div>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
            <Shield className="w-4 h-4" />
            IL Vouchers
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
            <FileText className="w-4 h-4" />
            Matching Engine
          </button>
        </div>

        <div className="space-y-2">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Developers</div>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
            <Code className="w-4 h-4" />
            Smart Contracts
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
            <Code className="w-4 h-4" />
            API Reference
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 lg:p-20 overflow-y-auto">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-sm text-[#E6007A] font-medium mb-4">
            Docs <ChevronRight className="w-4 h-4" /> Getting Started <ChevronRight className="w-4 h-4" /> Introduction
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold font-display mb-6">Introduction to Conduir</h1>
          <p className="text-xl text-slate-400 leading-relaxed mb-12">
            Conduir is a liquidity infrastructure primitive built for the Polkadot Hub that separates Impermanent Loss (IL) risk from liquidity provision.
          </p>

          <div className="space-y-12 text-slate-300 leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">The Problem with Traditional AMMs</h2>
              <p className="mb-4">
                In traditional Automated Market Makers (AMMs), Liquidity Providers (LPs) are forced to bear the risk of Impermanent Loss. This existential risk makes it difficult for conservative capital, such as DAO Treasuries, to participate in DeFi yield generation.
              </p>
              <p className="mb-4">
                Conversely, protocols seeking to bootstrap liquidity are forced to emit highly inflationary native tokens to attract "mercenary capital"—liquidity that vanishes the moment incentives dry up.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">The Conduir Solution</h2>
              <p className="mb-4">
                Conduir solves this by decoupling the capital provision from the IL risk. We introduce a matching engine that pairs two distinct types of users:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-6 text-slate-400">
                <li><strong className="text-white">DAO Treasuries (Capital Suppliers):</strong> Provide single-sided or dual-sided liquidity into Conduir Vaults, earning yield with a 100% guarantee against Impermanent Loss.</li>
                <li><strong className="text-white">DeFi Protocols (Risk Underwriters):</strong> Deposit native tokens to underwrite the IL risk of the provided liquidity, securing long-term, stable market depth without hyper-inflationary emissions.</li>
              </ul>
            </section>

            <section className="bg-[#13141C] border border-white/10 p-8 rounded-2xl">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
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

            <div className="flex justify-between items-center pt-8 border-t border-white/10 mt-16">
              <button className="text-slate-500 cursor-not-allowed flex items-center gap-2">
                Previous
              </button>
              <button className="text-[#E6007A] hover:text-[#C20066] font-medium flex items-center gap-2 transition-colors">
                Next: Architecture <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
