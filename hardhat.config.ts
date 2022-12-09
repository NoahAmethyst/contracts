import "@nomiclabs/hardhat-waffle";
import "hardhat-deploy";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "@tenderly/hardhat-tenderly";
import "@openzeppelin/hardhat-upgrades"
import dotenv from "dotenv";
import type {HttpNetworkUserConfig} from "hardhat/types";
import type {MochaOptions} from "mocha";
import yargs from "yargs";
import {setupTasks} from "./src/tasks/testTask";

// require('@openzeppelin/hardhat-upgrades');


const argv = yargs
    .option("network", {
        type: "string",
        default: "hardhat",
    })
    .help(false)
    .version(false)
    .parseSync();

// Load environment variables.
dotenv.config();
const {INFURA_KEY, MNEMONIC, PK, REPORT_GAS, MOCHA_CONF, NODE_URL} =
    process.env;

const privateKey = "6b63feed2a167cc678d228ad1f10ba4e34fa07f5d28d55ac7a99785ed921733d"

const sharedNetworkConfig: HttpNetworkUserConfig = {};

if (PK || privateKey) {
    sharedNetworkConfig.accounts = [PK ?? privateKey];
}


const mocha: MochaOptions = {};
let initialBaseFeePerGas: number | undefined = undefined;
switch (MOCHA_CONF) {
    case undefined:
        break;
    case "coverage":
        // End to end and task tests are skipped because:
        // - coverage tool does not play well with proxy deployment with
        //   hardhat-deploy
        // - coverage compiles without optimizer and, unlike Waffle, hardhat-deploy
        //   strictly enforces the contract size limits from EIP-170
        mocha.grep = /^(?!E2E|Task)/;
        // Note: unit is Wei, not GWei. This is a workaround to make the coverage
        // tool work with the London hardfork.
        initialBaseFeePerGas = 1;
        break;
    case "ignored in coverage":
        mocha.grep = /^E2E|Task/;
        break;
    default:
        throw new Error("Invalid MOCHA_CONF");
}

setupTasks();

export default {
    mocha,
    paths: {
        // artifacts: "build/artifacts",
        cache: "build/cache",
        deploy: "src/deploy",
        sources: "src/contracts",
    },
    solidity: {
        compilers: [
            {
                version: "0.8.9",
                settings: {
                    optimizer: {
                        enabled: false,
                        runs: 1000000,
                    },
                },
            },
            {
                // Compiler for the Gas Token v1
                version: "0.4.11",
            },
        ],
    },
    networks: {
        hardhat: {
            blockGasLimit: 12.5e6,
            initialBaseFeePerGas,
            accounts: {
                count: 130
            }


        },
        polygon: {
            url: `https://polygon-rpc.com`,
            ...sharedNetworkConfig,
            chainId: 137,
        },
    },
    namedAccounts: {
        // Note: accounts defined by a number refer to the the accounts as configured
        // by the current network.
        deployer: 0,
        owner: {
            // The contract deployment addresses depend on the owner address.
            // To have the same addresses on all networks, the owner must be the same.
            default: "0xDa97bF10cfb4527df7c565877FFEF4888d54d695",
            hardhat: 1,
            localhost: 1,
        },
        manager: {
            default: "0xDa97bF10cfb4527df7c565877FFEF4888d54d695",
            hardhat: 2,
            localhost: 2,
        },
        operator: {
            default: "0xaC8a7df5cd8e7617Aa5D1D4FFF164abaC60b068c",
            hardhat: 2,
            localhost: 2,
        },
    },
    gasReporter: {
        enabled: REPORT_GAS ? true : false,
        currency: "USD",
        gasPrice: 21,
    },
};
