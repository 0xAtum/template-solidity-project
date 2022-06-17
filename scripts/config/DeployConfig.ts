import { SupportedChain } from "./NetworkConfig"

export interface IDeployConfig {
	TX_CONFIRMATIONS: number
	ContractConfigExample?: CrossChainConfigExample
}

export type CrossChainConfigExample = {
	[key in SupportedChain | string]?: ContractConfig
}

export interface ContractConfig {
	fakeConfig: string
	fakeConfig1: number
}
