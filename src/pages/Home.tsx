import React, { useEffect } from 'react';
import { useAccount } from 'wagmi';
import { ClaimButton } from '../components';
import { formatAddress, formatTokenAmount } from '../utils/formatters';
import { useVestingWallet } from '../hooks/useVestingWallet';
import { TransactionStatus } from '../types';
import './Home.css';

const Home: React.FC = () => {
  const { isConnected } = useAccount();
  const {
    userAddress,
    vestingWallet,
    balance,
    canClaim,
    claim,
    txStatus,
    txError,
    isLoading,
    refreshData,
  } = useVestingWallet();

  // Refresh data when connection state changes
  useEffect(() => {
    refreshData();
  }, [isConnected, refreshData]);

  // Content for when user is not connected
  if (!isConnected) {
    return (
      <div className="home-container">
        <h1 className="home-title">Vesting Wallet Claim</h1>
        <div className="welcome-card">
          <div className="welcome-emoji">👋</div>
          <h2 className="welcome-heading">Welcome</h2>
          <p className="welcome-text">
            Connect your wallet to check your vesting status and claim available tokens.
          </p>
          <div className="welcome-connect-notice">
            Please connect your wallet using the button in the top right corner.
          </div>
        </div>
      </div>
    );
  }

  // Content when user has no vesting wallet
  if (!vestingWallet) {
    return (
      <div className="home-container">
        <h1 className="home-title">Vesting Wallet Claim</h1>
        <div className="welcome-card">
          <div className="welcome-emoji">🔍</div>
          <h2 className="welcome-heading">No Vesting Wallet Found</h2>
          <p className="welcome-text">
            We couldn't find a vesting wallet associated with your address:
          </p>
          <div className="info-field-value">
            {userAddress}
          </div>
          <p className="welcome-text">
            If you believe this is an error, please ensure you're connected with the correct wallet address.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="home-container">
      <h1 className="home-title">Vesting Wallet Claim</h1>
      
      {/* User Info Card */}
      <div className="info-card">
        <h2 className="info-card-title">Your Vesting Information</h2>
        
        <div className="info-field">
          <p className="info-field-label">Your Address</p>
          <p className="info-field-value">{userAddress}</p>
        </div>
        
        <div className="info-field">
          <p className="info-field-label">Vesting Wallet</p>
          <p className="info-field-value">{vestingWallet}</p>
        </div>
        
        <div className="info-field">
          <p className="info-field-label">Available Balance</p>
          <p className="balance-value">
            {formatTokenAmount(balance, 18, 'ASTR')}
          </p>
        </div>
      </div>
      
      {/* Claim Card */}
      <div className="info-card">
        <h2 className="info-card-title">Claim Tokens</h2>
        
        {txStatus === TransactionStatus.SUCCESS && (
          <div className="transaction-success">
            <div className="font-medium">Success!</div>
            <p>Your tokens have been successfully claimed.</p>
          </div>
        )}
        
        {txStatus === TransactionStatus.ERROR && (
          <div className="transaction-error">
            <div className="font-medium">Error</div>
            <p>{txError || 'An error occurred while processing your transaction.'}</p>
          </div>
        )}
        
        {!canClaim && (
          <div className="no-tokens-notice">
            <p>You don't have any tokens available to claim at the moment.</p>
          </div>
        )}
        
        <ClaimButton
          disabled={!canClaim}
          onClick={claim}
          isLoading={isLoading || txStatus === TransactionStatus.PENDING}
        />
        
        <button
          onClick={refreshData}
          className="refresh-button"
        >
          Refresh Data
        </button>
      </div>
    </div>
  );
};

export default Home;
