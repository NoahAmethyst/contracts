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
import {ethers} from "hardhat";

const solversTaskList = ["add", "check", "remove", "list"] as const;
type SolversTasks = typeof solversTaskList[number];


interface Args {
    printTransaction: boolean;
}

async function initGame(args: Args, hre: HardhatRuntimeEnvironment) {
    console.log("test task")
    console.log(args)

    const adminContractAddr = "0xE2db168e089e589F019E657Bde92Df5BC7E0dCb9"
    const gameDataContractAddr = "0x3E7F5ABe2BeA33Fb8B4e6BDb155439B595fcCec9"
    const gameContractAddr = "0x232B275a6f7A8BE32203164A8aCF61eFD37AA41b"
    const tokenAddr = "0x881c7f27A79F3ab9d340e5f918f6694Cb45013B6"


    const adminDataContract = await hre.ethers.getContractAt(CONTRACT_NAMES.data_storage, adminContractAddr)
    const gameDataContract = await hre.ethers.getContractAt(CONTRACT_NAMES.game_data, gameDataContractAddr)
    const gameContract = await hre.ethers.getContractAt(CONTRACT_NAMES.game, gameContractAddr)

    // const adminDataContract = await hre.ethers.getContractAt(CONTRACT_NAMES.data_storage, deployed_data_contract.address)
    // const gameDataContract = await hre.ethers.getContractAt(CONTRACT_NAMES.game_data, deployed_game_data_contract.address)
    // const gameContract = await hre.ethers.getContractAt(CONTRACT_NAMES.game, deployed_game_contract.address)


    const signedOwner = await getNamedSigner(hre, "owner");
    // const dataOperator = await adminDataContract.connect(signedOwner)
    // await dataOperator.addAdmin("test", signedOwner.address)
    // const gameDataOperation = await gameDataContract.connect(signedOwner)
    // await gameDataOperation.addOperator(gameContractAddr)
    // console.log("add operator ", gameContractAddr)
    // let round = await gameDataContract.getGameRound(1, 1)
    // console.log(round)

    const gameOperation = await gameContract.connect(signedOwner)

    const appId = "TristanPolygon"
    const groupId = BigNumber.from(1004983124884721704)
    const startTime = new Date().getTime() / 1000
    const endTime = startTime + 1000
    const gameId = startTime
    console.log("gameId", gameId)

    let _game = [
        gameId, BigNumber.from(1), appId, groupId,
        BigNumber.from(1), "test", "test", "test",
        BigNumber.from(50), BigNumber.from(50), BigNumber.from(1), [BigNumber.from(1), BigNumber.from(2), BigNumber.from(3)],
        "test", ["test", "test"], false, "0x8464135c8F25Da09e49BC8782676a84730C318bC", ethers.utils.parseEther("1"),
        startTime, endTime, false, BigNumber.from(1),
        BigNumber.from(1), true, tokenAddr
    ];

    await gameOperation.createGame(_game)
    // await gameOperation.startGame("test", 1, 10000000)
    // await gameOperation.gameRoundOver("test", 1, 0)
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
