

# Template Solidity Project with Foundry & Hardhat

## Important

This template is deprecated, but in a good condition for production as it was the main template for Vesta's projects.

The main reason I was still using Hardhat is for the OZ-Upgradeable plugin to avoid any issues.

Since then, foundry did a lot of progress and is in a mature state that I can create the OZ-Upgradeable plugin inside Forge if I want to. I don't see the point of keeping Hardhat.

[New template - template-foundry-project](https://github.com/0xAtum/template-foundry-project)
#


This was my go to template when I was starting a new project.

## Dependencies

- [Foundry/Forge](https://github.com/gakonst/foundry) : Allows you to do
  native unit tests (in solidity).
- [Hardhat](https://hardhat.org/getting-started/) Typescript (Cause fuck
  pure JS, don't know why people still doing this).
- [Prettier for Solidity](https://github.com/prettier-solidity/prettier-plugin-solidity)

## Installation

1. [Follow the Foundry's installation guide](https://book.getfoundry.sh/getting-started/installation.html)
2. `forge install`
3. `npm install` or `yarn install`

Then use the command `make test` to be sure everything is good to go

## Short Forge Tutorial

[Foundry Book](https://book.getfoundry.sh/index.html)

You want to install a library?

1. `forge install openZeppelin/openzeppelin-contracts`
2. `make remappings` or `forge remappings > remappings.txt`

You want to run some tests?

- `forge test` // normal
- `forge test -vv` // debug
- `forge test -vvv` //tracing

## Setup / Configuration

The only setup you need to do is:

1. Clone `.secrets.ts.template` and rename it to `.secrets.ts`. Of course,
   by default, `.secrets.ts` is ignored by github. It's recommended leaving
   the template in your repo so if someone works with you or clone your
   project, s/he knows what to do.
2. Configure [hardhat.config.ts](https://hardhat.org/config)
3. Modify `./scripts/config/DeployConfig.ts` to match what you need during your deployments.

## Strucutre

I use the most common structure of an Engineering project. (./src/main/...
and ./src/test/...). I've put all hardhat folders in ./hardhat/ to reduce
the noise on the root.

./scripts/ contains my deployment logic based on network with their
configs.

## Coverage

Coverage isn't production ready, but still quite a nice tool to use.
If you want to use it correctly, install

- Coverage Gutter Extension (vscode)

Then when you run `make coverage`, it will generate a file that Coverage Gutter will read. Go to your contract's code and use the vscode command `>Coverage Gutters: Display Coverage`

You will see in red the code that isn't being tested by your tests.

## How to deploy
The deployment logic is inside of scripts/tasks/deploy/ where:
- `Deploy.ts` is the core deployment logic
- `deploy.xxx.ts` is the pre-configuraiton before the deployment  

Then we use 
- `make deploy-<localhost|testnet|mainnet> NETWORK='networkname'`
or
- `npx hardhat deploy --network <NETWORK_NAME> --env <mainnet | testnet | localhost>`

You are welcome to change your deployment task as you like. To register a new Task logic, you have to include it into `hardhat.config.ts`

## Commands script

I'm using
[MakeFile](https://github.com/0xAtum/template-solidity-project/blob/main/Makefile)
for the commands.

e.g: `make test`
e.g (with args): `make test EXTRA='-vvv --match-contract MyContractTest'`

To deploy, either use `make deploy-<localhost|testnet|mainnet> NETWORK='networkname'` or
`npx hardhat deploy --network <NETWORK_NAME> --env <mainnet | testnet | localhost>`

## Recommendations

- Using VSCode. (Sadly, there's no real support on intellij)
- Use Hardhat + Solidity Extension. (That means you can uninstall solidity
  extention by Juan Blanco)

## Technical Questions:

- Why not using Forge to deploy?

  - This is a personal preference. I wanted to create a full framework
    logic to deploy & verify using forge's bash command and keep the same
    flow. But, at the end, Hardhat is a strong framework for deployment
    with many plugins to enchant it.

- Why Forge for unit tests and not hardhat?
  - Faster, stronger and easier. Web2 or Web3, whatever language, you
    should always do your tests natively. So if you use Java. your tests
    should be in Java. So please, stop doing your tests via web3/ethers in
    JS/TS. Doing unit test is already painful, why do you make it worst.

## Sharing is Caring

If you use this template, please do a small shout-out in your README.md so
this template can help other developers.

i.e: This project uses
[0xAtum's Template](https://github.com/0xAtum/template-solidity-project)

## License

[AGPL-3.0-only](https://github.com/0xAtum/template-solidity-project/blob/main/LICENSE)
