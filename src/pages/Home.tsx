import React, { useEffect } from "react";
import { useAccount } from "wagmi";
import { ClaimButton } from "../components";
import { formatTokenAmount, formatAddress } from "../utils/formatters";
import { useVestingWallet } from "../hooks/useVestingWallet";
import { TransactionStatus } from "../types";
import "./Home.css";

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
        <h1 className="home-title">AstarZkEvm Forgotten Claims</h1>
        <div className="welcome-card">
          <div className="welcome-emoji">👋</div>
          <h2 className="welcome-heading">Welcome</h2>
          <p className="welcome-text">
          Missed out on claiming your ASTR tokens from the AstarZkEVM airdrop? No worries! You can still grab them right here.
          </p>
          <div className="welcome-connect-notice">
            Please connect your wallet using the button in the top right corner to check eligibility.
          </div>
        </div>
      </div>
    );
  }

  // Content when user has no vesting wallet
  if (!vestingWallet) {
    return (
      <div className="home-container">
        <h1 className="home-title">AstarZkEvm Forgotten Claims</h1>
        <div className="welcome-card">
          <div className="welcome-emoji">🔍</div>
          <h2 className="welcome-heading">No Vesting Wallet Found</h2>
          <p className="welcome-text">
            We couldn't find a vesting wallet associated with your address:
          </p>
          <div className="info-field-value">{userAddress}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="home-container">
      <h1 className="home-title">AstarZkEvm Forgotten Claims</h1>
      <p className="home-description">
        Claim your vested ASTR tokens from your vesting contract
      </p>

      <div className="cards-container">
        {/* User Info Card */}
        <div className="card info-card">
          <div className="card-header">
            <h2 className="card-title">Your Information</h2>
          </div>
          <div className="card-content">
            <div className="info-group">
              <label>Connected Address</label>
              <div className="info-value address">
                {formatAddress(userAddress || "")}
                <button
                  className="icon-button"
                  onClick={() => navigator.clipboard.writeText(userAddress || "")}
                  title="Copy address"
                >
                  📋
                </button>
                <a
                  href={`https://astar-zkevm.explorer.startale.com/address/${userAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="icon-button"
                  title="View in explorer"
                >
                  ↗
                </a>
              </div>
            </div>
            <div className="info-group">
              <label>Vesting Contract</label>
              <div className="info-value address">
                {formatAddress(vestingWallet)}
                <button
                  className="icon-button"
                  onClick={() => navigator.clipboard.writeText(vestingWallet || "")}
                  title="Copy address"
                >
                  📋
                </button>
                <a
                  href={`https://astar-zkevm.explorer.startale.com/address/${vestingWallet}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="icon-button"
                  title="View in explorer"
                >
                  ↗
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Claim Card */}
        <div className="card claim-card">
          <div className="card-header">
            <h2 className="card-title">Available Balance</h2>
          </div>
          <div className="card-content">
            <div className="balance-display">
              <span className="balance-amount">{formatTokenAmount(balance, 18)}</span>
              <span className="balance-symbol">ASTR</span>
            </div>

            {txStatus === TransactionStatus.SUCCESS && (
              <div className="alert success">
                <span className="alert-icon">✓</span>
                <p>Tokens successfully claimed!</p>
              </div>
            )}

            {txStatus === TransactionStatus.ERROR && (
              <div className="alert error">
                <span className="alert-icon">⚠️</span>
                <p>{txError || "Transaction failed"}</p>
              </div>
            )}

            <div className="actions">
              <ClaimButton
                disabled={!canClaim}
                onClick={claim}
                isLoading={isLoading || txStatus === TransactionStatus.PENDING}
              />
              <button
                onClick={refreshData}
                className="secondary-button"
                disabled={isLoading}
              >
                {isLoading ? "Refreshing..." : "Refresh"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
