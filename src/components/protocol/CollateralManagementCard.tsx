import React from 'react';
import { motion } from 'motion/react';
import {
  Shield,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Info,
  ArrowUpRight,
  Ticket,
} from 'lucide-react';
import { useProtocolCollateral } from '../../web3/hooks/useProtocol';
import { useVoucherBalance } from '../../web3/hooks/useVoucher';
import { RegisterProtocolFlow } from '../flows/RegisterProtocolFlow';
import type { Address } from 'viem';

interface Props {
  userAddress?: Address;
}

const COLLATERAL_STATUS_CONFIG = {
  not_registered: {
    color: 'text-zinc-500',
    bg: 'bg-zinc-500/10',
    border: 'border-zinc-500/20',
    icon: Info,
    label: 'Not Registered',
    description: 'Register your protocol to start accepting LP deposits',
  },
  excellent: {
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    icon: Shield,
    label: 'Excellent',
    description: 'Your collateral is well above minimum requirements',
  },
  good: {
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    icon: CheckCircle2,
    label: 'Good',
    description: 'Your collateral is at healthy levels',
  },
  adequate: {
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    icon: AlertTriangle,
    label: 'Adequate',
    description: 'Consider adding more collateral for safety margin',
  },
  low: {
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    icon: AlertTriangle,
    label: 'Low',
    description: 'Your collateral is below recommended levels',
  },
} as const;

export function CollateralManagementCard({ userAddress }: Props) {
  const [registerOpen, setRegisterOpen] = React.useState(false);
  const { protocol, health, collateralStatus, isLoading, refetchAll } =
    useProtocolCollateral(userAddress);
  const { balance: voucherBalance, refetch: refetchVouchers } = useVoucherBalance(userAddress);

  const statusConfig = COLLATERAL_STATUS_CONFIG[collateralStatus];
  const StatusIcon = statusConfig.icon;

  const handleRefresh = () => {
    refetchAll();
    refetchVouchers();
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div className="card card-pink p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="font-data text-[10px] uppercase tracking-[0.18em] text-zinc-600 mb-1">
                Liquidity as a Service
              </p>
              <h2 className="text-2xl font-display font-bold tracking-tight text-white">
                Protocol Dashboard
              </h2>
              <p className="font-data text-xs text-zinc-600 mt-0.5">
                Manage your protocol collateral and IL coverage
              </p>
            </div>
            <button
              onClick={handleRefresh}
              className="w-8 h-8 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] flex items-center justify-center text-zinc-600 hover:text-white transition-colors"
              title="Refresh data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Protocol Registration Status */}
          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl ${statusConfig.bg} ${statusConfig.border} border mb-5`}>
            <div className={`w-8 h-8 rounded-lg ${statusConfig.bg} flex items-center justify-center flex-shrink-0`}>
              <StatusIcon className={`w-4 h-4 ${statusConfig.color}`} />
            </div>
            <div className="flex-1">
              <p className="font-data text-xs font-medium uppercase tracking-wider text-white">
                {statusConfig.label}
              </p>
              <p className="font-data text-[11px] text-zinc-500 mt-0.5">{statusConfig.description}</p>
            </div>
          </div>

          {/* Protocol Stats Grid */}
          {protocol.isRegistered ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
              {/* Collateral Amount */}
              <div className="stat-cell p-4">
                <p className="font-data text-[10px] uppercase tracking-[0.12em] text-zinc-600 mb-2">
                  Your Collateral
                </p>
                <p className="font-data text-2xl text-white">
                  {parseFloat(protocol.formattedCollateral).toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                  <span className="text-sm text-zinc-600 ml-1">USDC</span>
                </p>
                {protocol.tierName && (
                  <p className="font-data text-[10px] text-zinc-700 mt-1">
                    {protocol.tierName} · {protocol.tierDescription}
                  </p>
                )}
              </div>

              {/* Collateral Health */}
              <div className="stat-cell p-4">
                <p className="font-data text-[10px] uppercase tracking-[0.12em] text-zinc-600 mb-2">
                  Health Ratio
                </p>
                <div className="flex items-baseline gap-2">
                  <p className={`font-data text-2xl font-medium ${
                    health.healthPercentage >= 120 ? 'text-emerald-400' :
                    health.healthPercentage >= 100 ? 'text-amber-400' :
                    'text-red-400'
                  }`}>
                    {health.healthPercentage.toFixed(1)}%
                  </p>
                </div>
                {/* Health bar */}
                <div className="mt-2 h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(health.healthPercentage, 100)}%` }}
                    transition={{ duration: 0.5 }}
                    className={`h-full rounded-full ${
                      health.healthPercentage >= 120 ? 'bg-emerald-500' :
                      health.healthPercentage >= 100 ? 'bg-amber-500' :
                      'bg-red-500'
                    }`}
                  />
                </div>
              </div>

              {/* IL Vouchers */}
              <div className="stat-cell p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Ticket className="w-3.5 h-3.5 text-[#FF0877]" />
                  <p className="font-data text-[10px] uppercase tracking-[0.12em] text-zinc-600">
                    IL Vouchers Issued
                  </p>
                </div>
                <p className="font-data text-2xl text-white">{voucherBalance.toString()}</p>
                <p className="font-data text-xs text-zinc-700 mt-1">
                  Total IL obligation units
                </p>
              </div>

              {/* Pool ID */}
              {protocol.data?.defaultPoolId && (
                <div className="stat-cell p-4">
                  <p className="font-data text-[10px] uppercase tracking-[0.12em] text-zinc-600 mb-2">
                    Default Pool
                  </p>
                  <p className="font-data text-sm text-white font-mono break-all">
                    {protocol.data.defaultPoolId.slice(0, 10)}...
                    {protocol.data.defaultPoolId.slice(-8)}
                  </p>
                  <p className="font-data text-[10px] text-zinc-700 mt-1">
                    Token A / Token B
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* Not Registered State */
            <div className="stat-cell p-6 mb-5 text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#FF0877]/10 border border-[#FF0877]/20 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-[#FF0877]" />
              </div>
              <h3 className="font-display font-bold text-lg text-white mb-2">
                Register Your Protocol
              </h3>
              <p className="font-data text-sm text-zinc-500 mb-4 max-w-sm mx-auto">
                Register as a liquidity provider protocol to offer IL-protected liquidity to LPs.
                You'll need to post collateral in USDC.
              </p>
              <div className="inline-flex items-center gap-4 text-xs text-zinc-700">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  100% IL Protection
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  Tier-based Collateral
                </span>
              </div>
            </div>
          )}

          {/* Action Button or Info */}
          {protocol.isRegistered ? (
            <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#FF0877]/[0.05] border border-[#FF0877]/[0.15]">
              <TrendingUp className="w-3.5 h-3.5 text-[#FF0877] flex-shrink-0" />
              <p className="font-data text-xs text-[#FF0877]/80">
                Your protocol is active and accepting LP deposits. Collateral covers IL for all positions.
              </p>
            </div>
          ) : (
            <button
              onClick={() => setRegisterOpen(true)}
              className="btn-primary"
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              Register Protocol
            </button>
          )}
        </div>

        {/* How It Works Section */}
        <div className="card p-6 mt-5">
          <h3 className="font-display font-bold text-lg text-white mb-4">How Liquidity as a Service Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                step: '01',
                title: 'Register Protocol',
                description: 'Register your protocol and post USDC collateral based on your tier.',
                icon: Shield,
              },
              {
                step: '02',
                title: 'Accept LP Deposits',
                description: 'LPs deposit Token A + Token B into your pool with full IL protection.',
                icon: TrendingUp,
              },
              {
                step: '03',
                title: 'IL Covered by Collateral',
                description: 'When LPs withdraw, any impermanent loss is automatically covered by your collateral.',
                icon: CheckCircle2,
              },
            ].map(({ step, title, description, icon: Icon }) => (
              <div key={step} className="relative">
                <div className="font-data text-[10px] uppercase tracking-[0.15em] text-[#FF0877] mb-2">
                  {step}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-4 h-4 text-zinc-500" />
                  <h4 className="font-display font-bold text-sm text-white">{title}</h4>
                </div>
                <p className="font-data text-xs text-zinc-600">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Register Protocol Modal */}
      <RegisterProtocolFlow
        isOpen={registerOpen}
        onClose={() => setRegisterOpen(false)}
        userAddress={userAddress}
        onSuccess={() => {
          refetchAll();
          refetchVouchers();
        }}
      />
    </>
  );
}
