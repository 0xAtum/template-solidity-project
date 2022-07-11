pragma solidity >=0.8.0;

import "forge-std/Vm.sol";

contract Accounts {
	uint256 public constant TOTAL_ACCOUNTS = 100;
	uint256 public constant TOTAL_ETH = 100 ether;

	constructor(Vm vm) {
		for (uint256 i = 1; i <= TOTAL_ACCOUNTS; i++) {
			address wallet = vm.addr(i);
			PUBLIC_KEYS.push(wallet);
			vm.deal(wallet, TOTAL_ETH);
		}
	}

	address[] public PUBLIC_KEYS;
}
