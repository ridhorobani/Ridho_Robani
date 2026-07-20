import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface SparklineProps {
  data: number[];
  isUp: boolean;
  width?: number;
  height?: number;
}

export const Sparkline: React.FC<SparklineProps> = ({
  data,
  isUp,
  width = 120,
  height = 40,
}) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data
    .map((val, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * height;
      return `${x},${y}`;
    })
    .join(" ");

  const fillPoints = `${width},${height} 0,${height} ${points}`;

  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={`grad-${isUp ? "up" : "down"}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={isUp ? "#D4AF37" : "#EF4444"} stopOpacity="0.25" />
          <stop offset="100%" stopColor={isUp ? "#D4AF37" : "#EF4444"} stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <polygon
        points={fillPoints}
        fill={`url(#grad-${isUp ? "up" : "down"})`}
      />
      <polyline
        fill="none"
        stroke={isUp ? "#D4AF37" : "#EF4444"}
        strokeWidth="1.5"
        points={points}
      />
      <circle
        cx={width}
        cy={height - ((data[data.length - 1] - min) / range) * height}
        r="3"
        fill={isUp ? "#D4AF37" : "#EF4444"}
        className="animate-pulse"
      />
    </svg>
  );
};

interface EquityCurveProps {
  trades: Array<{ date: string; status: "WIN" | "LOSS" | "BREAKEVEN"; reward: number; market: string }>;
  initialBalance?: number;
}

export const EquityCurve: React.FC<EquityCurveProps> = ({
  trades,
  initialBalance = 10000,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Reconstruct equity history
  const history: Array<{ index: number; date: string; balance: number; tradeDesc: string }> = [
    { index: 0, date: "Start", balance: initialBalance, tradeDesc: "Initial Account Balance" },
  ];

  let currentBalance = initialBalance;
  trades.forEach((trade, i) => {
    let change = 0;
    if (trade.status === "WIN") {
      change = currentBalance * (trade.reward * 0.01); // Assuming 1% risk per 1 R
    } else if (trade.status === "LOSS") {
      change = -currentBalance * 0.01; // 1% loss
    }
    currentBalance += change;
    history.push({
      index: i + 1,
      date: trade.date,
      balance: Math.round(currentBalance * 100) / 100,
      tradeDesc: `${trade.bias || "Trade"} on ${trade.market} (${trade.status})`,
    });
  });

  const width = 600;
  const height = 240;
  const padding = 30;

  const balances = history.map((h) => h.balance);
  const maxBalance = Math.max(...balances) * 1.02;
  const minBalance = Math.min(...balances) * 0.98;
  const balanceRange = maxBalance - minBalance || 1;

  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const points = history
    .map((h, i) => {
      const x = padding + (i / (history.length - 1)) * chartWidth;
      const y = padding + chartHeight - ((h.balance - minBalance) / balanceRange) * chartHeight;
      return `${x},${y}`;
    })
    .join(" ");

  const fillPoints = `${padding + chartWidth},${padding + chartHeight} ${padding},${padding + chartHeight} ${points}`;

  return (
    <div className="relative w-full rounded-2xl border border-zinc-900 bg-zinc-950/60 p-6 backdrop-blur-md">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <span className="text-xs font-mono tracking-wider text-zinc-500 uppercase">Equity Development</span>
          <h4 className="text-xl font-medium text-white font-sans tracking-tight">
            ${currentBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h4>
        </div>
        <div className="flex gap-2 text-xs font-mono text-zinc-400">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#D4AF37]" />
            <span>Growth Curve</span>
          </div>
        </div>
      </div>

      <div className="relative h-60 w-full overflow-visible">
        <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full overflow-visible">
          <defs>
            <linearGradient id="equityGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = padding + ratio * chartHeight;
            const value = Math.round(maxBalance - ratio * balanceRange);
            return (
              <g key={i} className="opacity-20">
                <line
                  x1={padding}
                  y1={y}
                  x2={width - padding}
                  y2={y}
                  stroke="#fff"
                  strokeWidth="0.5"
                  strokeDasharray="4 4"
                />
                <text
                  x={padding - 5}
                  y={y + 4}
                  fill="#fff"
                  fontSize="8"
                  fontFamily="monospace"
                  textAnchor="end"
                  className="fill-zinc-500"
                >
                  ${value}
                </text>
              </g>
            );
          })}

          {/* Time markers */}
          {history.map((h, i) => {
            if (i === 0 || i === history.length - 1 || (history.length > 5 && i === Math.floor(history.length / 2))) {
              const x = padding + (i / (history.length - 1)) * chartWidth;
              return (
                <text
                  key={i}
                  x={x}
                  y={height - padding / 3}
                  fill="#fff"
                  fontSize="8"
                  fontFamily="monospace"
                  textAnchor="middle"
                  className="fill-zinc-500 opacity-60"
                >
                  {h.date}
                </text>
              );
            }
            return null;
          })}

          {/* Gradient Area */}
          <polygon points={fillPoints} fill="url(#equityGrad)" />

          {/* Line */}
          <polyline
            fill="none"
            stroke="#D4AF37"
            strokeWidth="2"
            points={points}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Interactive dots */}
          {history.map((h, i) => {
            const x = padding + (i / (history.length - 1)) * chartWidth;
            const y = padding + chartHeight - ((h.balance - minBalance) / balanceRange) * chartHeight;
            return (
              <g
                key={i}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="cursor-pointer"
              >
                <circle
                  cx={x}
                  cy={y}
                  r="6"
                  fill="transparent"
                />
                <circle
                  cx={x}
                  cy={y}
                  r={hoveredIndex === i ? "4" : "1.5"}
                  fill={hoveredIndex === i ? "#fff" : "#D4AF37"}
                  stroke={hoveredIndex === i ? "#D4AF37" : "transparent"}
                  strokeWidth="2"
                  className="transition-all duration-150"
                />
              </g>
            );
          })}
        </svg>

        {/* Floating Tooltip */}
        <AnimatePresence>
          {hoveredIndex !== null && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute top-1/2 left-1/2 z-10 w-48 -translate-x-1/2 -translate-y-20 rounded-xl border border-zinc-800 bg-black/90 p-3 shadow-2xl backdrop-blur-xl"
            >
              <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                {history[hoveredIndex].date}
              </div>
              <div className="mt-1 font-mono text-xs font-semibold text-[#D4AF37]">
                ${history[hoveredIndex].balance.toLocaleString()}
              </div>
              <div className="mt-1 text-[10px] leading-tight text-zinc-400">
                {history[hoveredIndex].tradeDesc}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

interface WinRateGaugeProps {
  winRate: number; // e.g. 75
}

export const WinRateGauge: React.FC<WinRateGaugeProps> = ({ winRate }) => {
  const radius = 50;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (winRate / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-zinc-900 bg-zinc-950/60 p-6 text-center backdrop-blur-md">
      <span className="text-xs font-mono tracking-wider text-zinc-500 uppercase mb-4">Historical Win Rate</span>
      <div className="relative flex items-center justify-center">
        <svg width="120" height="120" className="-rotate-90">
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="#18181b"
            strokeWidth={strokeWidth}
          />
          <motion.circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="#D4AF37"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-2xl font-semibold tracking-tight text-white font-mono">{winRate}%</span>
          <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase">Ratio</span>
        </div>
      </div>
      <div className="mt-4 text-xs text-zinc-400 leading-relaxed font-sans">
        Performance matrix verified across {winRate > 60 ? "disciplined" : "developing"} parameters.
      </div>
    </div>
  );
};
