require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require('dotenv').config();

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.7.3",
  networks: {
    hardhat: {
      forking: {
        url: process.env.FORKING_URL,
        blockNumber: 12077686,
      },
      blockNumber: 12077686,
    },
    mainnet: {
      url: process.env.FORKING_URL,
      accounts: [`0x${process.env.PRIV}`]
    }
  }
};
