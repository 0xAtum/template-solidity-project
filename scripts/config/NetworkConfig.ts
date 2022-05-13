type SupportedChain =
	| "mainnet"
	| "ropsten"
	| "rinkeby"
	| "goerli"
	| "kovan"
	// binance smart chain
	| "bsc"
	| "bscTestnet"
	// huobi eco chain
	| "heco"
	| "hecoTestnet"
	// fantom mainnet
	| "opera"
	| "ftmTestnet"
	// optimistim
	| "optimisticEthereum"
	| "optimisticKovan"
	// polygon
	| "polygon"
	| "polygonMumbai"
	// arbitrum
	| "arbitrumOne"
	| "arbitrumTestnet"
	// avalanche
	| "avalanche"
	| "avalancheFujiTestnet"
	// moonriver
	| "moonriver"
	| "moonbaseAlpha"
	// xdai
	| "xdai"
	| "sokol"

export type ChainConfig = {
	[key in SupportedChain]?: Network
}

export interface Network {
	RPC_URL: string
	PRIVATE_KEY: string
	ETHERSCAN_API_KEY?: string
}

export interface NetworkConfig {
	networks: ChainConfig
}
