import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { Shield, Layers, TrendingDown, RefreshCw, ExternalLink, Lock, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTokenPrice } from '../web3/hooks/useOracle';
import { useUserPositions, calcIL, formatAmount, type Position } from '../web3/hooks/useILVault';
import { usePoolInfo, useComputePoolId } from '../web3/hooks/useRouter';
import { getContractAddress } from '../web3/contracts/addresses';
import { polkadotTestnet } from '../web3/config/chains';
import { DepositFlow } from '../components/flows/DepositFlow';
import { WithdrawFlow } from '../components/flows/WithdrawFlow';
import { WalletButton } from '../components/web3/WalletButton';
import { CollateralManagementCard } from '../components/protocol/CollateralManagementCard';

const TOKEN_A = getContractAddress('tokenA');
const TOKEN_B = getContractAddress('tokenB');
const BLOCKSCOUT = 'https://blockscout-testnet.polkadot.io';

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35 },
};

function StatusPill({ status }: { status: Position['status'] }) {
  const cfg = {
    ACTIVE:  { dot: 'bg-emerald-400', color: 'text-emerald-400' },
    SETTLED: { dot: 'bg-blue-400',    color: 'text-blue-400' },
    EXPIRED: { dot: 'bg-zinc-500',    color: 'text-zinc-500' },
  }[status];
  return (
    <span className={`inline-flex items-center gap-1.5 font-data text-[10px] uppercase tracking-[0.15em] ${cfg.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {status.toLowerCase()}
    </span>
  );
}

function PoolCard({ onDeposit }: { onDeposit: () => void }) {
  const { reserveA, reserveB, isLoading: resLoad, refetch } = usePoolInfo();
  const { data: poolId, isLoading: poolIdLoading, error: poolIdError } = useComputePoolId(TOKEN_A, TOKEN_B);
  const { formattedPrice: priceA, updatedAt: updA, isLoading: pALoad, isDemoMode: demoA } = useTokenPrice(TOKEN_A);
  const { formattedPrice: priceB, updatedAt: updB, isLoading: pBLoad, isDemoMode: demoB } = useTokenPrice(TOKEN_B);
  const loading = resLoad || pALoad || pBLoad;

  const stats = [
    { label: 'Token A Price', value: pALoad ? '...' : `$${priceA}`, sub: updA?.toLocaleTimeString(), loading: pALoad, isDemo: demoA },
    { label: 'Token B Price', value: pBLoad ? '...' : `$${priceB}`, sub: updB?.toLocaleTimeString(), loading: pBLoad, isDemo: demoB },
    { label: 'Reserve A',     value: formatAmount(reserveA), sub: 'tokens', loading: resLoad },
    { label: 'Reserve B',     value: formatAmount(reserveB), sub: 'tokens', loading: resLoad },
  ];

  return (
    <div className="card card-pink p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="font-data text-[10px] uppercase tracking-[0.18em] text-zinc-600 mb-1">Liquidity Pool</p>
          <h2 className="text-2xl font-display font-bold tracking-tight text-white">Token A / Token B</h2>
          <p className="font-data text-xs text-zinc-600 mt-0.5">
            ConstantAMM · Pool ID {poolId ? `${poolId.slice(0, 8)}...${poolId.slice(-6)}` : (poolIdLoading ? '...' : '0')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 font-data text-[10px] uppercase tracking-[0.15em] text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            IL Protected
          </span>
          <button
            onClick={() => refetch()}
            className="w-8 h-8 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] flex items-center justify-center text-zinc-600 hover:text-white transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        {stats.map(({ label, value, sub, loading: l, isDemo }) => (
          <div key={label} className="stat-cell p-4 relative">
            {/* Demo Mode badge with tooltip */}
            {isDemo && (
              <span
                title="Oracle unavailable — showing demo price for preview"
                className="cursor-help absolute top-3 right-3 font-data text-[8px] uppercase tracking-widest text-blue-400 border border-blue-400/30 px-1 rounded"
              >
                Demo
              </span>
            )}
            <p className="font-data text-[10px] uppercase tracking-[0.12em] text-zinc-600 mb-2">{label}</p>
            {l
              ? <div className="h-6 w-24 rounded bg-white/[0.05] animate-pulse" />
              : <p className="font-data text-xl text-white">{value}</p>
            }
            {sub && !l && <p className="font-data text-[10px] text-zinc-600 mt-1">{sub}</p>}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-emerald-500/[0.05] border border-emerald-500/[0.15] mb-5">
        <Shield className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
        <p className="font-data text-xs text-emerald-400/80">100% IL protection — covered by protocol collateral</p>
      </div>

      <button onClick={onDeposit} className="btn-primary">
        <ArrowUpRight className="w-3.5 h-3.5" />
        Deposit into Pool
      </button>
    </div>
  );
}

function PositionsCard({ positions, isLoading, onWithdraw, onRefresh }: {
  positions: Position[];
  isLoading: boolean;
  onWithdraw: (p: Position) => void;
  onRefresh: () => void;
}) {
  return (
    <div className="card card-blue p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="font-data text-[10px] uppercase tracking-[0.18em] text-zinc-600 mb-1">Your Positions</p>
          <h2 className="text-xl font-display font-bold tracking-tight text-white">Active Deposits</h2>
        </div>
        <button
          onClick={onRefresh}
          className="w-8 h-8 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] flex items-center justify-center text-zinc-600 hover:text-white transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2].map(i => <div key={i} className="h-24 rounded-xl bg-white/[0.03] animate-pulse" />)}
        </div>
      ) : positions.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mx-auto mb-3">
            <Layers className="w-5 h-5 text-zinc-700" />
          </div>
          <p className="font-data text-sm text-zinc-600">No positions yet</p>
          <p className="font-data text-xs text-zinc-700 mt-1">Deposit into the pool to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          {positions.map((p, i) => (
            <motion.div
              key={p.positionId.toString()}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="stat-cell p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-20 h-8 rounded-lg bg-[#FF0877]/10 border border-[#FF0877]/20 flex items-center justify-center flex-shrink-0">
                    <span className="font-data text-[10px] text-[#FF0877]">#{p.positionId.toString().slice(0, 8)}...</span>
                  </div>
                  <div>
                    <StatusPill status={p.status} />
                    <div className="flex items-center gap-1.5 mt-1">
                      <Lock className="w-3 h-3 text-zinc-700" />
                      <p className="font-data text-[11px] text-zinc-600">
                        {p.isLockExpired
                          ? <span className="text-emerald-400">Unlocked</span>
                          : `Locked until ${p.lockExpiry.toLocaleDateString()}`
                        }
                      </p>
                    </div>
                  </div>
                </div>
                {p.status === 'ACTIVE' && (
                  <button
                    onClick={() => onWithdraw(p)}
                    disabled={!p.isLockExpired}
                    className={`font-data text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-lg border transition-colors ${
                      p.isLockExpired
                        ? 'border-white/[0.15] text-white hover:bg-white/[0.1]'
                        : 'border-white/[0.05] text-zinc-700 cursor-not-allowed'
                    }`}
                  >
                    Withdraw
                  </button>
                )}
              </div>
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/[0.05]">
                {[
                  { label: 'Token A', value: formatAmount(p.amountA) },
                  { label: 'Token B', value: formatAmount(p.amountB) },
                  { label: 'LP Tokens', value: formatAmount(p.lpAmount) },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="font-data text-[10px] uppercase tracking-[0.1em] text-zinc-700 mb-0.5">{label}</p>
                    <p className="font-data text-sm text-white">{value}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

function ILChecker({ positions }: { positions: Position[] }) {
  const [tab, setTab] = useState<'positions' | 'calculator'>('positions');
  const [entryPrice, setEntryPrice] = useState('');
  const [currentPrice, setCurrentPrice] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const { price: currentPriceA } = useTokenPrice(TOKEN_A);

  const calcResult = (() => {
    const ep = parseFloat(entryPrice), cp = parseFloat(currentPrice), dep = parseFloat(depositAmount);
    if (!ep || !cp || ep <= 0 || cp <= 0) return null;
    const P = cp / ep;
    // IL is always a loss vs. holding, symmetric regardless of price direction
    const il = (2 * Math.sqrt(P)) / (1 + P) - 1;
    const ilPctAbs = Math.abs(il) * 100;
    return {
      ilPct: ilPctAbs.toFixed(2),
      ilAmount: dep > 0 ? Math.abs(il) * dep : null,
      barWidth: Math.min(ilPctAbs * 10, 100), // 10% IL = full bar
      priceDir: cp > ep ? 'up' : cp < ep ? 'down' : 'unchanged',
    };
  })();

  const activePositions = positions.filter(p => p.status === 'ACTIVE');

  return (
    <div className="card card-purple p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="font-data text-[10px] uppercase tracking-[0.18em] text-zinc-600 mb-1">Risk Analysis</p>
          <h2 className="text-xl font-display font-bold tracking-tight text-white">IL Checker</h2>
        </div>
        <TrendingDown className="w-5 h-5 text-purple-400 opacity-50" />
      </div>

      <div className="flex gap-1 p-1 rounded-xl bg-black/30 border border-white/[0.05] mb-6">
        {(['positions', 'calculator'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 rounded-lg font-data text-[11px] uppercase tracking-widest transition-colors ${
              tab === t ? 'bg-[#0C0C12] text-white' : 'text-zinc-600 hover:text-zinc-400'
            }`}
          >
            {t === 'positions' ? 'My Positions' : 'Calculator'}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {tab === 'positions' && (
            activePositions.length === 0 ? (
              <div className="text-center py-10">
                <TrendingDown className="w-8 h-8 mx-auto mb-2 text-zinc-800" />
                <p className="font-data text-sm text-zinc-700">No active positions to analyse</p>
              </div>
            ) : (
              <div className="space-y-3">
                {activePositions.map(p => {
                  const il = calcIL(p.entryPrice, currentPriceA);
                  const ilPct = (il * 100).toFixed(2);
                  const ilAmt = Math.abs(il) * parseFloat(formatUnits(p.amountA, 18));
                  const isLoss = il < -0.001;
                  return (
                    <div key={p.positionId.toString()} className="stat-cell p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-data text-xs text-zinc-400">Position #{p.positionId.toString().slice(0, 8)}...</span>
                        <span className={`font-data text-sm font-medium ${isLoss ? 'text-red-400' : 'text-emerald-400'}`}>
                          {il < 0 ? '' : '+'}{ilPct}%
                        </span>
                      </div>
                      <div className="h-1 rounded-full bg-white/[0.05] mb-3 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${isLoss ? 'bg-red-500' : 'bg-emerald-500'}`}
                          style={{ width: `${Math.min(Math.abs(il) * 500, 100)}%` }}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2 font-data text-[11px] text-zinc-600 mb-2">
                        <span>Entry: <span className="text-zinc-400">${formatAmount(p.entryPrice)}</span></span>
                        <span>Current: <span className="text-zinc-400">${formatAmount(currentPriceA)}</span></span>
                      </div>
                      <div className={`font-data text-[11px] px-3 py-2 rounded-lg ${isLoss ? 'bg-red-500/[0.08] text-red-400' : 'bg-emerald-500/[0.08] text-emerald-400'}`}>
                        {isLoss ? `~${ilAmt.toLocaleString('id-ID', { minimumFractionDigits: 4, maximumFractionDigits: 4 })} Token A IL — covered by protocol` : 'No significant IL at current price'}
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          )}

          {tab === 'calculator' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-data text-[10px] uppercase tracking-[0.12em] text-zinc-600 mb-2">Entry Price ($)</label>
                  <input type="number" min="0" placeholder="10.00" value={entryPrice} onChange={e => setEntryPrice(e.target.value)} className="input-field" />
                </div>
                <div>
                  <label className="block font-data text-[10px] uppercase tracking-[0.12em] text-zinc-600 mb-2">Current Price ($)</label>
                  <input type="number" min="0" placeholder="15.00" value={currentPrice} onChange={e => setCurrentPrice(e.target.value)} className="input-field" />
                </div>
              </div>
              <div>
                <label className="block font-data text-[10px] uppercase tracking-[0.12em] text-zinc-600 mb-2">Deposit Amount <span className="text-zinc-700 normal-case">(optional)</span></label>
                <input type="number" min="0" placeholder="1000" value={depositAmount} onChange={e => setDepositAmount(e.target.value)} className="input-field" />
                <p className="font-data text-[10px] text-zinc-700 mt-1">Enter in any currency — result will be in the same unit</p>
              </div>

              {calcResult && (
                <div className="stat-cell p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-data text-[10px] uppercase tracking-[0.12em] text-zinc-600">IL vs. Holding</span>
                      <p className="font-data text-[10px] text-zinc-700 mt-0.5">
                        Price {calcResult.priceDir === 'up' ? '↑ went up' : calcResult.priceDir === 'down' ? '↓ went down' : '— unchanged'}
                      </p>
                    </div>
                    <span className="font-data text-xl font-medium text-amber-400">
                      -{calcResult.ilPct}%
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-amber-500 transition-all duration-500"
                      style={{ width: `${calcResult.barWidth}%` }}
                    />
                  </div>
                  {calcResult.ilAmount !== null && (
                    <div className="flex items-center justify-between pt-2 border-t border-white/[0.05]">
                      <span className="font-data text-[10px] uppercase tracking-[0.12em] text-zinc-600">Estimated Loss</span>
                      <span className="font-data text-sm text-amber-400">{calcResult.ilAmount.toFixed(4)} <span className="text-zinc-600">(deposit units)</span></span>
                    </div>
                  )}
                  <div className="flex items-start gap-2 pt-2 border-t border-white/[0.05]">
                    <Shield className="w-3 h-3 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <p className="font-data text-[11px] text-emerald-400/70">IL is the same whether price goes up or down. On Conduir, it's covered by protocol collateral.</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default function Dashboard() {
  const { address, isConnected } = useAccount();
  const [tab, setTab] = useState<'lp' | 'protocol'>('lp');
  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
  const { positions, isLoading: positionsLoading, refetch: refetchPositions } = useUserPositions(address);

  return (
    <div className="min-h-screen bg-[#050508] grid-bg pt-20">
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-5">

        <motion.div {...fadeUp}>
          <p className="font-data text-[10px] uppercase tracking-[0.2em] text-zinc-700 mb-1">Polkadot Hub TestNet</p>
          <h1 className="text-3xl font-display font-bold tracking-tight text-white">Conduir</h1>
        </motion.div>

        {!isConnected ? (
          <motion.div {...fadeUp} transition={{ duration: 0.4 }} className="min-h-[55vh] flex items-center justify-center">
            <div className="text-center max-w-sm">
              <div className="w-20 h-20 rounded-3xl bg-[#FF0877]/10 border border-[#FF0877]/20 flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(255,8,119,0.2)]">
                <Shield className="w-9 h-9 text-[#FF0877]" />
              </div>
              <h2 className="text-2xl font-display font-bold mb-2 text-white">Connect Wallet</h2>
              <p className="font-data text-sm text-zinc-600 mb-8 leading-relaxed">
                Connect to Polkadot Hub TestNet to deposit liquidity, track positions, and check IL.
              </p>
              <WalletButton />
            </div>
          </motion.div>
        ) : (
          <>
            {/* Tab switcher */}
            <motion.div {...fadeUp} transition={{ duration: 0.3 }}>
              <div className="flex gap-1 p-1 rounded-xl bg-black/30 border border-white/[0.05] w-fit">
                {(['lp', 'protocol'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`px-5 py-2 rounded-lg font-data text-[11px] uppercase tracking-widest transition-colors ${
                      tab === t ? 'bg-[#0C0C12] text-white' : 'text-zinc-600 hover:text-zinc-400'
                    }`}
                  >
                    {t === 'lp' ? 'LP' : 'Protocol'}
                  </button>
                ))}
              </div>
            </motion.div>

            <AnimatePresence mode="wait">
              {tab === 'lp' ? (
                <motion.div
                  key="lp"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-5"
                >
                  {[
                    <PoolCard key="pool" onDeposit={() => setDepositOpen(true)} />,
                    <PositionsCard
                      key="positions"
                      positions={positions}
                      isLoading={positionsLoading}
                      onWithdraw={p => { setSelectedPosition(p); setWithdrawOpen(true); }}
                      onRefresh={refetchPositions}
                    />,
                    <ILChecker key="il" positions={positions} />,
                  ].map((el, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: i * 0.09 }}>
                      {el}
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="protocol"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <CollateralManagementCard userAddress={address} />
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="flex flex-wrap gap-4 pt-2">
          {[
            { label: 'Router',      addr: '0x17e25f1f032161f6a3438ee01b91be756ec3a6e9' },
            { label: 'ILVault',     addr: '0x68dc51f53857343ee09feb44b86772de4c9e89c9' },
            { label: 'ConstantAMM', addr: '0x1508b920fee8dc674ce15b835d95e73166125c81' },
          ].map(c => (
            <a
              key={c.label}
              href={`${BLOCKSCOUT}/address/${c.addr}`}
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-data text-[10px] uppercase tracking-widest text-zinc-700 hover:text-zinc-500 transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              {c.label}
            </a>
          ))}
        </motion.div>
      </div>

      <DepositFlow isOpen={depositOpen} onClose={() => setDepositOpen(false)} userAddress={address} onSuccess={refetchPositions} />
      <WithdrawFlow isOpen={withdrawOpen} onClose={() => setWithdrawOpen(false)} position={selectedPosition} userAddress={address} onSuccess={refetchPositions} />
    </div>
  );
}
