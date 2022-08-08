import "hardhat-deploy";
import "@nomiclabs/hardhat-ethers";

import {subtask, task} from "hardhat/config";
import {HardhatRuntimeEnvironment} from "hardhat/types";

import {getDeployedContract} from "./ts/deployment";
import {getNamedSigner} from "./ts/signers";
import {getSolvers} from "./ts/solver";
import {transactionUrl} from "./ts/tui";
import {CONTRACT_NAMES} from "../ts";
import {BigNumber, BigNumberish} from "ethers";
import {string} from "hardhat/internal/core/params/argumentTypes";
import {Address} from "hardhat-deploy/dist/types";

const solversTaskList = ["add", "check", "remove", "list"] as const;
type SolversTasks = typeof solversTaskList[number];


interface Args {
    printTransaction: boolean;
}

async function initGame(args: Args, hre: HardhatRuntimeEnvironment) {
    console.log("test task")
    console.log(args)

    const adminContractAddr = "0x71C95911E9a5D330f4D621842EC243EE1343292e"
    const gameDataContractAddr = "0x948B3c65b89DF0B4894ABE91E6D02FE579834F8F"
    const gameContractAddr = "0x712516e61C8B383dF4A63CFe83d7701Bce54B03e"


    const adminDataContract = await hre.ethers.getContractAt(CONTRACT_NAMES.data_storage, adminContractAddr)
    const gameDataContract = await hre.ethers.getContractAt(CONTRACT_NAMES.game_data, gameDataContractAddr)
    const gameContract = await hre.ethers.getContractAt(CONTRACT_NAMES.game, gameContractAddr)

    // const adminDataContract = await hre.ethers.getContractAt(CONTRACT_NAMES.data_storage, deployed_data_contract.address)
    // const gameDataContract = await hre.ethers.getContractAt(CONTRACT_NAMES.game_data, deployed_game_data_contract.address)
    // const gameContract = await hre.ethers.getContractAt(CONTRACT_NAMES.game, deployed_game_contract.address)


    const signedOwner = await getNamedSigner(hre, "owner");
    const dataOperator = await adminDataContract.connect(signedOwner)
    await dataOperator.addAdmin("test", signedOwner.address)
    const gameDataOperation = await gameDataContract.connect(signedOwner)
    await gameDataOperation.addOperator(gameContractAddr)
    console.log("add operator ", gameContractAddr)
    let round = await gameDataContract.getGameRound(1, 1)
    console.log(round)

    const gameOperation = await gameContract.connect(signedOwner)


    let _game = [
        BigNumber.from(1), BigNumber.from(1), "test", BigNumber.from(1),
        BigNumber.from(1), "test", "test", "test",
        BigNumber.from(1), BigNumber.from(1), BigNumber.from(1), [BigNumber.from(1), BigNumber.from(1), BigNumber.from(1)],
        ["test", "test"], false, "0x8464135c8F25Da09e49BC8782676a84730C318bC", 1,
        BigNumber.from(1), BigNumber.from(1), false, BigNumber.from(1),
        BigNumber.from(1), true, signedOwner.getAddress()
    ];

    await gameOperation.createGame(_game)
    await gameOperation.startGame("test", 1, 10000000)
    await gameOperation.gameRoundOver("test", 1, 0)
}


const isSolver = async (solver: string, hre: HardhatRuntimeEnvironment) => {
    const authenticator = await getDeployedContract(
        CONTRACT_NAMES.unlimittoken,
        hre,
    );

    console.log(
        `${solver} is ${
            (await authenticator.isSolver(solver)) ? "" : "NOT "
        }a solver.`,
    );
};

export const setupTasks: () => void = () => {
    task("initGameTask", "initialize game status firstly")
        .setAction(initGame);
};
