export type UserRole = "user" | "admin";
export type TradeStatus = "open" | "filled" | "cancelled";
export type TxStatus = "pending" | "completed" | "rejected";
export type Market = "stocks" | "futures" | "crypto";
export type OrderType = "market" | "limit";
export type TradeSide = "long" | "short";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  balance: number;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface Trade {
  _id: string;
  user: string;
  symbol: string;
  market: Market;
  type: OrderType;
  side: TradeSide;
  price: number;
  amount: number;
  quantity: number;
  stopLoss?: number;
  takeProfit?: number;
  leverage?: number;
  lockingPeriod?: string;
  status: TradeStatus;
  executionPrice?: number;
  pnl?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  _id: string;
  user: string | { _id: string; name: string; email: string };
  type: "deposit" | "withdrawal";
  amount: number;
  method: string;
  status: TxStatus;
  reference?: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CopyTrader {
  _id: string;
  name: string;
  avatar: string;
  bio: string;
  copiers: number;
  roi30d: number;
  roi2y: number;
  totalProfit: number;
  winRatio: number;
  avgRiskScore: number;
  profitableWeeks: number;
  rating: number;
  totalGains: number;
  totalLoss: number;
  totalFollowers: number;
  minAccountThreshold: number;
  currentPositions: number;
  activeSince: string;
  performanceData: Array<{ month: string; value: number }>;
  topTrades: Array<{ symbol: string; profit: number }>;
}

export interface PortfolioBalance {
  balance: number;
  pnlValue: number;
  pnlPercent: number;
  distribution: {
    stocks: number;
    futures: number;
    crypto: number;
  };
}

export interface AdminStats {
  totalUsers: number;
  pendingWithdrawals: number;
  totalVolume: number;
  totalTrades: number;
}
