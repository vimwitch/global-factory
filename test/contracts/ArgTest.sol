/// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0;

contract ArgTest {
  uint b;
  constructor(uint a) {
    b = a;
  }
  function test() public pure returns (uint) {
    return 1;
  }
}
