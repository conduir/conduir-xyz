import React, { useState } from 'react';
import { motion } from 'motion/react';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { TrendingUp, Calendar, DollarSign, PieChart as PieChartIcon, Coins, ArrowUpRight } from 'lucide-react';
import { useFeeFlow } from '../../hooks/useFeeFlow';
import { Modal, Button } from '../ui';

interface FeeFlowProps {
  isOpen: boolean;
  onClose: () => void;
}

const COLORS = {
  upfront: '#E6007A',
  accrued: '#3b82f6',
  trading: '#10b981',
  residual: '#f59e0b',
};

export function FeeFlow({ isOpen, onClose }: FeeFlowProps) {
  const { state, actions } = useFeeFlow();
  const [listingFeeInput, setListingFeeInput] = useState('2500');

  if (!isOpen) return null;

  const totals = actions.getTotalFees();
  const projectedRevenue = actions.getProjectedRevenue();
  const feeDistribution = actions.getFeeDistribution();
  const snapshots = actions.getSnapshots();

  const simulatedBreakdown = actions.simulateFeeCalculation(parseFloat(listingFeeInput) || 0);

  const renderOverview = () => (
    <div>
      <h3 className="text-xl font-bold mb-2">Fee Collection Overview</h3>
      <p className="text-slate-400 mb-6">Track revenue from listing fees, trading fees, and residual returns.</p>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-[#0A0B10] rounded-xl p-4">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
            <TrendingUp className="w-4 h-4" />
            Total Distributed (30d)
          </div>
          <div className="text-2xl font-bold">${totals.total.toLocaleString()}</div>
          <div className="text-xs text-emerald-400 mt-1">+12.4% vs last period</div>
        </div>
        <div className="bg-[#0A0B10] rounded-xl p-4">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
            <Calendar className="w-4 h-4" />
            Projected Monthly
          </div>
          <div className="text-2xl font-bold">${projectedRevenue.monthly.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
          <div className="text-xs text-slate-500 mt-1">Based on current rate</div>
        </div>
      </div>

      {/* Fee Distribution Chart */}
      <div className="bg-[#0A0B10] rounded-xl p-6 mb-6">
        <h4 className="text-sm font-semibold text-slate-400 mb-4">Fee Distribution (30d)</h4>
        <div className="flex items-center gap-6">
          <div className="w-40 h-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={feeDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={60}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {feeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 space-y-2">
            {feeDistribution.map((item) => (
              <div key={item.label} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-400">{item.label}</span>
                </div>
                <span className="font-bold">${item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fee Breakdown Details */}
      <div className="bg-[#0A0B10] rounded-xl p-6 space-y-3">
        <div className="flex justify-between items-center pb-3 border-b border-white/10">
          <span className="text-slate-400">Upfront Fees (40%)</span>
          <span className="font-bold" style={{ color: COLORS.upfront }}>${totals.upfront.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center pb-3 border-b border-white/10">
          <span className="text-slate-400">Accrued Fees (60%)</span>
          <span className="font-bold" style={{ color: COLORS.accrued }}>${totals.accrued.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center pb-3 border-b border-white/10">
          <span className="text-slate-400">Trading Fees</span>
          <span className="font-bold" style={{ color: COLORS.trading }}>${totals.trading.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center pt-1">
          <span className="text-slate-400">Residuals Returned</span>
          <span className="font-bold" style={{ color: COLORS.residual }}>${actions.getResidualsThisMonth().toLocaleString()}</span>
        </div>
      </div>
    </div>
  );

  const renderBreakdown = () => (
    <div>
      <h3 className="text-xl font-bold mb-2">Fee Calculator</h3>
      <p className="text-slate-400 mb-6">Simulate the fee breakdown for any listing fee amount.</p>

      {/* Calculator */}
      <div className="bg-[#0A0B10] rounded-xl p-6 mb-6">
        <label className="block text-sm font-medium text-slate-400 mb-3">
          Listing Fee Amount (USDC)
        </label>
        <div className="relative mb-6">
          <input
            type="number"
            value={listingFeeInput}
            onChange={(e) => setListingFeeInput(e.target.value)}
            className="w-full bg-[#0A0B10] border border-white/10 rounded-xl px-4 py-4 text-white text-lg focus:outline-none focus:ring-2 focus:ring-[#E6007A]/50 focus:ring-offset-2 focus:ring-offset-[#0A0B10] transition-all"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">USDC</span>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${COLORS.upfront}20` }}>
                <Coins className="w-5 h-5" style={{ color: COLORS.upfront }} />
              </div>
              <div>
                <div className="font-medium">Upfront (40%)</div>
                <div className="text-xs text-slate-500">Immediate to DAO</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold" style={{ color: COLORS.upfront }}>${simulatedBreakdown.upfront.toLocaleString()}</div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${COLORS.accrued}20` }}>
                <TrendingUp className="w-5 h-5" style={{ color: COLORS.accrued }} />
              </div>
              <div>
                <div className="font-medium">Accrued (60%)</div>
                <div className="text-xs text-slate-500">Vested over time</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold" style={{ color: COLORS.accrued }}>${simulatedBreakdown.accrued.toLocaleString()}</div>
            </div>
          </div>

          <div className="h-px bg-white/10 my-4" />

          <div className="flex items-center justify-between">
            <span className="text-slate-400">Total Fee</span>
            <span className="text-xl font-bold">${simulatedBreakdown.total.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Fee Timeline */}
      <div className="bg-[#0A0B10] rounded-xl p-6">
        <h4 className="text-sm font-semibold text-slate-400 mb-4">Fee Distribution Timeline</h4>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 rounded-full bg-[#E6007A]" />
              <div className="w-px h-full bg-white/10 my-1" />
            </div>
            <div className="pb-4">
              <div className="font-medium">At Registration</div>
              <div className="text-sm text-slate-400">40% (${simulatedBreakdown.upfront.toLocaleString()}) sent immediately to DAO treasury</div>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <div className="w-px h-full bg-white/10 my-1" />
            </div>
            <div className="pb-4">
              <div className="font-medium">Ongoing (Until Full)</div>
              <div className="text-sm text-slate-400">60% (${simulatedBreakdown.accrued.toLocaleString()}) earned from trading fees over time</div>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
            </div>
            <div>
              <div className="font-medium">At Expiration</div>
              <div className="text-sm text-slate-400">Any remaining accrued fees returned to protocol</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderHistory = () => (
    <div>
      <h3 className="text-xl font-bold mb-2">Revenue History</h3>
      <p className="text-slate-400 mb-6">Historical fee collection and revenue distribution.</p>

      {/* Chart */}
      <div className="bg-[#0A0B10] rounded-xl p-6 mb-6">
        <h4 className="text-sm font-semibold text-slate-400 mb-4">Revenue Trend (6 months)</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={snapshots}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="period" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
              <YAxis stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(value) => `$${value / 1000}k`} dx={-10} />
              <Tooltip
                contentStyle={{ backgroundColor: '#13141C', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                itemStyle={{ color: '#fff' }}
                formatter={(value) => [`$${(value as number).toLocaleString()}`, 'Revenue']}
              />
              <Line type="monotone" dataKey="totalDistributed" stroke="#E6007A" strokeWidth={2} dot={{ fill: '#E6007A', r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Breakdown */}
      <div className="bg-[#0A0B10] rounded-xl p-6">
        <h4 className="text-sm font-semibold text-slate-400 mb-4">Monthly Breakdown</h4>
        <div className="space-y-2">
          {snapshots.slice().reverse().map((snapshot, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
              <span className="text-slate-400">{snapshot.period}</span>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-xs text-slate-500">Distributed</div>
                  <div className="font-bold">${snapshot.totalDistributed.toLocaleString()}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-500">Residuals</div>
                  <div className="font-medium text-emerald-400">${snapshot.residualsReturned.toLocaleString()}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6">
        {[
          { key: 'overview' as const, label: 'Overview', icon: <PieChartIcon className="w-4 h-4" /> },
          { key: 'breakdown' as const, label: 'Calculator', icon: <DollarSign className="w-4 h-4" /> },
          { key: 'history' as const, label: 'History', icon: <TrendingUp className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => actions.setView(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#E6007A]/50 focus:ring-offset-2 focus:ring-offset-[#13141C] ${
              state.view === tab.key
                ? 'bg-[#E6007A] text-white'
                : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Time Range Selector */}
      <div className="flex gap-2 mb-6">
        {(['7d', '30d', '90d', 'all'] as const).map((range) => (
          <button
            key={range}
            onClick={() => actions.setTimeRange(range)}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#E6007A]/50 focus:ring-offset-2 focus:ring-offset-[#13141C] ${
              state.timeRange === range
                ? 'bg-white/10 text-white'
                : 'text-slate-500 hover:text-white'
            }`}
          >
            {range.toUpperCase()}
          </button>
        ))}
      </div>

      <motion.div
        key={state.view}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {state.view === 'overview' && renderOverview()}
        {state.view === 'breakdown' && renderBreakdown()}
        {state.view === 'history' && renderHistory()}
      </motion.div>
    </Modal>
  );
}
