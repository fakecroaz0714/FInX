require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: "0.8.20",
    networks: {
        hardhat: {
            chainId: 1337
        },
        // amoy: {
        //   url: process.env.POLYGON_AMOY_URL,
        //   accounts: [process.env.PRIVATE_KEY]
        // }
    }
};
