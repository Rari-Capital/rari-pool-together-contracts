pragma solidity 0.7.3;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IRariFundManager {
    function balanceOf(address) external returns (uint256);
    function getFundBalance() external returns (uint256);
    function rariFundToken() external view returns (IERC20);
    
    function deposit() payable external returns (bool);
    function withdraw(uint256) external returns (bool);

}