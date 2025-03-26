import { ClaimEntry, BalanceEntry } from '../types';

/**
 * Checks if an address is a valid Ethereum address
 * @param address Address to check
 * @returns Boolean indicating if address is valid
 */
export const isValidAddress = (address: string | null | undefined): boolean => {
  if (!address) return false;
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

/**
 * Sleep function for adding delays
 * @param ms Milliseconds to sleep
 * @returns Promise that resolves after specified milliseconds
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Compares two addresses for equality (case-insensitive)
 * @param address1 First address
 * @param address2 Second address
 * @returns Boolean indicating if addresses are equal
 */
export const areAddressesEqual = (
  address1: string | null | undefined,
  address2: string | null | undefined
): boolean => {
  if (!address1 || !address2) return false;
  return address1.toLowerCase() === address2.toLowerCase();
};

/**
 * Processes the claims CSV data to find a user's vesting wallet
 * @param claimsData Array of claim entries from CSV
 * @param userAddress User's Ethereum address
 * @returns Vesting wallet address if found, null otherwise
 */
export const findVestingWalletFromClaims = (
  claimsData: ClaimEntry[],
  userAddress: string
): string | null => {
  const entry = claimsData.find(claim => 
    areAddressesEqual(claim.account, userAddress)
  );
  return entry ? entry.vestingWallet : null;
};

/**
 * Calculates dashboard statistics from the CSV data
 * @param balancesData Non-zero balances data from CSV
 * @param claimsData Claims data from CSV
 * @returns Object with calculated statistics
 */
export const calculateDashboardStats = (
  balancesData: BalanceEntry[],
  claimsData: ClaimEntry[]
) => {
  const totalContracts = claimsData.length;
  const activeContractCount = balancesData.length;
  const zeroBalanceCount = totalContracts - activeContractCount;
  
  // Calculate total unclaimed amount
  const totalUnclaimedAmount = balancesData.reduce((sum, entry) => {
    return sum + BigInt(entry.amount);
  }, 0n);
  
  return {
    totalContracts,
    zeroBalanceCount,
    activeContractCount,
    totalUnclaimedAmount: totalUnclaimedAmount.toString(),
    lastUpdated: new Date()
  };
};

/**
 * Handles errors and extracts readable messages
 * @param error Error object
 * @returns Human-readable error message
 */
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return String(error);
};
