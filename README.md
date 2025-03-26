# Vesting Wallet Claim dApp

A decentralized application for claiming tokens from vesting wallets on the AstarzkEVM network.

## Features

- Connect wallet using RainbowKit (supports MetaMask, WalletConnect, and more)
- Check vesting wallet status
- Claim available tokens
- View dashboard with statistics
- Responsive design for mobile, tablet, and desktop

## Tech Stack

- Framework: Vite + React
- Language: TypeScript
- Styling: Standard CSS with custom variables
- Wallet Connection: RainbowKit + wagmi
- Blockchain Interaction: viem + ethers

## Prerequisites

- Node.js (v20.17.0+)
- npm or yarn
- A Web3 wallet (MetaMask, etc.)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/vesting-wallet-claim.git
cd vesting-wallet-claim
```

2. Install dependencies:
```bash
npm install
```

3. Create sample CSV files (if needed):
```bash
# Ensure the public directory exists
mkdir -p public

# Create sample CSV files
# claims.csv and non_zero_balances.csv should be placed in the public directory
```

## Development

Start the development server:
```bash
npm run dev
```

The application will be available at http://localhost:5173

## Building for Production

Build the application:
```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Smart Contract Integration

The application integrates with the following contracts on AstarzkEVM:

- YOKI_AIRDROP: `0xBD44bdC035c44E993Cab22D347059896812b4E88`
- ASTR Token: `0xdf41220C7e322bFEF933D85D01821ad277f90172`
- VestingWallet: Address is dynamically obtained from YOKI_AIRDROP contract

## Network Configuration

- Network: AstarzkEVM
- Chain ID: 3776
- RPC URL: https://rpc.zkatana.gelato.digital

## CSS Structure

This project uses standard CSS with CSS variables for theming. The main CSS files are:

- `src/index.css` - Global styles and CSS variables
- Component-specific CSS files located alongside their respective components

## CSV Data Format

The application expects two CSV files in the public directory:

1. `claims.csv`: Contains mapping of user addresses to vesting wallets and amounts
   ```
   account,vestingWallet,amount
   0x123...,0xabc...,1000000000000000000000
   ```

2. `non_zero_balances.csv`: Contains vesting wallets with non-zero balances
   ```
   vestingWallet,amount
   0xabc...,800000000000000000000
   ```

## Project Structure

```
vesting-wallet-claim/
├── public/
│   ├── claims.csv
│   ├── non_zero_balances.csv
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Layout.tsx
│   │   │   ├── Layout.css
│   │   │   ├── Navbar.tsx
│   │   │   └── Navbar.css
│   │   ├── ui/
│   │   │   ├── StatCard.tsx
│   │   │   ├── StatCard.css
│   │   │   ├── ClaimButton.tsx
│   │   │   └── ClaimButton.css
│   │   └── index.ts
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Home.css
│   │   ├── Dashboard.tsx
│   │   └── Dashboard.css
│   ├── hooks/
│   │   ├── useVestingWallet.ts
│   │   └── useCSVData.ts
│   ├── config/
│   │   ├── contracts.ts
│   │   └── networks.ts
│   ├── utils/
│   │   ├── formatters.ts
│   │   └── helpers.ts
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
└── tsconfig.json
```

## License

MIT
