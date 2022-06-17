# Template Solidity Project with Foundry & Hardhat

This is my go to template when I start a new project.

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
3. Modify `./scripts/config/DeployConfig.ts` to match what you need during
   your deployments.

## Strucutre

I use the most common structure of an Engineering project. (./src/main/...
and ./src/test/...). I've put all hardhat folders in ./hardhat/ to reduce
the noise on the root.

./scripts/ contains my deployment logic based on network with their
configs.

## Commands script

I'm using
[MakeFile](https://github.com/0xAtum/template-solidity-project/blob/main/Makefile)
for the commands.

e.g: `make test`

To deploy, either use `make deploy-<localhost|testnet|mainnet>` or
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
