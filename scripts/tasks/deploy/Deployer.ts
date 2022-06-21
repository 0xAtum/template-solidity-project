import { IDeployConfig } from "../../config/DeployConfig"
import { DeploymentHelper } from "../../utils/DeploymentHelper"
import { HardhatRuntimeEnvironment } from "hardhat/types/runtime"
import { HardhatEthersHelpers } from "@nomiclabs/hardhat-ethers/types"
import { colorLog, Colors } from "../../utils/ColorConsole"
import { Contract } from "ethers"

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
		console.log(`\nActive Deployer: ${signer.address}`)

		//Example deploying
		const defaultContract: Contract = await this.deployContractExample()

		console.log(
			`\nDefault Contract deployed at ${defaultContract.address} on ${this.hre.network.name}`
		)

		//Example fetching contract deployed contract on different chain
		console.log(
			`\nKovan's Default Contract address is: ${
				this.getDefaultContractFromKovanExample()[1]
			}`
		)

		//Example loading an already deployed contract.
		const testLoadingContract: Contract | undefined =
			await this.loadSavedContractExample()

		const loadingMessage: String =
			testLoadingContract !== undefined
				? `Successfully loaded defaultContract-${testLoadingContract.address} with history`
				: "Failed to load defaultContract with history"

		console.log(loadingMessage)
	}

	private async deployContractExample(): Promise<Contract> {
		const networkName: string = this.hre.network.name

		/* 
		Lazy example of how I would use the cross-chain config
		You can find the type config inside ./scripts/config/DeployConfig.ts
		You can find the configuration inside ./scripts/tasks/deploy/deploy.testnet.ts

		In a real envrionment, CoontractConfigExample should not be nullable.

		To make things easier for you, the name you use in your hardhat config should be the same of SupportedChain 
		in ./scripts/config/NetworkConfig.ts
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

		return await this.helper.deployContractByName(
			"Contract",
			"DefaultContract"
		)
	}

	private getDefaultContractFromKovanExample(): [boolean, string] {
		return this.helper.getOtherChainContractAddress(
			"kovan",
			"DefaultContract"
		)
	}

	private async loadSavedContractExample(): Promise<Contract | undefined> {
		return await this.helper.tryToLoadCachedContract(
			"Contract",
			"DefaultContract"
		)
	}
}
