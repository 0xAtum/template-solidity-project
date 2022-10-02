// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.0;

import "forge-std/Test.sol";
import "forge-std/Vm.sol";
import "forge-std/console.sol";

contract BaseTest is Test {
	bytes internal constant NOT_OWNER = "Ownable: caller is not the owner";
	bytes internal constant ERC20_INVALID_BALANCE =
		"ERC20: transfer amount exceeds balance";

	uint256 private seed;

	modifier prankAs(address caller) {
		vm.startPrank(caller);
		_;
		vm.stopPrank();
	}

	function generateAddress(string memory _name, bool _isContract)
		internal
		returns (address)
	{
		return generateAddress(_name, _isContract, 0);
	}

	function generateAddress(
		string memory _name,
		bool _isContract,
		uint256 _eth
	) internal returns (address newAddress_) {
		seed++;
		newAddress_ = vm.addr(seed);

		vm.label(newAddress_, _name);

		if (_isContract) {
			vm.etch(newAddress_, "Generated Contract Address");
		}

		vm.deal(newAddress_, _eth);

		return newAddress_;
	}
}
