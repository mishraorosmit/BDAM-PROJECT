 import { HardhatUserConfig } from "hardhat/config"; // IMPORT HARDHAT and CONFIGS REQUIRED
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();  // SETUP DOTENV

const config: HardhatUserConfig = {
  solidity: "0.8.20",

  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
};

export default config;