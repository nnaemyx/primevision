"use client";
import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Asset {
  symbol: string;
  name: string;
  price?: string;
}

interface Props {
  title: string;
  placeholder: string;
  assets: Asset[];
  onSelect?: (asset: Asset) => void;
}

export default function ExploreList({ title, placeholder, assets, onSelect }: Props) {
  const [search, setSearch] = useState("");

  const filtered = assets.filter(
    (a) =>
      a.symbol.toLowerCase().includes(search.toLowerCase()) ||
      a.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="rounded-[20px] p-5 flex flex-col gap-4 h-full" style={{ background: "#150578" }}>
      <h3 className="text-base font-semibold text-white">{title}</h3>

      {/* Search */}
      <div
        className="flex items-center gap-2 px-4 py-2.5 rounded-full"
        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <Search size={14} style={{ color: "rgba(205,202,204,0.6)" }} />
        <input
          type="text"
          placeholder={placeholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent outline-none text-sm text-[#cdcacc] placeholder:text-[#cdcacc]/50 flex-1"
        />
      </div>

      {/* List */}
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-1">
          {filtered.map((asset) => (
            <div
              key={asset.symbol}
              className="flex items-center justify-between px-3 py-2.5 rounded-[12px] transition-colors hover:bg-white/5 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-[#cdcacc]"
                  style={{ background: "#0e0e52" }}
                >
                  {asset.symbol.slice(0, 2)}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{asset.symbol}</p>
                  <p className="text-xs text-[#cdcacc] truncate max-w-[140px]">{asset.name}</p>
                </div>
              </div>
              <Button
                size="sm"
                onClick={() => onSelect?.(asset)}
                className="text-xs rounded-full h-7 px-3 font-medium"
                style={{ background: "#f5a623", color: "#fff" }}
              >
                Trade
              </Button>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="text-xs text-[#cdcacc] text-center py-4">No results found</p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
