"use client";
import { useEffect, useRef } from "react";

interface Props {
  symbol: string;
  theme?: "dark" | "light";
  height?: number;
}

export default function TradingViewWidget({ symbol, theme = "dark", height = 400 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const widget = widgetRef.current;
    if (!container || !widget) return;

    // Clear any previous widget instance
    widget.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: symbol,
      interval: "D",
      timezone: "Etc/UTC",
      theme: theme,
      style: "1",
      locale: "en",
      allow_symbol_change: false,   // lock to the futures symbol
      hide_top_toolbar: false,
      hide_legend: false,
      save_image: false,
      backgroundColor: "#150578",
      gridColor: "rgba(255,255,255,0.04)",
      hide_volume: false,
      support_host: "https://www.tradingview.com",
    });

    widget.appendChild(script);

    return () => {
      if (widget) widget.innerHTML = "";
    };
  }, [symbol, theme]);

  return (
    <div
      ref={containerRef}
      className="tradingview-widget-container w-full"
      style={{ height }}
    >
      <div
        ref={widgetRef}
        className="tradingview-widget-container__widget w-full h-full"
      />
    </div>
  );
}
