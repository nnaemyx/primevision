"use client";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trade } from "@/lib/types";
import { format } from "date-fns";

interface Props {
  openOrders: Trade[];
  filledOrders: Trade[];
  tradeHistory: Trade[];
  market?: string;
}

const statusColors: Record<string, { bg: string; text: string }> = {
  open: { bg: "rgba(233,215,88,0.15)", text: "#e9d758" },
  filled: { bg: "rgba(16,185,129,0.15)", text: "#10b981" },
  cancelled: { bg: "rgba(239,68,68,0.15)", text: "#ef4444" },
};

function OrdersTable({ orders }: { orders: Trade[] }) {
  if (!orders.length) {
    return <p className="text-sm text-[#cdcacc] text-center py-10">You have no active positions</p>;
  }
  return (
    <Table>
      <TableHeader>
        <TableRow style={{ borderBottomColor: "rgba(255,255,255,0.08)" }}>
          {["Symbol", "Size", "Execution Price", "TP/SL", "Duration", "Status"].map((h) => (
            <TableHead key={h} className="text-[#cdcacc] text-sm font-medium py-3">{h}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((o) => (
          <TableRow key={o._id} style={{ borderBottomColor: "rgba(255,255,255,0.04)" }}>
            <TableCell className="text-white text-sm py-3 font-medium">{o.symbol}</TableCell>
            <TableCell className="text-white text-sm py-3">{o.quantity}</TableCell>
            <TableCell className="text-white text-sm py-3" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
              ${(o.executionPrice ?? o.price).toLocaleString()}
            </TableCell>
            <TableCell className="text-[#cdcacc] text-sm py-3">
              {o.takeProfit ?? "—"} / {o.stopLoss ?? "—"}
            </TableCell>
            <TableCell className="text-[#cdcacc] text-sm py-3">
              {o.lockingPeriod ?? format(new Date(o.createdAt), "MMM d")}
            </TableCell>
            <TableCell className="py-3">
              <span
                className="text-xs font-medium px-2.5 py-1 rounded-full capitalize"
                style={{ background: statusColors[o.status]?.bg, color: statusColors[o.status]?.text }}
              >
                {o.status}
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default function OrderTabs({ openOrders, filledOrders, tradeHistory }: Props) {
  return (
    <div className="rounded-[20px] p-5" style={{ background: "#150578" }}>
      <Tabs defaultValue="open">
        <TabsList
          className="bg-transparent border-b w-full justify-start rounded-none gap-6 px-0 mb-4"
          style={{ borderBottomColor: "rgba(255,255,255,0.08)" }}
        >
          {[
            { value: "open", label: "Open Orders" },
            { value: "filled", label: "Filled" },
            { value: "history", label: "Trade History" },
          ].map((t) => (
            <TabsTrigger
              key={t.value}
              value={t.value}
              className="pb-3 px-0 rounded-none text-[#cdcacc] text-sm font-medium data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-[#f5a623] bg-transparent"
            >
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="open">
          <OrdersTable orders={openOrders} />
        </TabsContent>
        <TabsContent value="filled">
          <OrdersTable orders={filledOrders} />
        </TabsContent>
        <TabsContent value="history">
          <OrdersTable orders={tradeHistory} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
