export const ASTARZKEEVM_CHAIN_ID = 3776;

export const astarzkEVM = {
  id: ASTARZKEEVM_CHAIN_ID,
  name: 'AstarzkEVM',
  network: 'astarzkEVM',
  nativeCurrency: {
    decimals: 18,
    name: 'ASTR',
    symbol: 'ASTR',
  },
  rpcUrls: {
    public: { http: ['https://rpc.zkatana.gelato.digital'] },
    default: { http: ['https://rpc.zkatana.gelato.digital'] },
  },
  blockExplorers: {
    default: { name: 'Explorer', url: 'https://zkatana.explorer.startale.com' },
  },
  testnet: true,
};

export const REQUIRED_CHAIN_ID = ASTARZKEEVM_CHAIN_ID;
export const REQUIRED_NETWORK = astarzkEVM;
