import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";

import "@rainbow-me/rainbowkit/styles.css";
import {
  RainbowKitProvider,
  connectorsForWallets,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import {
  metaMaskWallet,
  rainbowWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { createConfig, http, WagmiProvider } from "wagmi";
import { astarZkEVM } from "wagmi/chains";
import { createClient } from "viem";
import { WALLET_CONNECT_PROJECT_ID } from "./config/contracts";

// Import Inter font
import "@fontsource/inter/300.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";

const connectors = connectorsForWallets(
  [
    {
      groupName: "Recommended",
      wallets: [metaMaskWallet, rainbowWallet, walletConnectWallet],
    },
  ],
  {
    appName: "Vesting Wallet Claim",
    projectId: WALLET_CONNECT_PROJECT_ID,
  }
);

// Configure chains and providers
const wagmiConfig = createConfig({
  connectors,
  chains: [astarZkEVM],
  client({ chain }) {
    return createClient({ chain, transport: http() });
  },
});

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme()}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="dashboard" element={<Dashboard />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default App;
