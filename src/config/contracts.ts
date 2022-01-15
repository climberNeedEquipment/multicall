import { ChainId } from "./networks"

export const multicallContracts: Partial<Record<ChainId, string>> = {
  [ChainId.BSC_MAINNET]: '0x7D82217018FAAcf81d4726134939C12300fF6B9E',
  [ChainId.BSC_TESTNET]: '0x7b6838b362f05bA2a0CAA8F9c1B34F3D619e7413',
  // TODO: Deploy and update config
  // [ChainId.POLYGON_MAINNET]: '0x',
  // [ChainId.POLYGON_MUMBAI_TESTNET]: '0x',
}