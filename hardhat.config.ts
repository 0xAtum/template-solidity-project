import fs from "fs"
import * as dotenv from 'dotenv';

import { HardhatUserConfig, subtask, task } from "hardhat/config"
import { TASK_COMPILE_SOLIDITY_GET_SOURCE_PATHS } from "hardhat/builtin-tasks/task-names"
import "hardhat-preprocessor"
import "@typechain/hardhat"

import "@nomiclabs/hardhat-etherscan"
import "@nomiclabs/hardhat-waffle"
import "@openzeppelin/hardhat-upgrades"

import deploy from "./scripts/tasks/DeployTask"

const FAKE_PRIVATE_KEY = "0xBeBeF90A7E9A8e018F0F0baBb868Bc432C5e7F1EfaAe7e5B465d74afDD87c7cf";

dotenv.config();

task("deploy", "Deploy task")
	.addParam("env", "localhost | testnet | mainnet", "testnet")
	.setAction(deploy)

subtask(TASK_COMPILE_SOLIDITY_GET_SOURCE_PATHS).setAction(
	async (_, __, runSuper) => {
		const paths = await runSuper()
		return paths.filter(
			(p: string) => !p.includes("src/test") && !p.includes("src\\test")
		)
	}
)

function getRemappings() {
	return fs
		.readFileSync("remappings.txt", "utf8")
		.split("\n")
		.filter(Boolean)
		.map(line => line.trim().split("="))
}

const config: HardhatUserConfig = {
	defaultNetwork: "localhost",
	networks: {
		localhost: {
			url: "http://localhost:8545",
		},
		goerli: {
			url: process.env.ETH_GOERLI_RPC || "",
			accounts: [process.env.DEPLOYER_PRIVATE_KEY ?? FAKE_PRIVATE_KEY],
		},
		mainnet: {
			url: process.env.ETH_MAINNET_RPC || "",
			accounts: [process.env.DEPLOYER_PRIVATE_KEY ?? FAKE_PRIVATE_KEY],
		},
	},
	etherscan: {
		apiKey: {
			mainnet: process.env.ETHERSCAN_API_KEY!,
			goerli: process.env.GOERLI_API_KEY!
		},
	},
	solidity: {
		version: "0.8.16",
		settings: {
			optimizer: {
				enabled: true,
				runs: 200,
			},
			viaIR: true,
		},
	},
	paths: {
		sources: "./src",
		cache: "./hardhat/cache",
		artifacts: "./hardhat/artifacts",
	},
	preprocess: {
		eachLine: hre => ({
			transform: (line: string) => {
				if (line.match(/^\s*import /i)) {
					getRemappings().forEach(([find, replace]) => {
						if (line.match(find)) {
							line = line.replace(find, replace)
						}
					})
				}
				return line
			},
		}),
	},
}

export default config