import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart } from 'recharts';
import { TrendingUp, Calendar } from 'lucide-react';
import type { YieldPrediction, ChartDataPoint } from '../types/ai';

interface PredictedAPYChartProps {
  predictions?: YieldPrediction[];
  height?: number;
  showArea?: boolean;
  vaultsToShow?: string[]; // vault IDs to show
}

export function PredictedAPYChart({
  predictions = [],
  height = 200,
  showArea = false,
  vaultsToShow,
}: PredictedAPYChartProps) {
  const filteredPredictions = useMemo(() => {
    if (!vaultsToShow) return predictions;
    return predictions.filter(p => vaultsToShow.includes(p.vaultId));
  }, [predictions, vaultsToShow]);

  const chartData = useMemo(() => {
    const timePoints = ['Current', '7 Days', '14 Days', '30 Days'];

    return timePoints.map((label, index) => {
      const point: ChartDataPoint & { [key: string]: any } = { label };

      filteredPredictions.forEach((prediction, i) => {
        const key = `vault${i}`;
        switch (index) {
          case 0: // Current
            point[key] = prediction.vault.apy;
            break;
          case 1: // 7 Days
            point[key] = prediction.predictions.days7;
            break;
          case 2: // 14 Days
            point[key] = prediction.predictions.days14;
            break;
          case 3: // 30 Days
            point[key] = prediction.predictions.days30;
            break;
        }
      });

      return point;
    });
  }, [filteredPredictions]);

  const colors = ['#E6007A', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

  if (filteredPredictions.length === 0) {
    return (
      <div className="bg-[#13141C] border border-white/10 rounded-xl p-6 flex items-center justify-center" style={{ height }}>
        <div className="text-center text-slate-500">
          <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No prediction data available</p>
        </div>
      </div>
    );
  }

  const ChartComponent = showArea ? AreaChart : LineChart;

  return (
    <div className="bg-[#13141C] border border-white/10 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#E6007A]" />
          <h3 className="font-bold">APY Forecast</h3>
        </div>
        <div className="flex items-center gap-1 text-xs text-slate-500">
          <Calendar className="w-3 h-3" />
          <span>30-day projection</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={height}>
        <ChartComponent data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <defs>
            {filteredPredictions.map((_, i) => (
              <linearGradient key={i} id={`gradient${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors[i % colors.length]} stopOpacity={0.3} />
                <stop offset="95%" stopColor={colors[i % colors.length]} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />

          <XAxis
            dataKey="label"
            stroke="#64748b"
            tick={{ fill: '#64748b', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            dy={10}
          />

          <YAxis
            stroke="#64748b"
            tick={{ fill: '#64748b', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `${value}%`}
            dx={-10}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: '#0A0B10',
              borderColor: 'rgba(255,255,255,0.1)',
              borderRadius: '12px',
              color: '#fff',
            }}
            labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
            formatter={(value: number, name: string) => {
              const vaultIndex = parseInt(name.replace('vault', ''));
              const vault = filteredPredictions[vaultIndex];
              return [`${value.toFixed(1)}%`, vault?.vault.protocol || name];
            }}
          />

          <Legend
            wrapperStyle={{ paddingTop: '10px' }}
            iconType="circle"
            formatter={(value: string) => {
              const vaultIndex = parseInt(value.replace('vault', ''));
              const vault = filteredPredictions[vaultIndex];
              return vault ? `${vault.vault.protocol} (${vault.vault.asset})` : value;
            }}
          />

          {filteredPredictions.map((prediction, i) =>
            showArea ? (
              <Area
                key={prediction.vaultId}
                type="monotone"
                dataKey={`vault${i}`}
                stroke={colors[i % colors.length]}
                strokeWidth={2}
                fill={`url(#gradient${i})`}
                dot={{ fill: '#13141C', stroke: colors[i % colors.length], strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: colors[i % colors.length], stroke: '#fff' }}
              />
            ) : (
              <Line
                key={prediction.vaultId}
                type="monotone"
                dataKey={`vault${i}`}
                stroke={colors[i % colors.length]}
                strokeWidth={3}
                dot={{ fill: '#13141C', stroke: colors[i % colors.length], strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: colors[i % colors.length], stroke: '#fff' }}
              />
            )
          )}
        </ChartComponent>
      </ResponsiveContainer>

      {filteredPredictions.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-xs text-slate-500 mb-1">Avg 7d Change</div>
            <div className="font-bold text-sm">
              {filteredPredictions.length > 0
                ? (
                    filteredPredictions.reduce((sum, p) => sum + (p.predictions.days7 - p.vault.apy), 0) /
                    filteredPredictions.length
                  ).toFixed(1)
                : '0.0'}
              %
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500 mb-1">Avg 30d Prediction</div>
            <div className="font-bold text-sm text-[#E6007A]">
              {filteredPredictions.length > 0
                ? (
                    filteredPredictions.reduce((sum, p) => sum + p.predictions.days30, 0) /
                    filteredPredictions.length
                  ).toFixed(1)
                : '0.0'}
              %
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500 mb-1">Trend</div>
            <div className="font-bold text-sm">
              {filteredPredictions.filter(p => p.predictions.days30 > p.vault.apy).length > filteredPredictions.length / 2
                ? 'Bullish 📈'
                : 'Bearish 📉'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
