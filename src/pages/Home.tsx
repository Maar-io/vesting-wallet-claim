import React, { useEffect } from "react";
import { useAccount } from "wagmi";
import { ClaimButton } from "../components";
import { formatAddress, formatTokenAmount } from "../utils/formatters";
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
        <h1 className="home-title">Vesting Wallet Claim</h1>
        <div className="welcome-card">
          <div className="welcome-emoji">👋</div>
          <h2 className="welcome-heading">Welcome</h2>
          <p className="welcome-text">
            Connect your wallet to check your vesting status and claim available
            tokens.
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
          <div className="info-field-value">{userAddress}</div>
          <p className="welcome-text">
            If you believe this is an error, please ensure you're connected with
            the correct wallet address.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="home-container">
      <h1 className="home-title">Vesting Wallet Claim</h1>

      <div className="cards-grid">
        {/* Address Card */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Your Address</h2>
          </div>
          <div className="card-content">
            <div className="info-value address">
              {userAddress || ""}
              <button
                className="copy-button"
                onClick={() => navigator.clipboard.writeText(userAddress || "")}
              >
                Copy
              </button>
            </div>
          </div>
        </div>

        {/* Vesting Wallet Card */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Vesting Wallet</h2>
          </div>
          <div className="card-content">
            <div className="info-value address">
              {vestingWallet || ""}
              <button
                className="copy-button"
                onClick={() =>
                  navigator.clipboard.writeText(vestingWallet || "")
                }
              >
                Copy
              </button>
            </div>
          </div>
        </div>

        {/* Balance & Claim Card */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Available Balance</h2>
          </div>
          <div className="card-content">
            <div className="balance-display">
              {formatTokenAmount(balance, 18, "ASTR")}
            </div>

            {txStatus === TransactionStatus.SUCCESS && (
              <div className="alert success">
                <span>✓</span>
                <p>Your tokens have been successfully claimed.</p>
              </div>
            )}

            {txStatus === TransactionStatus.ERROR && (
              <div className="alert error">
                <span>!</span>
                <p>
                  {txError ||
                    "An error occurred while processing your transaction."}
                </p>
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
                {isLoading ? "Refreshing..." : "Refresh Data"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
