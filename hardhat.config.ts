import { secrets } from "./.secrets"

import { HardhatUserConfig, subtask } from "hardhat/config"
import { TASK_COMPILE_SOLIDITY_GET_SOURCE_PATHS } from "hardhat/builtin-tasks/task-names"

import "@nomiclabs/hardhat-etherscan"
import "@nomiclabs/hardhat-waffle"
import "@typechain/hardhat"
import "@openzeppelin/hardhat-upgrades"

subtask(TASK_COMPILE_SOLIDITY_GET_SOURCE_PATHS).setAction(
	async (_, __, runSuper) => {
		const paths = await runSuper()
		return paths.filter(
			(p: string) => !p.endsWith(".t.sol") || p.includes("/mock/")
		)
	}
)

const config: HardhatUserConfig = {
	defaultNetwork: "localhost",
	networks: {
		localhost: {
			url: "http://localhost:8545",
		},
		rinkeby: {
			url: secrets.networks.rinkeby!.RPC_URL || "",
			accounts: [secrets.networks.rinkeby!.PRIVATE_KEY],
		},
		mainnet: {
			url: secrets.networks.mainnet!.RPC_URL,
			accounts: [secrets.networks.mainnet!.PRIVATE_KEY],
		},
	},
	etherscan: {
		apiKey: {
			mainnet: secrets.networks.mainnet!.ETHERSCAN_API_KEY,
			rinkeby: secrets.networks.rinkeby!.ETHERSCAN_API_KEY,
		},
	},
	solidity: {
		version: "0.8.13",
		settings: {
			optimizer: {
				enabled: true,
				runs: 200,
			},
		},
	},
	paths: {
		sources: "./src",
		tests: "./test",
		cache: "./hardhat/cache",
		artifacts: "./hardhat/artifacts",
	},
}

export default config
