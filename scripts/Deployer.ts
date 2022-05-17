import { IDeployConfig } from "./config/DeployConfig"
import { DeploymentHelper } from "./utils/DeploymentHelper"
import { ethers } from "hardhat"

export class Deployer {
	config: IDeployConfig
	helper: DeploymentHelper

	constructor(config: IDeployConfig) {
		this.config = config
		this.helper = new DeploymentHelper(config)
	}

	async run() {
		await this.helper.initHelper()

		const Contract = await ethers.getContractFactory("Contract")
		const contract = await this.helper.deployContract(
			Contract,
			"DefaultContract"
		)
	}
}
