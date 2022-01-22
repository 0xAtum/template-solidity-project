# Template Solidity Project
I normally use this template when I want to create a new project or do some local testing withing a working environment.
It is nice to take know, this is my personal preference and not the “Ultimate way to go”.

### Dependencies
- [Foundry/Forge](https://github.com/gakonst/foundry) : Allows you to do native unit tests (in solidity).
- [Hardhat](https://hardhat.org/getting-started/) Typescript (Cause fuck pure JS, don't know why people still doing this).
- [Prettier for Solidity](https://github.com/prettier-solidity/prettier-plugin-solidity)

### Strucutre
I use the most common structure of a Engineering project. (./src/main/... and ./src/test/...).
I've put all hardhat folders in ./hardhat/ to reduce the noise on the root.

./scripts/ contains my deployment logic based on network with their configs.

### Commands script
- test: Run forge tests
- deploy-testnet: use hardhat rinkeby-testnet configs and execute the script.
- deploy-local: use hardhat localhost configs and execute the scripts.
- deploy-mainnet: use hardhat mainnet configs and execute the scripts.


### Technical Questions:

- Why Forge for unit tests and not hardhat?
    - Faster, stronger and easier. Web2 or Web3, whatever language, you should always do your tests natively. So if you use Java. your tests should be in Java. So please, stop doing your tests via web3/ethers in JS/TS. Doing unit test is already painful, why do you make it worst.

- Why hardhat and not truffle?
    - Back in the days, I tested both and found that Hardhat was stronger and more flexible than truffle. So, I swiched to it. Since then, I didn't follow any update on truffle side, so maybe there's no much of a difference. Anyway we still love Truffle because... you know, ganache-cli. <3
