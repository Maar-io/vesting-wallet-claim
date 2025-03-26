// App state types
export interface AppState {
  isConnected: boolean;
  userAddress: string | null;
  vestingWallet: string | null;
  balance: bigint;
  canClaim: boolean;
}

// CSV data types
export interface ClaimEntry {
  account: string;
  vestingWallet: string;
  amount: string;
}

export interface BalanceEntry {
  vestingWallet: string;
  amount: string;
}

// Transaction states
export enum TransactionStatus {
  IDLE = 'idle',
  PENDING = 'pending',
  SUCCESS = 'success',
  ERROR = 'error'
}

// Component props
export interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  change?: string;
  isLoading?: boolean;
}

export interface ClaimButtonProps {
  disabled: boolean;
  onClick: () => void;
  isLoading: boolean;
}

export interface ClaimData extends Record<string, string> {
  account: string;
  vestingWallet: string;
  amount: string;
}

export interface BalanceData extends Record<string, string> {
  vestingWallet: string;
  amount: string;
}

export interface DashboardStats {
  totalContracts: number;
  activeContractCount: number;
  zeroBalanceCount: number;
  totalUnclaimedAmount: bigint;
}