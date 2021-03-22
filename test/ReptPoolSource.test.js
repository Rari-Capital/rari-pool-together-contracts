const { expect, assert } = require('chai')
const hardhat = require('hardhat')
const erc20ABI = require("./abi/ERC20Abi.json");

const userAddress = "0x0092081d8e3e570e9e88f4563444bd4b92684502";
const reptAddress = "0xCda4770d65B4211364Cb870aD6bE19E7Ef1D65f4";
const wethAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);
chai.should();

let reptPoolSource, user, weth;

describe("ReptPoolSource", async () => {
    before(async () => {
        const ReptPoolSource = await ethers.getContractFactory("ReptPoolSource");
        reptPoolSource = await ReptPoolSource.deploy();
        await reptPoolSource.deployed();

        await hardhat.network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [userAddress]
        });
        
        user = await ethers.provider.getSigner(userAddress);
        rept = await ethers.getContractAt(erc20ABI, reptAddress);
        weth = await ethers.getContractAt(erc20ABI, wethAddress);
    });

    it("Deposits ETH, mints REPT", async () => {
        await weth.connect(user).approve(reptPoolSource.address, "1000000000000000000");
        await reptPoolSource.connect(user).supplyTokenTo("1000000000000000000", userAddress);
        assert((await rept.balanceOf(reptPoolSource.address)).gt(0));
    });

    it("Returns correct balance", async () => {
        assert((await reptPoolSource.callStatic.balanceOfToken(userAddress)).gt("999999999999999990"));
    })

    it("Withdraw WETH, Burn REPT", async () => {
        const balance = await reptPoolSource.callStatic.balanceOfToken(userAddress);
        await reptPoolSource.connect(user).redeemToken(balance);
        
        assert((await reptPoolSource.callStatic.balanceOfToken(userAddress)).lt(10));
    });

    it("Won't let user withdraw more than balance", async () => {
        await reptPoolSource.connect(user).redeemToken("1000").should.be.rejectedWith("revert");
    });
});