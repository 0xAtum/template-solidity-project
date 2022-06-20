# include .env file and export its env vars
# (-include to ignore error if it does not exist)
-include .env

# deps
update:; forge update
remappings:; forge remappings > remappings.txt

# Build & test
build  :; forge clean && forge build --optimize --optimizer-runs 1000000
test   :; forge clean && forge test --optimize --optimizer-runs 1000000 -v
test-debug   :; forge clean && forge test --optimize --optimizer-runs 1000000 -vv
test-trace   :; forge clean && forge test --optimize --optimizer-runs 1000000 -vvv
gas-report :; forge clean && forge test --optimize --optimizer-runs 1000000 --gas-report
clean  :; forge clean
snapshot :; forge clean && forge snapshot --optimize --optimizer-runs 1000000

# Hardhat
deploy-local :; npx hardhat compile && npx hardhat deploy --network localhost --env localhost
deploy-testnet :; npx hardhat compile && npx hardhat deploy --network rinkeby --env testnet
deploy-mainnet :; npx hardhat compile && npx hardhat deploy --network mainnet --env mainnet
