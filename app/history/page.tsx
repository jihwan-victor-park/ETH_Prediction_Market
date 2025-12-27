"use client";

import { useState } from "react";
import Header from "../../src/abi/components/Header";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Generate simulated 1-year historical data
function generateHistoricalData() {
  const data = [];
  const now = new Date();
  const basePrice = 3200; // Base ETH price

  // Generate data for 365 days (1 year)
  for (let i = 365; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    // Create realistic price movement with trends and volatility
    const trend = Math.sin(i / 60) * 400; // Long-term wave
    const shortTrend = Math.sin(i / 15) * 150; // Short-term fluctuation
    const noise = (Math.random() - 0.5) * 100; // Daily noise
    const price = basePrice + trend + shortTrend + noise;

    data.push({
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      fullDate: date.toLocaleDateString(),
      price: Math.max(price, 1500), // Min price floor
    });
  }

  return data;
}

export default function HistoryPage() {
  const [timeframe, setTimeframe] = useState<"1M" | "3M" | "6M" | "1Y">("1Y");
  const [historicalData] = useState(generateHistoricalData());

  // Filter data based on timeframe
  const getFilteredData = () => {
    const daysMap = { "1M": 30, "3M": 90, "6M": 180, "1Y": 365 };
    const days = daysMap[timeframe];
    return historicalData.slice(-days);
  };

  const filteredData = getFilteredData();
  const currentPrice = filteredData[filteredData.length - 1]?.price || 0;
  const startPrice = filteredData[0]?.price || 0;
  const priceChange = ((currentPrice - startPrice) / startPrice) * 100;

  const minPrice = Math.min(...filteredData.map((d) => d.price)) - 100;
  const maxPrice = Math.max(...filteredData.map((d) => d.price)) + 100;

  return (
    <main className="min-h-screen bg-[var(--bg-primary)]">
      <Header account={null} onConnect={() => {}} />

      <div className="max-w-[1400px] mx-auto px-8 py-16">
        <div className="mb-12">
          <h1 className="text-5xl font-light tracking-tight mb-4 text-[var(--text-primary)]">
            ETH Price History
          </h1>
          <p className="text-lg text-[var(--text-secondary)]">
            Historical Ethereum price data and trends
          </p>
        </div>

        {/* Price Summary */}
        <div className="clean-card p-8 mb-8 animate-fade-in">
          <div className="flex items-baseline gap-4 mb-6">
            <p className="text-5xl font-light text-[var(--text-primary)]">
              ${currentPrice.toFixed(2)}
            </p>
            <span
              className={`text-sm font-light uppercase tracking-wider ${
                priceChange >= 0
                  ? "text-[var(--accent-green)]"
                  : "text-[var(--accent-red)]"
              }`}
            >
              {priceChange >= 0 ? "↑" : "↓"} {Math.abs(priceChange).toFixed(2)}%
            </span>
            <span className="text-xs text-[var(--text-secondary)] uppercase tracking-wide">
              {timeframe}
            </span>
          </div>

          {/* Timeframe Selector */}
          <div className="flex gap-2">
            {(["1M", "3M", "6M", "1Y"] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-4 py-2 text-xs uppercase tracking-wider transition-colors ${
                  timeframe === tf
                    ? "bg-[var(--accent-green)] text-black"
                    : "border border-[var(--border-primary)] text-[var(--text-secondary)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)]"
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div className="clean-card p-8 animate-fade-in">
          <div className="w-full" style={{ height: "600px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={filteredData}
                margin={{ top: 20, right: 40, left: 20, bottom: 20 }}
              >
                <defs>
                  <linearGradient id="historyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00ff88" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#00ff88" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="1 4"
                  stroke="var(--border-primary)"
                  opacity={0.5}
                />
                <XAxis
                  dataKey="date"
                  stroke="var(--text-secondary)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  interval={Math.floor(filteredData.length / 8)}
                />
                <YAxis
                  domain={[minPrice, maxPrice]}
                  stroke="var(--text-secondary)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value.toFixed(0)}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--bg-card)",
                    border: "1px solid var(--border-primary)",
                    borderRadius: "0",
                    fontSize: "12px",
                    color: "var(--text-primary)",
                    padding: "12px",
                  }}
                  labelStyle={{
                    color: "var(--text-secondary)",
                    marginBottom: "8px",
                    fontSize: "10px",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  }}
                  formatter={(value: number) => [`$${value.toFixed(2)}`, "ETH/USD"]}
                  cursor={{
                    stroke: "var(--accent-primary)",
                    strokeWidth: 1,
                    strokeDasharray: "2 2",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="var(--accent-green)"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{
                    r: 5,
                    fill: "var(--accent-green)",
                    stroke: "var(--bg-primary)",
                    strokeWidth: 2,
                  }}
                  fill="url(#historyGradient)"
                  isAnimationActive={true}
                  animationDuration={800}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="clean-card p-6">
            <p className="text-xs uppercase tracking-wider text-[var(--text-secondary)] mb-2">
              Period High
            </p>
            <p className="text-3xl font-light text-[var(--accent-green)]">
              ${maxPrice.toFixed(2)}
            </p>
          </div>
          <div className="clean-card p-6">
            <p className="text-xs uppercase tracking-wider text-[var(--text-secondary)] mb-2">
              Period Low
            </p>
            <p className="text-3xl font-light text-[var(--accent-red)]">
              ${minPrice.toFixed(2)}
            </p>
          </div>
          <div className="clean-card p-6">
            <p className="text-xs uppercase tracking-wider text-[var(--text-secondary)] mb-2">
              Volatility
            </p>
            <p className="text-3xl font-light text-[var(--text-primary)]">
              {Math.abs(priceChange).toFixed(1)}%
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
