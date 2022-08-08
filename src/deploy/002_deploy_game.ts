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


const deployTest: DeployFunction = async function (
    hre
        : HardhatRuntimeEnvironment) {

    console.log("start deploy game")

    const {deployer, owner, manager, operator} = await hre.getNamedAccounts();

    console.log("current deployer is ", deployer)
    console.log("current owner is ", owner)
    console.log("current operator is ", operator)

    const {deploy} = hre.deployments;

    const {data_storage, game_data, game} = CONTRACT_NAMES;

    let deployed_data_contract = await deploy(data_storage, {
        from: owner,
        // gasLimit: 2000000,
        // gasPrice: ethers.utils.parseUnits("100", "gwei"),
        // deterministicDeployment: utils.formatBytes32String("test12"),
        log: true,
    });

    console.log("deployed admin data contract ", deployed_data_contract.address)


    console.log(await ethers.provider.getGasPrice())
    let deployed_game_data_contract = await deploy(game_data, {
        from: owner,
        gasLimit: 12500000,
        gasPrice: ethers.utils.parseUnits("100", "gwei"),
        // deterministicDeployment: utils.formatBytes32String("test12"),
        log: true,
    });

    console.log("deployed game data contract ", deployed_game_data_contract.address)


    let deployed_game_contract = await deploy(game, {
        from: owner,
        gasLimit: 12500000,
        gasPrice: ethers.utils.parseUnits("100", "gwei"),
        // deterministicDeployment: utils.formatBytes32String("test12"),
        log: true,
        // nonce: 8,
        args: [owner, deployed_data_contract.address, deployed_game_data_contract.address, "0x8464135c8F25Da09e49BC8782676a84730C318bC", 100000000]
    });


    console.log("deployed game contract ", deployed_game_contract.address)

    // const adminDataContract = await hre.ethers.getContractAt(CONTRACT_NAMES.data_storage, deployed_data_contract.address)
    // const gameDataContract = await hre.ethers.getContractAt(CONTRACT_NAMES.game_data, deployed_game_data_contract.address)
    // const gameContract = await hre.ethers.getContractAt(CONTRACT_NAMES.game, deployed_game_contract.address)
    //
    //
    // const signedOwner = await getNamedSigner(hre, "owner");
    // const dataOperator = await adminDataContract.connect(signedOwner)
    // await dataOperator.addAdmin("test", signedOwner.address)
    // const gameDataOperation = await gameDataContract.connect(signedOwner)
    // await gameDataOperation.addOperator(deployed_game_contract.address)
    // console.log("add operator ", deployed_game_contract.address)
    // let round = await gameDataContract.getGameRound(1, 1)
    // console.log("round ", round)
    //
    // const gameOperation = await gameContract.connect(signedOwner)
    //
    //
    // let _game: [BigNumberish, BigNumberish, string, BigNumberish,
    //     BigNumberish, string, string, string,
    //     BigNumberish, BigNumberish, BigNumberish, BigNumberish[],
    //     string[], boolean, Address, BigNumberish,
    //     BigNumberish, BigNumberish, boolean, BigNumberish,
    //     BigNumberish, boolean, Promise<string>] = [
    //     BigNumber.from(1), BigNumber.from(1), "test", BigNumber.from(1),
    //     BigNumber.from(1), "test", "test", "test",
    //     BigNumber.from(1), BigNumber.from(1), BigNumber.from(1), [BigNumber.from(1), BigNumber.from(1), BigNumber.from(1)],
    //     ["test", "test"], false, "0x8464135c8F25Da09e49BC8782676a84730C318bC", 1,
    //     BigNumber.from(1), BigNumber.from(1), false, BigNumber.from(1),
    //     BigNumber.from(1), true, signedOwner.getAddress()
    // ];
    //
    // await gameOperation.createGame(_game)
    // let gameDetail = await gameDataOperation.getGame(1)
    // console.log("gameDetail ", gameDetail)
    // await gameOperation.startGame("test", 1, 10000000)
    // await gameOperation.gameRoundOver("test", 1, 0)

};
export default deployTest;
