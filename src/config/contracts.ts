import { ASTARZKEEVM_CHAIN_ID } from './networks';

// Contract addresses
export const YOKI_AIRDROP_ADDRESS = '0xBD44bdC035c44E993Cab22D347059896812b4E88';
export const ASTR_TOKEN_ADDRESS = '0xdf41220C7e322bFEF933D85D01821ad277f90172'; 

// RainbowKit project ID
export const WALLET_CONNECT_PROJECT_ID = 'a792cffa36af0b77bb534bd53107b117';

// ABI snippets
export const YOKI_AIRDROP_ABI = [
  {
    "inputs": [{ "internalType": "address", "name": "user", "type": "address" }],
    "name": "vestingWalletsMap",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  }
];

export const ERC20_ABI = [
  {
    "inputs": [{ "internalType": "address", "name": "account", "type": "address" }],
    "name": "balanceOf",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  }
];

export const VESTING_WALLET_ABI = [
  {
    "inputs": [{ "internalType": "address", "name": "token", "type": "address" }],
    "name": "release",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

// Contract config by chain ID
export const CONTRACTS = {
  [ASTARZKEEVM_CHAIN_ID]: {
    yokiAirdrop: YOKI_AIRDROP_ADDRESS,
    astrToken: ASTR_TOKEN_ADDRESS,
  }
};
