import { IDeployConfig } from "../../config/DeployConfig"
import { Deployer } from "./Deployer"
import { HardhatRuntimeEnvironment } from "hardhat/types/runtime"

const config: IDeployConfig = {
	TX_CONFIRMATIONS: 1,
	ContractConfigExample: {
		mainnet: {
			fakeConfig: "Hello World",
			fakeConfig1: 101,
		},
		rinkeby: {
			fakeConfig: "Goodbye World",
			fakeConfig1: 1,
		},
	},
}

export async function execute(hre: HardhatRuntimeEnvironment) {
	await new Deployer(config, hre).run()
}
