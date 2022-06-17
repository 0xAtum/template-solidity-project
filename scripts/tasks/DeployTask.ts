import { HardhatRuntimeEnvironment } from "hardhat/types/runtime"

import { execute as mainnetExec } from "./deploy/deploy.mainnet"
import { execute as testnetExec } from "./deploy/deploy.testnet"
import { execute as localhostExec } from "./deploy/deploy.local"
import { colorLog, Colors } from "../utils/ColorConsole"

export default async function deploy(
	params: any,
	hre: HardhatRuntimeEnvironment
): Promise<void> {
	colorLog(
		Colors.yellow,
		`\nExecuting Deploy | Network: ${hre.network.name} | --env: ${params.env}\n`
	)
	switch (params.env.toLowerCase()) {
		case "mainnet":
			await mainnetExec(hre)
			break
		case "testnet":
			await testnetExec(hre)
			break
		default:
			await localhostExec(hre)
			break
	}
}
