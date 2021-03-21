require("@nomiclabs/hardhat-waffle");
require('dotenv').config()

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
    }
  }
};
