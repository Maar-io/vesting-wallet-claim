import { useState, useEffect, useCallback } from 'react';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { TransactionStatus } from '../types';
import { YOKI_AIRDROP_ADDRESS, ASTR_TOKEN_ADDRESS, YOKI_AIRDROP_ABI, ERC20_ABI, VESTING_WALLET_ABI } from '../config/contracts';
import { findVestingWalletFromClaims } from '../utils/helpers';
import { useCSVData } from './useCSVData';

export const useVestingWallet = () => {
  const { address: userAddress, isConnected } = useAccount();
  const { claimsData } = useCSVData();
  
  const [vestingWallet, setVestingWallet] = useState<string | null>(null);
  const [balance, setBalance] = useState<bigint>(0n);
  const [canClaim, setCanClaim] = useState<boolean>(false);
  const [txStatus, setTxStatus] = useState<TransactionStatus>(TransactionStatus.IDLE);
  const [txError, setTxError] = useState<string | null>(null);

  // Read the vesting wallet address from the YOKI_AIRDROP contract
  const { data: contractVestingWallet, refetch: refetchVestingWallet } = useReadContract({
    address: YOKI_AIRDROP_ADDRESS,
    abi: YOKI_AIRDROP_ABI,
    functionName: 'vestingWalletsMap',
    args: [userAddress as `0x${string}`],
    enabled: Boolean(isConnected && userAddress),
  });

  // Read the balance of ASTR tokens in the vesting wallet
  const { data: vestingBalance, refetch: refetchBalance } = useReadContract({
    address: ASTR_TOKEN_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: [vestingWallet as `0x${string}`],
    enabled: Boolean(vestingWallet),
  });

  // Prepare the release transaction
  const { writeContract, isPending } = useWriteContract();

  // Update the vesting wallet address
  useEffect(() => {
    if (!userAddress) {
      setVestingWallet(null);
      return;
    }

    const updateVestingWallet = async () => {
      // First try to get it from the contract
      if (contractVestingWallet && contractVestingWallet !== '0x0000000000000000000000000000000000000000') {
        setVestingWallet(contractVestingWallet);
        return;
      }
      
      // If not found in contract, try to find it in CSV data
      if (claimsData.length > 0) {
        const csvVestingWallet = findVestingWalletFromClaims(claimsData, userAddress);
        if (csvVestingWallet) {
          setVestingWallet(csvVestingWallet);
          return;
        }
      }
      
      // If not found anywhere, reset
      setVestingWallet(null);
    };

    updateVestingWallet();
  }, [userAddress, contractVestingWallet, claimsData]);

  // Update balance and claiming status
  useEffect(() => {
    if (vestingBalance) {
      setBalance(vestingBalance);
      setCanClaim(vestingBalance > 0n);
    } else {
      setBalance(0n);
      setCanClaim(false);
    }
  }, [vestingBalance]);

  // Refresh all data
  const refreshData = useCallback(async () => {
    if (isConnected) {
      await refetchVestingWallet();
      if (vestingWallet) {
        await refetchBalance();
      }
    }
  }, [isConnected, refetchVestingWallet, refetchBalance, vestingWallet]);

  // Claim function
  const claim = useCallback(async () => {
    if (!isConnected || !vestingWallet || !canClaim) {
      return;
    }

    try {
      setTxStatus(TransactionStatus.PENDING);
      setTxError(null);

      writeContract({
        address: vestingWallet as `0x${string}`,
        abi: VESTING_WALLET_ABI,
        functionName: 'release',
        args: [ASTR_TOKEN_ADDRESS as `0x${string}`],
        onSuccess: () => {
          setTxStatus(TransactionStatus.SUCCESS);
          // Refresh data after successful transaction
          setTimeout(() => refreshData(), 2000);
        },
        onError: (error) => {
          setTxStatus(TransactionStatus.ERROR);
          setTxError(error.message || 'Transaction failed');
        },
      });
    } catch (error) {
      setTxStatus(TransactionStatus.ERROR);
      setTxError(error instanceof Error ? error.message : 'Unknown error occurred');
    }
  }, [isConnected, vestingWallet, canClaim, writeContract, refreshData]);

  return {
    userAddress,
    isConnected,
    vestingWallet,
    balance,
    canClaim,
    claim,
    txStatus,
    txError,
    isLoading: isPending,
    refreshData,
  };
};
