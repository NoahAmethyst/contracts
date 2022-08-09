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

    const {data_storage, game_data, game, game_logic} = CONTRACT_NAMES;


    // let deployed_data_contract = await deploy(data_storage, {
    //     from: owner,
    //     // gasLimit: 2000000,
    //     // gasPrice: ethers.utils.parseUnits("100", "gwei"),
    //     // deterministicDeployment: utils.formatBytes32String("test12"),
    //     log: true,
    // });
    //
    // console.log("deployed admin data contract ", deployed_data_contract.address)


    console.log(await ethers.provider.getGasPrice())
    let deployed_game_data_contract = await deploy(game_data, {
        from: owner,
        gasLimit: 12500000,
        // gasPrice: ethers.utils.parseUnits("100", "gwei"),
        // deterministicDeployment: utils.formatBytes32String("test12"),
        log: true,
    });

    console.log("deployed game data contract ", deployed_game_data_contract.address)


    // let deployed_game_logic_contract = await deploy(game_logic, {
    //     from: owner,
    //     gasLimit: 12500000,
    //     // gasPrice: ethers.utils.parseUnits("100", "gwei"),
    //     // deterministicDeployment: utils.formatBytes32String("test12"),
    //     log: true,
    //     args: [deployed_game_data_contract.address]
    // });
    //
    // console.log("deployed game data contract ", deployed_game_logic_contract.address)
    //
    // let deployed_game_contract = await deploy(game, {
    //     from: owner,
    //     gasLimit: 12500000,
    //     // gasPrice: ethers.utils.parseUnits("100", "gwei"),
    //     // deterministicDeployment: utils.formatBytes32String("test12"),
    //     log: true,
    //     // nonce: 8,
    //     args: [owner, deployed_data_contract.address,
    //         deployed_game_data_contract.address,
    //         deployed_game_logic_contract.address,
    //         "0x8464135c8F25Da09e49BC8782676a84730C318bC",
    //         100000000]
    // });
    //
    //
    // console.log("deployed game contract ", deployed_game_contract.address)
    //
    // const adminDataContract = await hre.ethers.getContractAt(CONTRACT_NAMES.data_storage, deployed_data_contract.address)
    // const gameDataContract = await hre.ethers.getContractAt(CONTRACT_NAMES.game_data, deployed_game_data_contract.address)
    // const gameLogicContract = await hre.ethers.getContractAt(CONTRACT_NAMES.game_logic, deployed_game_logic_contract.address)
    // const gameContract = await hre.ethers.getContractAt(CONTRACT_NAMES.game, deployed_game_contract.address)
    //
    //
    // const signedOwner = await getNamedSigner(hre, "owner");
    //
    // const gameDataOperation = await gameDataContract.connect(signedOwner)
    //
    // await gameDataOperation.addOperator(deployed_game_contract.address)
    // console.log("add game data operator ", deployed_game_contract.address)
    // let success = await gameDataOperation.operators(deployed_game_contract.address)
    // console.log("add game data operator success is ", success)
    //
    // const gameLogicOperation = await gameLogicContract.connect(signedOwner)
    // await gameLogicOperation.addOperator(deployed_game_contract.address)
    //
    // console.log("add game logic operator ", deployed_game_contract.address)
    //
    //
    // success = await gameLogicOperation.operators(deployed_game_contract.address)
    // console.log("add game logic operator success is ", success)


};
export default deployTest;
