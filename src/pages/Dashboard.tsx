import React, { useState } from 'react';
import { Wallet, BarChart3, ArrowRight, Shield, Layers, History, Settings, Bell, Search, ShieldCheck, FileSignature, Clock, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const liquidityData = [
  { name: 'Oct', value: 4000000 },
  { name: 'Nov', value: 6500000 },
  { name: 'Dec', value: 8200000 },
  { name: 'Jan', value: 12000000 },
  { name: 'Feb', value: 15500000 },
  { name: 'Mar', value: 18200000 },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'treasury' | 'protocol' | 'vouchers' | 'approvals' | 'history' | 'settings'>('treasury');

  return (
    <div className="pt-20 min-h-screen bg-[#0A0B10] flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 border-r border-white/10 bg-[#13141C] p-6 flex flex-col gap-8">
        <div className="space-y-2">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Views</div>
          <button 
            onClick={() => setActiveTab('treasury')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'treasury' ? 'bg-[#E6007A]/10 text-[#E6007A]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
          >
            <Wallet className="w-4 h-4" />
            DAO Treasury
          </button>
          <button 
            onClick={() => setActiveTab('protocol')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'protocol' ? 'bg-blue-500/10 text-blue-400' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
          >
            <BarChart3 className="w-4 h-4" />
            Protocol Vaults
          </button>
        </div>

        <div className="space-y-2">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Manage</div>
          <button 
            onClick={() => setActiveTab('approvals')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'approvals' ? 'bg-emerald-500/10 text-emerald-400' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
          >
            <div className="flex items-center gap-3">
              <FileSignature className="w-4 h-4" />
              Safe Queue
            </div>
            <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">2</span>
          </button>
          <button 
            onClick={() => setActiveTab('vouchers')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'vouchers' ? 'bg-purple-500/10 text-purple-400' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
          >
            <Layers className="w-4 h-4" />
            IL Vouchers
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'history' ? 'bg-orange-500/10 text-orange-400' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
          >
            <History className="w-4 h-4" />
            Tx History
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'settings' ? 'bg-slate-500/10 text-slate-300' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
          >
            <Settings className="w-4 h-4" />
            Settings
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <header className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-2xl font-bold font-display">
              {activeTab === 'treasury' && 'Treasury Vaults'}
              {activeTab === 'protocol' && 'Protocol Underwriting'}
              {activeTab === 'approvals' && 'Multi-sig Approvals'}
              {activeTab === 'vouchers' && 'IL Voucher Engine'}
              {activeTab === 'history' && 'Transaction History'}
              {activeTab === 'settings' && 'Settings'}
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              {activeTab === 'treasury' && 'Deposit single-sided assets via the Vault Router for continuous yield.'}
              {activeTab === 'protocol' && 'Register vaults, pay listing fees, and deposit collateral to mint IL Vouchers.'}
              {activeTab === 'approvals' && 'Review and sign pending transactions in your DAO\'s Safe queue.'}
              {activeTab === 'vouchers' && 'View the lifecycle of minted ERC-20 IL Vouchers (Active, Redeemed, Expired).'}
              {activeTab === 'history' && 'Review your past deposits, withdrawals, and underwriting activity.'}
              {activeTab === 'settings' && 'Manage your account preferences and notifications.'}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
              <Bell className="w-4 h-4" />
            </button>
            {/* Institutional Safe Wallet Indicator */}
            <button className="bg-[#13141C] border border-white/20 pl-3 pr-4 py-2 rounded-xl text-sm font-medium flex items-center gap-3 hover:bg-white/5 transition-colors text-left">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-0.5">Safe Multi-sig</span>
                <span className="leading-none text-white flex items-center gap-2">
                  0x71C...9A23 <span className="text-slate-500 text-xs font-normal">(3/5 Signers)</span>
                </span>
              </div>
            </button>
          </div>
        </header>

        {activeTab === 'treasury' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#13141C] border border-white/10 p-6 rounded-2xl">
                <div className="text-sm text-slate-400 mb-2">Total Protected Value</div>
                <div className="text-3xl font-display font-bold">$24,500,000.00</div>
                <div className="text-emerald-400 text-sm mt-2 flex items-center gap-1">
                  +2.4% <span className="text-slate-500">vs last month</span>
                </div>
              </div>
              <div className="bg-[#13141C] border border-white/10 p-6 rounded-2xl">
                <div className="text-sm text-slate-400 mb-2">Average APY (Trading Fees)</div>
                <div className="text-3xl font-display font-bold text-[#E6007A]">12.4%</div>
                <div className="text-slate-500 text-sm mt-2">Continuous Yield Stream</div>
              </div>
              <div className="bg-[#13141C] border border-white/10 p-6 rounded-2xl">
                <div className="text-sm text-slate-400 mb-2">Active Receipt Tokens</div>
                <div className="text-3xl font-display font-bold">4</div>
                <div className="text-slate-500 text-sm mt-2">Across 3 Protocol Vaults</div>
              </div>
            </div>

            {/* Vaults List */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Available Protocol Vaults</h2>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input 
                    type="text" 
                    placeholder="Search vaults..." 
                    className="bg-[#13141C] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-[#E6007A]/50 transition-colors w-64"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                {[
                  { asset: 'DOT', protocol: 'HydraDX', apy: '14.2%', capacity: '$12.4M / $15M', risk: 'Low' },
                  { asset: 'USDT', protocol: 'ArthSwap', apy: '18.5%', capacity: '$4.2M / $5M', risk: 'Medium' },
                  { asset: 'ETH', protocol: 'StellaSwap', apy: '16.8%', capacity: '$8.1M / $10M', risk: 'Low' },
                ].map((vault, i) => (
                  <div key={i} className="bg-[#13141C] border border-white/10 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 hover:border-white/20 transition-colors">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                      <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                        <Layers className="w-6 h-6 text-[#E6007A]" />
                      </div>
                      <div>
                        <div className="font-bold text-lg">Single-sided {vault.asset}</div>
                        <div className="text-sm text-slate-400">Routed to {vault.protocol} Vault</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-8 w-full md:w-auto text-center md:text-left">
                      <div>
                        <div className="text-xs text-slate-500 mb-1">Protected APY</div>
                        <div className="font-bold text-emerald-400">{vault.apy}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 mb-1">Vault Capacity</div>
                        <div className="font-bold">{vault.capacity}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 mb-1">Risk Profile</div>
                        <div className="font-bold text-slate-300">{vault.risk}</div>
                      </div>
                    </div>

                    <button className="w-full md:w-auto bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2">
                      <FileSignature className="w-4 h-4" /> Propose Deposit
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'protocol' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            {/* Protocol Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#13141C] border border-white/10 p-6 rounded-2xl">
                <div className="text-sm text-slate-400 mb-2">Active IL Liability</div>
                <div className="text-3xl font-display font-bold text-blue-400">$1,240,500.00</div>
                <div className="text-slate-500 text-sm mt-2">Underwritten across 2 vaults</div>
              </div>
              <div className="bg-[#13141C] border border-white/10 p-6 rounded-2xl">
                <div className="text-sm text-slate-400 mb-2">Secured Liquidity</div>
                <div className="text-3xl font-display font-bold">$18,200,000.00</div>
                <div className="text-emerald-400 text-sm mt-2 flex items-center gap-1">
                  +12.4% <span className="text-slate-500">vs last month</span>
                </div>
              </div>
              <div className="bg-[#13141C] border border-white/10 p-6 rounded-2xl">
                <div className="text-sm text-slate-400 mb-2">Fees Paid to Splitter</div>
                <div className="text-3xl font-display font-bold">$45,200</div>
                <div className="text-slate-500 text-sm mt-2">40% Upfront / 60% Accrued</div>
              </div>
            </div>

            {/* Chart Section */}
            <div className="bg-[#13141C] border border-white/10 p-6 rounded-2xl">
              <h3 className="text-lg font-bold mb-6">Secured Liquidity Trend</h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={liquidityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="name" stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false} dy={10} />
                    <YAxis stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false} tickFormatter={(value) => `$${value / 1000000}M`} dx={-10} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0A0B10', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                      itemStyle={{ color: '#3b82f6', fontWeight: 'bold' }}
                      formatter={(value) => [`$${(value as number).toLocaleString()}`, 'Liquidity']}
                      labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
                    />
                    <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#13141C', stroke: '#3b82f6', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, fill: '#3b82f6', stroke: '#fff' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Underwriting Section */}
            <div className="bg-[#13141C] border border-white/10 p-8 rounded-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Register Protocol Vault</h2>
                  <p className="text-sm text-slate-400">Pay listing fee and deposit native collateral to mint IL Vouchers.</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Target Pair</label>
                    <select className="w-full bg-[#0A0B10] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50">
                      <option>DOT / USDC</option>
                      <option>ASTR / DOT</option>
                      <option>GLMR / USDC</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Collateral Deposit (Native Token)</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="0.00" 
                        className="w-full bg-[#0A0B10] border border-white/10 rounded-xl pl-4 pr-16 py-3 text-white focus:outline-none focus:border-blue-500/50"
                      />
                      <button className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-1 rounded">MAX</button>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#0A0B10] border border-white/10 rounded-xl p-6 flex flex-col justify-center">
                  <div className="flex justify-between items-center mb-3 text-sm">
                    <span className="text-slate-400">Listing Fee + Premium</span>
                    <span className="font-bold text-slate-300">2,500 USDC</span>
                  </div>
                  <div className="flex justify-between items-center mb-3 text-sm">
                    <span className="text-slate-400">Fee Split</span>
                    <span className="font-bold text-slate-300">40% Upfront / 60% Accrued</span>
                  </div>
                  <div className="flex justify-between items-center mb-6 text-sm pt-3 border-t border-white/10">
                    <span className="text-slate-400">Vouchers to Mint</span>
                    <span className="font-bold text-blue-400">450 ILV</span>
                  </div>
                  <button className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-4 rounded-xl font-bold transition-colors shadow-[0_0_20px_rgba(59,130,246,0.2)] flex items-center justify-center gap-2">
                    <FileSignature className="w-4 h-4" /> Propose Registration via Safe
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'approvals' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-[#13141C] border border-white/10 rounded-2xl p-8 text-center mb-6">
              <ShieldCheck className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Safe Multi-sig Queue</h2>
              <p className="text-slate-400 max-w-lg mx-auto">
                Transactions proposed via the Conduir dApp are sent to your DAO's Safe. They require 3 out of 5 signatures to execute on-chain.
              </p>
            </div>

            <div className="space-y-4">
              {[
                { id: 'tx-892', action: 'Deposit 50,000 DOT', target: 'HydraDX Vault Router', status: '2/5 Signatures', time: '2 hours ago', ready: false },
                { id: 'tx-891', action: 'Register Protocol Vault', target: 'IL Voucher Engine', status: '3/5 Signatures', time: '5 hours ago', ready: true },
              ].map((tx, i) => (
                <div key={i} className="bg-[#13141C] border border-white/10 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border ${tx.ready ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-orange-500/10 border-orange-500/20'}`}>
                      {tx.ready ? <CheckCircle2 className="w-6 h-6 text-emerald-500" /> : <Clock className="w-6 h-6 text-orange-500" />}
                    </div>
                    <div>
                      <div className="font-bold text-lg">{tx.action}</div>
                      <div className="text-sm text-slate-400">Target: {tx.target}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-8 w-full md:w-auto">
                    <div className="text-center md:text-left">
                      <div className="text-xs text-slate-500 mb-1">Status</div>
                      <div className={`font-bold ${tx.ready ? 'text-emerald-400' : 'text-orange-400'}`}>{tx.status}</div>
                    </div>
                    <div className="text-center md:text-left hidden sm:block">
                      <div className="text-xs text-slate-500 mb-1">Proposed</div>
                      <div className="font-medium text-slate-300">{tx.time}</div>
                    </div>
                    {tx.ready ? (
                      <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-medium transition-colors">
                        Execute Tx
                      </button>
                    ) : (
                      <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-2">
                        <FileSignature className="w-4 h-4" /> Sign
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'vouchers' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { id: 'ILV-DOT-USDC', pool: 'DOT / USDC', amount: '450', status: 'Active', oracle: 'Chainlink', change: '+5.2%' },
                { id: 'ILV-ASTR-DOT', pool: 'ASTR / DOT', amount: '1,200', status: 'Traded', oracle: 'Pyth', change: '-1.4%' },
                { id: 'ILV-GLMR-USDC', pool: 'GLMR / USDC', amount: '850', status: 'Redeemed', oracle: 'Chainlink', change: '0.0%' },
              ].map((voucher, i) => (
                <div key={i} className="bg-[#13141C] border border-white/10 p-6 rounded-2xl hover:border-white/20 transition-colors relative overflow-hidden">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                      <Layers className="w-5 h-5 text-purple-400" />
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wider ${
                      voucher.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' :
                      voucher.status === 'Traded' ? 'bg-blue-500/10 text-blue-400' :
                      'bg-slate-500/10 text-slate-400'
                    }`}>
                      {voucher.status}
                    </span>
                  </div>
                  <div className="text-sm text-slate-400 mb-1">{voucher.pool} Risk Premium</div>
                  <div className="text-2xl font-display font-bold mb-4">{voucher.amount} <span className="text-sm text-slate-500">ILV</span></div>
                  <div className="flex justify-between items-center pt-4 border-t border-white/10">
                    <div>
                      <div className="text-xs text-slate-500">Oracle</div>
                      <div className="font-medium text-sm">{voucher.oracle}</div>
                    </div>
                    <div className={`text-sm font-medium ${voucher.change.startsWith('+') ? 'text-emerald-400' : voucher.change.startsWith('-') ? 'text-red-400' : 'text-slate-400'}`}>
                      {voucher.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'history' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#13141C] border border-white/10 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-white/5 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4 font-medium text-slate-400">Type</th>
                    <th className="px-6 py-4 font-medium text-slate-400">Pool / Asset</th>
                    <th className="px-6 py-4 font-medium text-slate-400">Amount</th>
                    <th className="px-6 py-4 font-medium text-slate-400">Date</th>
                    <th className="px-6 py-4 font-medium text-slate-400">Status</th>
                    <th className="px-6 py-4 font-medium text-slate-400">Tx Hash</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {[
                    { type: 'Deposit', pool: 'DOT / USDC', amount: '50,000 USDC', date: '2026-03-07 14:22', status: 'Completed', hash: '0x8f2a...3b9c' },
                    { type: 'Underwrite', pool: 'ASTR / DOT', amount: '10,000 ASTR', date: '2026-03-05 09:15', status: 'Completed', hash: '0x1a4c...9d2e' },
                    { type: 'Withdraw', pool: 'GLMR / USDC', amount: '25,000 USDC', date: '2026-03-01 18:45', status: 'Completed', hash: '0x5b7d...1f8a' },
                    { type: 'Mint ILV', pool: 'ASTR / DOT', amount: '1,200 ILV', date: '2026-03-05 09:15', status: 'Completed', hash: '0x2c5e...4a1b' },
                    { type: 'Deposit', pool: 'DOT / USDC', amount: '100,000 USDC', date: '2026-02-28 11:30', status: 'Completed', hash: '0x9e3f...6c2d' },
                  ].map((tx, i) => (
                    <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 font-medium">
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs ${
                          tx.type === 'Deposit' ? 'bg-emerald-500/10 text-emerald-400' :
                          tx.type === 'Withdraw' ? 'bg-orange-500/10 text-orange-400' :
                          tx.type === 'Underwrite' ? 'bg-blue-500/10 text-blue-400' :
                          'bg-purple-500/10 text-purple-400'
                        }`}>
                          {tx.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">{tx.pool}</td>
                      <td className="px-6 py-4 font-medium">{tx.amount}</td>
                      <td className="px-6 py-4 text-slate-400">{tx.date}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 text-emerald-400">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> {tx.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-blue-400 hover:text-blue-300 cursor-pointer font-mono text-xs">{tx.hash}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === 'settings' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl space-y-8">
            <div className="bg-[#13141C] border border-white/10 rounded-2xl p-6 md:p-8">
              <h3 className="text-lg font-bold mb-6 border-b border-white/10 pb-4">Notifications</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium mb-1">Yield Updates</div>
                    <div className="text-sm text-slate-400">Receive weekly summaries of your protected yield.</div>
                  </div>
                  <div className="w-12 h-6 bg-[#E6007A] rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium mb-1">IL Liability Alerts</div>
                    <div className="text-sm text-slate-400">Get notified when your underwritten IL liability spikes.</div>
                  </div>
                  <div className="w-12 h-6 bg-[#E6007A] rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium mb-1">New Vaults</div>
                    <div className="text-sm text-slate-400">Alerts when new institutional vaults are listed.</div>
                  </div>
                  <div className="w-12 h-6 bg-white/10 rounded-full relative cursor-pointer">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-slate-400 rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#13141C] border border-white/10 rounded-2xl p-6 md:p-8">
              <h3 className="text-lg font-bold mb-6 border-b border-white/10 pb-4">Security & Multi-sig</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium mb-1">Connected Safe</div>
                    <div className="text-sm text-slate-400 font-mono">0x71C...9A23 (3/5 Signers Required)</div>
                  </div>
                  <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium transition-colors text-red-400 hover:text-red-300">
                    Disconnect
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium mb-1">Transaction Builder</div>
                    <div className="text-sm text-slate-400">Push proposed transactions directly to Safe queue.</div>
                  </div>
                  <div className="w-12 h-6 bg-[#E6007A] rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
