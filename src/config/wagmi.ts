import { createConfig, http } from "wagmi";
import { astarZkEVM } from "wagmi/chains";
import { createClient } from "viem";
import {
  metaMaskWallet,
  rainbowWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import {
  connectorsForWallets,
} from "@rainbow-me/rainbowkit";
import { WALLET_CONNECT_PROJECT_ID } from "./contracts";

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

export const wagmiConfig = createConfig({
  connectors,
  chains: [astarZkEVM],
  client({ chain }) {
    return createClient({ chain, transport: http() });
  },
});