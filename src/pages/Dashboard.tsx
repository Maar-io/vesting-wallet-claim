import React from "react";
import { StatCard } from "../components";
import { useCSVData } from "../hooks/useCSVData";
import { calculateDashboardStats } from "../utils/helpers";
import {
  formatTokenAmount,
  formatRelativeTime,
  formatAddress,
  parseTokenAmount,
} from "../utils/formatters";

import "./Dashboard.css";

const Dashboard: React.FC = () => {
  const {
    claimsData,
    balancesData,
    isLoading,
    error,
    lastUpdated,
    refreshData,
  } = useCSVData();

  // Calculate stats from CSV data
  const stats = calculateDashboardStats(balancesData, claimsData);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Vesting Contracts Dashboard</h1>
        <div className="dashboard-controls">
          <span className="last-updated">
            Last updated: {formatRelativeTime(lastUpdated)}
          </span>
          <button
            onClick={refreshData}
            className="refresh-button"
            disabled={isLoading}
          >
            {isLoading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      {error && (
        <div className="error-alert">
          <div className="error-alert-title">Error Loading Data</div>
          <p>{error}</p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="stats-grid">
        <StatCard
          title="Total Vesting Contracts"
          value={stats.totalContracts.toString()}
          isLoading={isLoading}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          }
        />
        <StatCard
          title="Active Contracts"
          value={stats.activeContractCount.toString()}
          isLoading={isLoading}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />
        <StatCard
          title="Zero Balance Contracts"
          value={stats.zeroBalanceCount.toString()}
          isLoading={isLoading}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
              />
            </svg>
          }
        />
        <StatCard
          title="Total Unclaimed ASTR"
          value={formatTokenAmount(stats.totalUnclaimedAmount, 18, "ASTR")}
          isLoading={isLoading}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />
      </div>

      {/* Vesting Contracts Table */}
      <div className="contracts-table-container">
        <div className="contracts-table-header">
          <h2 className="contracts-table-title">Active Vesting Contracts</h2>
        </div>
        <div className="contracts-table-overflow">
          <table className="contracts-table">
            <thead>
              <tr>
                <th>Vesting Wallet</th>
                <th>User Address</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                // Loading skeletons for table rows
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index} className="loading-row">
                    <td>
                      <div className="loading-placeholder"></div>
                    </td>
                    <td>
                      <div className="loading-placeholder"></div>
                    </td>
                    <td>
                      <div className="loading-placeholder"></div>
                    </td>
                  </tr>
                ))
              ) : balancesData.length === 0 ? (
                <tr>
                  <td colSpan={3} className="empty-table-message">
                    No active vesting contracts found
                  </td>
                </tr>
              ) : (
                balancesData
                  .map((balance) => {
                    try {
                      const claimEntry = claimsData.find(
                        (claim) =>
                          claim.vestingWallet.toLowerCase() ===
                          balance.vestingWallet.toLowerCase()
                      );

                      // Parse amount safely using parseTokenAmount
                      const amountBigInt = parseTokenAmount(balance.amount);

                      return (
                        <tr key={balance.vestingWallet}>
                          <td className="address-text">
                            {formatAddress(balance.vestingWallet)}
                          </td>
                          <td className="address-text">
                            {claimEntry
                              ? formatAddress(claimEntry.account)
                              : "Unknown"}
                          </td>
                          <td className="amount-text">
                            {formatTokenAmount(amountBigInt, 18, "ASTR")}
                          </td>
                        </tr>
                      );
                    } catch (err) {
                      console.error("Error rendering row:", err, balance);
                      return null;
                    }
                  })
                  .filter(Boolean)
              )}
            </tbody>
          </table>
        </div>

        <div className="contracts-table-footer">
          <div className="contracts-table-info">
            Showing {balancesData.length} active{" "}
            {balancesData.length === 1 ? "contract" : "contracts"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
