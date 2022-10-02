// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import { BaseTest, console } from "./base/BaseTest.t.sol";

contract ContractTest is BaseTest {
	address private owner = generateAddress("Owner", false, 10 ether);
	address private mockContract = generateAddress("ContractA", true);

	function setUp() public {}

	function testExample() public {
		console.log("Hello world!", owner);
		assertEq(owner.balance, 10 ether);
	}

	function testExample2() public {
		assertTrue(mockContract.code.length > 0);
	}
}
