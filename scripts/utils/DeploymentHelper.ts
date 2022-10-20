import { Contract, ContractFactory, ethers } from "ethers"
import { writeFileSync, existsSync } from "fs"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import { IDeployConfig } from "../config/DeployConfig"
import { SupportedChain } from "../config/NetworkConfig"
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

	/**
	 *
	 * @param contractName The ethers.getContractFactory's factory
	 * @param identityName The name of the contract inside <chain>_deployment.json
	 * 					   if undefined, it uses the contractName's value.
	 * @param initializerFunctionName The function you want to call right after the deployment of the contract.
	 * @param args The arguments for the initializer function of your contract
	 * @returns the contract object
	 */
	async deployUpgradeableContractWithName(
		contractName: string,
		identityName: string,
		initializerFunctionName?: string,
		...args: Array<any>
	): Promise<Contract> {
		return this.deployUpgradeableContract(
			await this.hre.ethers.getContractFactory(contractName),
			identityName,
			initializerFunctionName,
			...args
		)
	}

	/**
	 *
	 * @param contractFactory The name of the contract inside the .sol file
	 * @param identityName The name of the contract inside <chain>_deployment.json
	 * 					   if undefined, it uses the contractName's value.
	 * @param initializerFunctionName The function you want to call right after the deployment of the contract.
	 * @param args The arguments for the initializer function of your contract
	 * @returns the contract object
	 */
	private async deployUpgradeableContract(
		contractFactory: ContractFactory,
		identityName: string,
		initializerFunctionName?: string,
		...args: Array<any>
	): Promise<Contract> {
		const [findOld, address] = await this.tryToGetCachedContractAddress(
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
		await this.verifyContract(await this.hre.upgrades.erc1967.getImplementationAddress(contract.address));
		return contract
	}

	/**
	 *
	 * @dev If the contract is already deployed, it'll not deploy it and instead only load it.
	 * @param contractName The name of the contract inside the .sol file
	 * @param identityName The name of the contract inside <chain>_deployment.json
	 * 					   if undefined, it uses the contractName's value.
	 * @param args The constructor's arguments
	 * @returns the contract object
	 */
	async deployContractByName(
		contractName: string,
		identityName?: string,
		...args: Array<any>
	): Promise<Contract> {
		return await this.deployContract(
			await this.hre.ethers.getContractFactory(contractName),
			identityName !== undefined ? identityName : contractName,
			...args
		)
	}

	/**
	 *
	 * @param contractFactory The ethers.getContractFactory's factory
	 * @param contractName The name of the contract inside the .sol file
	 * @param args Constructor's parameters if any
	 * @returns The contract object
	 */
	private async deployContract(
		contractFactory: ContractFactory,
		contractName: string,
		...args: Array<any>
	): Promise<Contract> {
		const [findOld, address] = await this.tryToGetCachedContractAddress(
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

	private saveDeployment() {
		const deploymentStateJson = JSON.stringify(
			this.deploymentState,
			null,
			2
		)
		writeFileSync(this.path + this.fileName, deploymentStateJson)
	}

	/**
	 *
	 * @dev If your contract has a constructor, for some reason this function might fails.
	 * 		You can manually do it via `npx hardhat verify --network <NETWORK> <CONTRACT_ADDRESS> <PARAMETER_A> <PARAMETER_B> <ETC>`
	 * @param contractAddress Deployed contract address
	 * @param args The constructor arguments if any.
	 */
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

	/**
	 *
	 * @param chainName The chain name you want to get the contract from
	 * @param cachedContractName The saved name of the deployed contract inside the <chain>_deployment.json
	 * @returns tuple(bool success, string address). If it fails, the address will be empty
	 */
	getOtherChainContractAddress(
		chainName: SupportedChain,
		cachedContractName: string
	): [boolean, string] {
		const chainContracts = require(`../deployments/${chainName}_deployment.json`)
		const history: IDeploymentHistory = chainContracts[cachedContractName]

		const isFound: boolean = history !== undefined
		return [isFound, isFound ? history.address : ""]
	}

	/**
	 *
	 * @param contractName The name of the contract inside the .sol file.
	 * @param cachedContractName The saved name of the deployed contract inside the <chain>_deployment.json
	 * @returns The contract object or undefined if not found
	 */
	async tryToLoadCachedContract(
		contractName: string,
		cachedContractName: string
	): Promise<Contract | undefined> {
		const contractHistory: IDeploymentHistory =
			this.deploymentState[cachedContractName]

		if (contractHistory === undefined) return undefined

		const contractFactory = await this.hre.ethers.getContractFactory(
			contractName
		)

		colorLog(
			Colors.green,
			`Loaded Cached contract ${cachedContractName} at ${contractHistory.address}`
		)
		return contractFactory.attach(contractHistory.address)
	}

	/**
	 *
	 * @param cachedContractName The saved name of the deployed contract inside the <chain>_deployment.json
	 * @returns tuple(bool success, string address)
	 */
	async tryToGetCachedContractAddress(
		cachedContractName: string
	): Promise<[boolean, string]> {
		if (this.deploymentState[cachedContractName] !== undefined) {
			const address = this.deploymentState[cachedContractName].address
			colorLog(
				Colors.green,
				`${cachedContractName} already exists. Loading ${address}`
			)

			return [true, address]
		}

		return [false, ""]
	}

	/**
	 * @error throws an error if the mint isn't successful.
	 * @param txPromise The transaction promise you want to execute
	 * @returns TranscationReceipt of the minedTx
	 */
	async sendAndWaitForTransaction(
		txPromise: Promise<any>
	): Promise<ethers.providers.TransactionReceipt> {
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
