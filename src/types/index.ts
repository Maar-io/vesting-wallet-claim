// App state types
export interface AppState {
  isConnected: boolean;
  userAddress: string | null;
  vestingWallet: string | null;
  balance: bigint;
  canClaim: boolean;
}

// Dashboard statistics types
export interface DashboardStats {
  totalContracts: number;
  zeroBalanceCount: number;
  activeContractCount: number;
  totalUnclaimedAmount: string;
  lastUpdated: Date;
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
