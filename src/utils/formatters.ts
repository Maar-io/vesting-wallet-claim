/**
 * Formats a wallet address for display by shortening it
 * @param address Ethereum address to format
 * @returns Shortened address (e.g., 0x1234...5678)
 */
export const formatAddress = (address: string | null | undefined): string => {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

/**
 * Formats a number to a human-readable string with specified decimal places
 * @param value Number to format
 * @param decimals Number of decimal places
 * @returns Formatted number as a string
 */
export const formatNumber = (value: number | bigint, decimals = 2): string => {
  const numberValue = typeof value === 'bigint' ? Number(value) : value;
  
  // Format the number based on size
  if (numberValue >= 1_000_000) {
    return `${(numberValue / 1_000_000).toFixed(decimals)}M`;
  } else if (numberValue >= 1_000) {
    return `${(numberValue / 1_000).toFixed(decimals)}K`;
  }
  
  return numberValue.toFixed(decimals);
};

/**
 * Formats a bigint token amount to a human-readable string with token decimals
 * @param amount Token amount as bigint
 * @param decimals Token decimals (default: 18 for most ERC20 tokens)
 * @param symbol Token symbol to append (optional)
 * @returns Formatted token amount as a string
 */
export function formatTokenAmount(amount: bigint, decimals: number = 18, symbol?: string): string {
  try {
    // For ASTR, we don't need to handle decimals as amounts are in whole tokens
    const formatted = amount.toString();
    return symbol ? `${formatted} ${symbol}` : formatted;
  } catch (error) {
    console.error('Error formatting token amount:', amount, error);
    return '0';
  }
}

export function parseTokenAmount(amount: string): bigint {
  try {
    // Remove any existing decimals as we'll normalize to 18 decimals
    const cleanAmount = amount.replace(/[^0-9.]/g, '');
    const [integerPart, decimalPart = ''] = cleanAmount.split('.');
    
    // Handle the case where the amount is just a decimal (e.g., ".5")
    const normalizedInteger = integerPart || '0';
    
    // Don't pad decimals for ASTR as it's already in the correct format
    return BigInt(normalizedInteger);
  } catch (error) {
    console.error('Error parsing token amount:', amount, error);
    return BigInt(0);
  }
}

/**
 * Formats a date to a readable string
 * @param date Date to format
 * @returns Formatted date string
 */
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(date);
};

/**
 * Formats a timestamp to a relative time string (e.g., "5 minutes ago")
 * @param timestamp Date or timestamp to format
 * @returns Relative time string
 */
export const formatRelativeTime = (timestamp: Date | number): string => {
  const now = new Date();
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minute(s) ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hour(s) ago`;
  return `${Math.floor(seconds / 86400)} day(s) ago`;
};
