import { useState, useEffect, useCallback } from 'react';
import Papa from 'papaparse';
import { ClaimEntry, BalanceEntry } from '../types';

/**
 * Custom hook to fetch and parse CSV data
 */
export const useCSVData = () => {
  const [claimsData, setClaimsData] = useState<ClaimEntry[]>([]);
  const [balancesData, setBalancesData] = useState<BalanceEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  /**
   * Fetches and parses a CSV file
   * @param url URL of the CSV file to fetch
   * @returns Parsed CSV data as an array of objects
   */
  const fetchCSV = async <T>(url: string): Promise<T[]> => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
      }
      
      const csvText = await response.text();
      
      return new Promise((resolve, reject) => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          dynamicTyping: true,
          complete: (results) => {
            resolve(results.data as T[]);
          },
          error: (error) => {
            reject(new Error(`CSV parsing error: ${error}`));
          }
        });
      });
    } catch (err) {
      throw new Error(`Error fetching CSV: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  /**
   * Refreshes all CSV data
   */
  const refreshData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch both CSVs in parallel
      const [claims, balances] = await Promise.all([
        fetchCSV<ClaimEntry>('/claims.csv'),
        fetchCSV<BalanceEntry>('/non_zero_balances.csv')
      ]);
      
      setClaimsData(claims);
      setBalancesData(balances);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial data load
  useEffect(() => {
    refreshData();
    
    // Set up auto-refresh every 5 minutes
    const intervalId = setInterval(refreshData, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [refreshData]);

  return {
    claimsData,
    balancesData,
    isLoading,
    error,
    lastUpdated,
    refreshData
  };
};
