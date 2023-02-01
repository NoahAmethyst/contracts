import {DeployFunction} from "hardhat-deploy/types";
import {HardhatRuntimeEnvironment} from "hardhat/types";

import {CONTRACT_NAMES, SALT} from "../ts/deploy";
import {ethers, waffle} from "hardhat";
import {string} from "hardhat/internal/core/params/argumentTypes";
import {Contract} from "hardhat/internal/hardhat-network/stack-traces/model";
import {BigNumber, BigNumberish, utils} from "ethers";
import {getNamedSigner} from "../tasks/ts/signers";
import {Address} from "hardhat-deploy/dist/types";
import {address} from "hardhat/internal/core/config/config-validation";
import {AddressOne} from "@gnosis.pm/safe-contracts";

const deployGame: DeployFunction = async function (
    hre
        : HardhatRuntimeEnvironment) {

    console.log("start deploy game")

    const {deployer, owner, manager} = await hre.getNamedAccounts();

    //固定配置
    let operator = "0xaC8a7df5cd8e7617Aa5D1D4FFF164abaC60b068c"
    let buffConsume = ethers.utils.parseEther("2")

    //以下地址需根据不同链配置
    let adminData = "" //quiz文档里的dataStorage
    let gameData = ""
    let gameLogic = ""
    let quizToken = "" //QZT用作game buff的购买货币


    console.log("current deployer is ", deployer)
    console.log("current owner is ", owner)

    const {deploy} = hre.deployments;


    console.log(await ethers.provider.getGasPrice())


    let deployed_game_contract = await deploy("Game", {
        from: owner,
        // gasLimit: 12500000,
        gasPrice: ethers.utils.parseUnits("300", "gwei"),
        log: true,
        args: [operator, adminData, gameData, gameLogic, quizToken, buffConsume]
    })

    console.log("deployed game contract ", deployed_game_contract.address)

    const quizContract = await hre.ethers.getContractAt("ERC20Template", quizToken)
    const gameDataContract = await hre.ethers.getContractAt("GameDataStorage", gameData)
    const gameLogicContract = await hre.ethers.getContractAt("GameLogic", gameLogic)


    console.log("add quiz operator ", deployed_game_contract.address)
    await quizContract.connect(owner).addOperator(deployed_game_contract.address)
    let success = await quizContract.operators(deployed_game_contract.address)
    console.log("quiz add operator success:", success)


    console.log("add game data operator ", deployed_game_contract.address)
    await gameDataContract.connect(owner).addOperator(deployed_game_contract.address)
    success = await gameDataContract.operators(deployed_game_contract.address)
    console.log("game data  add operator success:", success)

    console.log("add logic  operator ", deployed_game_contract.address)
    await gameLogicContract.connect(owner).addOperator(deployed_game_contract.address)
    success = await gameLogicContract.operators(deployed_game_contract.address)
    console.log("game logic add operator success:", success)


};
export default deployGame;
