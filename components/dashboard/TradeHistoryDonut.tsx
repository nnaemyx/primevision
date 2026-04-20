"use client";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { ExternalLink } from "lucide-react";

interface Props {
  distribution: { stocks: number; futures: number; crypto: number };
}

export default function TradeHistoryDonut({ distribution }: Props) {
  const total = distribution.stocks + distribution.futures + distribution.crypto || 1;
  const data = [
    { name: "Stocks", value: (distribution.stocks / total) * 100, color: "#0e0e52" },
    { name: "Crypto", value: (distribution.crypto / total) * 100, color: "#f77f00" },
    { name: "Futures", value: (distribution.futures / total) * 100, color: "#150578" },
  ];

  return (
    <div
      className="rounded-[20px] p-6 flex flex-col gap-4"
      style={{ background: "#e9d758" }}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium" style={{ color: "#0e0e52" }}>Trade History</p>
        <button className="flex items-center gap-1 text-xs font-medium" style={{ color: "#0e0e52" }}>
          View Details <ExternalLink size={12} />
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div style={{ width: 120, height: 120 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={38}
                outerRadius={55}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 justify-center">
        {data.map((d) => (
          <div key={d.name} className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ background: d.color }}
            />
            <span className="text-xs font-medium" style={{ color: "#0e0e52" }}>{d.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
