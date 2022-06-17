import { ContractFactory } from "ethers"
import { writeFileSync, existsSync } from "fs"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import { IDeployConfig } from "../config/DeployConfig"
import { colorLog, Colors } from "./ColorConsole"

export class DeploymentHelper {
	private path: string = "./scripts/deployments/"
	private fileName: string = "NOT_INIT.json"
	private hre: HardhatRuntimeEnvironment
	config: IDeployConfig
	deploymentState: { [id: string]: IDeploymentHistory } = {}

	constructor(config: IDeployConfig, hre: HardhatRuntimeEnvironment) {
		this.config = config
		this.hre = hre

		this.fileName = `${hre.network.name}_deployment.json`

		if (!existsSync(this.path + this.fileName)) return

		this.deploymentState = require("../deployments/" + this.fileName)
	}

	async deployUpgradeableContractWithName(
		contractName: string,
		identityName: string,
		initializerFunctionName?: string,
		...args: Array<any>
	) {
		return this.deployUpgradeableContract(
			await this.hre.ethers.getContractFactory(contractName),
			identityName,
			initializerFunctionName,
			...args
		)
	}

	async deployUpgradeableContract(
		contractFactory: ContractFactory,
		identityName: string,
		initializerFunctionName?: string,
		...args: Array<any>
	) {
		const [findOld, address] = await this.tryToGetSaveContractAddress(
			identityName
		)

		if (findOld) {
			return contractFactory.attach(address)
		}

		const contract =
			initializerFunctionName !== undefined
				? await this.hre.upgrades.deployProxy(contractFactory, args, {
						initializer: initializerFunctionName,
				  })
				: await this.hre.upgrades.deployProxy(contractFactory)

		this.deploymentState[identityName] = {
			address: contract.address,
			proxyAdmin: (await this.hre.upgrades.admin.getInstance()).address,
		}

		colorLog(
			Colors.green,
			`Deployed ${identityName} at ${contract.address}`
		)

		this.saveDeployment()
		return contract
	}

	async deployContractByName(
		contractFileName: string,
		name?: string,
		...args: Array<any>
	) {
		return await this.deployContract(
			await this.hre.ethers.getContractFactory(contractFileName),
			name !== undefined ? name : contractFileName,
			...args
		)
	}

	async deployContract(
		contractFactory: ContractFactory,
		contractName: string,
		...args: Array<any>
	) {
		const [findOld, address] = await this.tryToGetSaveContractAddress(
			contractName
		)

		if (findOld) {
			return contractFactory.attach(address)
		}

		const contractDeployer = await contractFactory.deploy(...args)
		const contract = await contractDeployer.deployed()

		this.deploymentState[contractName] = {
			address: contract.address,
		}

		this.saveDeployment()
		await this.verifyContract(contract.address, ...args)

		colorLog(
			Colors.green,
			`Deployed ${contractName} at ${contract.address}`
		)
		return contract
	}

	saveDeployment() {
		const deploymentStateJson = JSON.stringify(
			this.deploymentState,
			null,
			2
		)
		writeFileSync(this.path + this.fileName, deploymentStateJson)
	}

	async verifyContract(contractAddress: string, ...args: Array<any>) {
		try {
			await this.hre.run("verify:verify", {
				address: contractAddress,
				constructorArguments: args,
			})
		} catch (e) {
			colorLog(Colors.red, `Failed to verify ${contractAddress}. ${e}`)
		}
	}

	async tryToGetSaveContractAddress(
		contractName: string
	): Promise<[boolean, string]> {
		if (this.deploymentState[contractName] !== undefined) {
			const address = this.deploymentState[contractName].address
			colorLog(
				Colors.green,
				`${contractName} already exists. Loading ${address}`
			)

			return [true, address]
		}

		return [false, ""]
	}

	async sendAndWaitForTransaction(txPromise: Promise<any>) {
		const tx = await txPromise
		const minedTx = await this.hre.ethers.provider.waitForTransaction(
			tx.hash,
			this.config.TX_CONFIRMATIONS
		)

		if (!minedTx.status) {
			throw `Transaction failed ${txPromise}`
		} else {
			colorLog(
				Colors.blue,
				`${minedTx.transactionHash} minted successfully`
			)
		}
		return minedTx
	}
}
