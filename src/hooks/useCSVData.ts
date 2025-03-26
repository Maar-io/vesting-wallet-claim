import { useState, useEffect } from 'react';;
import { BalanceData, ClaimData } from '../types';
import { getBaseUrl } from '../utils/urls';

/**
 * Custom hook to fetch and parse CSV data
 */
export function useCSVData() {
  const [claimsData, setClaimsData] = useState<ClaimData[]>([]);
  const [balancesData, setBalancesData] = useState<BalanceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const loadCSVData = async () => {
    try {
      setIsLoading(true);

      const baseUrl = getBaseUrl();
      console.log('Base URL:', baseUrl); // Debug log

      // Load claims.csv with type assertion
      const claimsResponse = await fetch(`${baseUrl}/data/claims.csv`);
      if (!claimsResponse.ok) {
        throw new Error(`Failed to load claims.csv: ${claimsResponse.statusText}`);
      }
      const claimsText = await claimsResponse.text();
      const claimsParsed = parseCSV<ClaimData>(claimsText);

      // Load non_zero_balances.csv with type assertion
      const balancesResponse = await fetch(`${baseUrl}/data/non_zero_balances.csv`);
      if (!balancesResponse.ok) {
        throw new Error(`Failed to load balances.csv: ${balancesResponse.statusText}`);
      }
      const balancesText = await balancesResponse.text();
      const balancesParsed = parseCSV<BalanceData>(balancesText);

      setClaimsData(claimsParsed);
      setBalancesData(balancesParsed);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      console.error('Data loading error:', err); // Added debug log
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCSVData();
  }, []);

  const refreshData = () => {
    loadCSVData();
  };

  return {
    claimsData,
    balancesData,
    isLoading,
    error,
    lastUpdated,
    refreshData
  };
}


function parseCSV<T extends Record<string, string>>(csv: string): T[] {
  const [headers, ...rows] = csv.trim().split('\n');
  const headerColumns = headers.split(',');

  return rows.map(row => {
    const values = row.split(',');
    const parsedRow = headerColumns.reduce((obj, header, index) => {
      obj[header.trim()] = values[index].trim();
      return obj;
    }, {} as Record<string, string>);

    // Validate the required fields based on type
    const isClaimData = 'account' in parsedRow &&
      'vestingWallet' in parsedRow &&
      'amount' in parsedRow;
    const isBalanceData = 'vestingWallet' in parsedRow &&
      'amount' in parsedRow;

    if (!isClaimData && !isBalanceData) {
      throw new Error('Invalid CSV format: missing required fields');
    }

    return parsedRow as T;
  });
}