// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.0;

import "../utils/Accounts.sol";

import "forge-std/Test.sol";
import "forge-std/Vm.sol";
import "forge-std/console.sol";

contract BaseTest is Test {
	Accounts internal accounts = new Accounts(vm);

	bytes internal constant NOT_OWNER = "Ownable: caller is not the owner";
	bytes internal constant ERC20_INVALID_BALANCE =
		"ERC20: transfer amount exceeds balance";

	modifier prankAs(address caller) {
		vm.startPrank(caller);
		_;
		vm.stopPrank();
	}
}
