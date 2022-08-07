# include .env file and export its env vars
# (-include to ignore error if it does not exist)
-include .env

FORK_MAINNET_RPC =  --fork-url https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161
HARDHAT_COMPILE = npx hardhat compile
FORGE_CLEAN = forge clean

# How to use $(EXTRA) or $(NETWORK)
# define it with your command. 
# e.g: make test EXTRA='-vvv --match-contract MyContractTest'
# e.g: make deploy-testnet NETWORK='arbitrumTestnet'

# deps
update:; forge update
remappings:; forge remappings > remappings.txt

# commands
coverage :; forge coverage 
coverage-output :; forge coverage --report lcov
build  :; $(FORGE_CLEAN) && forge build 
clean  :; $(FORGE_CLEAN)

# test
test   :; $(FORGE_CLEAN) && forge test $(EXTRA)

# Gas Snapshots
snapshot :; $(FORGE_CLEAN) && forge snapshot $(EXTRA)
snapshot-fork :; $(FORGE_CLEAN) && forge snapshot --snap .gas-snapshot-fork $(FORK_MAINNET_RPC) $(EXTRA)

# Hardhat Deployments
deploy-local :; $(HARDHAT_COMPILE) && npx hardhat deploy --network local --env localhost
deploy-testnet :; $(HARDHAT_COMPILE) && npx hardhat deploy --network $(NETWORK) --env testnet
deploy-mainnet :; $(HARDHAT_COMPILE) && npx hardhat deploy --network $(NETWORK) --env mainnet
