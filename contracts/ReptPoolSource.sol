pragma solidity 0.7.3;

/* Interfaces */
import {IRariFundManager} from "./interfaces/rari/IRariFundManager.sol";
import {YieldSourceInterface} from "./interfaces/pooltogether/YieldSourceInterface.sol";

import {IWETH} from "./interfaces/external/IWETH.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";

/* Libraries */
import {SafeMath} from "@openzeppelin/contracts/math/SafeMath.sol";

/**
    @title ETH Pool Source
    @dev Handles interactions with the Rari ETH Pool
    @author Jet Jadeja <jet@rari.capital>
*/
contract ReptPoolSource is YieldSourceInterface {
    using SafeERC20 for IERC20; 
    using SafeMath for uint256;

    /*************
     * Constants *
    *************/
    IERC20 public constant override token = IERC20(0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2);
    IRariFundManager private constant fundManager = IRariFundManager(0xD6e194aF3d9674b62D1b30Ec676030C23961275e);

    /*************
     * Variables *
    *************/
    /** @dev Maps user to REPT balance */
    mapping(address => uint256) internal balances;

    /********************
    * External Functions *
    ********************/
    
    /** 
        @dev Supply ETH to the Rari ETH Pool
        @param amount The amount of ETH to be supplied to the
    */
    function supplyTo(uint256 amount, address to) external override {
        IERC20 rft = fundManager.rariFundToken();

        token.safeTransferFrom(msg.sender, address(this), amount);
        IWETH(address(token)).withdraw(amount);

        uint256 balance = rft.balanceOf(address(this));
        fundManager.deposit{value: amount}();
        uint256 minted = rft.balanceOf(address(this)).sub(balance);

        balances[to] = balances[to].add(minted);
    }

    /**
        @dev Redeems asset tokens from the Rari ETH Pool.
        @param amount The amount of yield-bearing tokens to be redeemed
        @return The actual amount of tokens that were redeemed.
     */
    function redeem(uint256 amount) external override returns (uint256) {
        IERC20 rft = fundManager.rariFundToken();
        require(balanceOf(msg.sender) >= amount);

        uint256 balance = rft.balanceOf(address(this));
        fundManager.withdraw(amount);
        uint256 burned = balance.sub(rft.balanceOf(address(this)));

        balances[msg.sender] = balances[msg.sender].sub(burned);
    }

    /**
        @return Returns the balance of the address in ETH
    */
    function balanceOf(address account) public override returns (uint256) {
        IERC20 rft = fundManager.rariFundToken();

        uint256 totalSupply = rft.totalSupply();
        uint256 balance = balances[account];
        uint256 fundBalance = fundManager.getFundBalance();

        return balance.mul(fundBalance).div(totalSupply);
    }

    receive() external payable {}
}