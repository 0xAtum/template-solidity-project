import { IDeployConfig } from "../../config/DeployConfig"
import { DeploymentHelper } from "../../utils/DeploymentHelper"
import { HardhatRuntimeEnvironment } from "hardhat/types/runtime"
import { HardhatEthersHelpers } from "@nomiclabs/hardhat-ethers/types"
import { colorLog, Colors } from "../../utils/ColorConsole"

export class Deployer {
	config: IDeployConfig
	helper: DeploymentHelper
	ethers: HardhatEthersHelpers
	hre: HardhatRuntimeEnvironment

	constructor(config: IDeployConfig, hre: HardhatRuntimeEnvironment) {
		this.hre = hre
		this.ethers = hre.ethers
		this.config = config
		this.helper = new DeploymentHelper(config, hre)
	}

	async run() {
		const [signer] = await this.ethers.getSigners()
		const networkName: string = this.hre.network.name

		/* 
		Lazy example of how I would use the cross-chain config
		You can find the type config inside ./scripts/config/DeployConfig.ts
		You can find the configuration inside ./scripts/tasks/deploy/deploy.testnet.ts

		In a real envrionment, CoontractConfigExample wouldn't be nullable.
		*/
		if (this.config.ContractConfigExample !== undefined) {
			if (this.config.ContractConfigExample[networkName] === undefined) {
				colorLog(
					Colors.red,
					`ContractConfigExample isn't configured for ${networkName}`
				)

				//Normally you should call a throw();
			} else {
				colorLog(
					Colors.green,
					`Loaded ContractConfigExample of ${networkName}`
				)
			}
		}

		const contract = await this.helper.deployContractByName(
			"Contract",
			"DefaultContract"
		)

		console.log(
			`\n\nSigner: ${signer.address} deployed a contract at ${contract.address}`
		)
	}
}
