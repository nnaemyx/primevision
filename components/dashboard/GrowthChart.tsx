"use client";
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { cn } from "@/lib/utils";

interface DataPoint { month: string; value: number }
interface Props { data: DataPoint[] }

const TIME_FILTERS = ["1 hour", "24 hours", "7 days", "30 days", "3 months", "12 months"];

export default function GrowthChart({ data }: Props) {
  const [active, setActive] = useState("1 hour");

  return (
    <div className="rounded-[20px] p-6" style={{ background: "#150578" }}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Growth</h3>
      </div>

      {/* Time filter */}
      <div className="flex items-center gap-2 flex-wrap mb-6">
        {TIME_FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setActive(f)}
            className={cn(
              "text-sm px-3 py-1.5 rounded-full transition-all duration-200",
              active === f
                ? "font-semibold border"
                : "text-[#cdcacc] hover:text-white"
            )}
            style={
              active === f
                ? { border: "1px solid #e9d758", color: "#e9d758" }
                : {}
            }
          >
            {f}
          </button>
        ))}
      </div>

      <div style={{ height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fill: "#cdcacc", fontSize: 12, fontFamily: "Inter, sans-serif" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#cdcacc", fontSize: 12, fontFamily: "Inter, sans-serif" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: "#0e0e52",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                color: "#fff",
                fontSize: "13px",
              }}
              cursor={{ stroke: "rgba(255,255,255,0.1)" }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#e9d758"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 5, fill: "#e9d758", stroke: "#0e0e52", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
