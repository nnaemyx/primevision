"use client";
import { useQuery } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/api";
import { format } from "date-fns";

interface LoginLog {
  _id: string;
  user: { name: string; email: string };
  ip: string;
  userAgent: string;
  createdAt: string;
}

export default function ActivityPage() {
  const { data: logs = [], isLoading } = useQuery<LoginLog[]>({
    queryKey: ["admin-activity"],
    queryFn: async () => {
      const { data } = await api.get("/admin/activity");
      return data;
    },
  });

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Login Activity</h2>
        <p className="text-xs text-[#cdcacc]">{logs.length} login record(s)</p>
      </div>

      <div className="rounded-[20px] overflow-hidden" style={{ background: "#150578" }}>
        <Table>
          <TableHeader>
            <TableRow style={{ borderBottomColor: "rgba(255,255,255,0.08)" }}>
              {["User", "Email", "IP Address", "Device / Browser", "Time"].map((h) => (
                <TableHead key={h} className="text-[#cdcacc] text-sm font-medium py-4">{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? [...Array(5)].map((_, i) => (
                  <TableRow key={i} style={{ borderBottomColor: "rgba(255,255,255,0.04)" }}>
                    {[...Array(5)].map((_, j) => (
                      <TableCell key={j} className="py-4">
                        <Skeleton className="h-4 w-28" style={{ background: "rgba(255,255,255,0.05)" }} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : logs.map((log) => (
                  <TableRow key={log._id} style={{ borderBottomColor: "rgba(255,255,255,0.04)" }}>
                    <TableCell className="text-white text-sm py-4 font-medium">{log.user?.name ?? "—"}</TableCell>
                    <TableCell className="text-[#cdcacc] text-sm py-4">{log.user?.email ?? "—"}</TableCell>
                    <TableCell className="text-[#cdcacc] text-sm py-4 font-mono">{log.ip || "—"}</TableCell>
                    <TableCell className="text-[#cdcacc] text-xs py-4 max-w-[200px] truncate">
                      {log.userAgent?.split(" ").slice(0, 3).join(" ") || "—"}
                    </TableCell>
                    <TableCell className="text-[#cdcacc] text-sm py-4">
                      {format(new Date(log.createdAt), "dd MMM yyyy HH:mm")}
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
        {!isLoading && logs.length === 0 && (
          <p className="text-sm text-[#cdcacc] text-center py-10">No login activity recorded yet</p>
        )}
      </div>
    </div>
  );
}
