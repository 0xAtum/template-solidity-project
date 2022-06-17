import { IDeployConfig } from "../../config/DeployConfig"
import { Deployer } from "./Deployer"
import { colorLog, Colors, addColor } from "../../utils/ColorConsole"
import { HardhatRuntimeEnvironment } from "hardhat/types/runtime"
import readline from "readline-sync"

const config: IDeployConfig = {
	TX_CONFIRMATIONS: 3,
}

export async function execute(hre: HardhatRuntimeEnvironment) {
	var userinput: string = "0"

	userinput = readline.question(
		addColor(
			Colors.yellow,
			`\nYou are about to deploy on the mainnet, is it fine? [y/N]\n`
		)
	)

	if (userinput.toLowerCase() !== "y") {
		colorLog(Colors.blue, `User cancelled the deployment!\n`)
		return
	}

	colorLog(Colors.green, `User approved the deployment\n`)

	await new Deployer(config, hre).run()
}
