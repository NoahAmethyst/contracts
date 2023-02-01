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

const deployGameData: DeployFunction = async function (
    hre
        : HardhatRuntimeEnvironment) {

    console.log("start deploy game data")

    const {deployer, owner, manager} = await hre.getNamedAccounts();


    console.log("current deployer is ", deployer)
    console.log("current owner is ", owner)

    const {deploy} = hre.deployments;


    console.log(await ethers.provider.getGasPrice())


    let deployed_gamedata_contract = await deploy("GameDataStorage", {
        from: owner,
        // gasLimit: 12500000,
        gasPrice: ethers.utils.parseUnits("300", "gwei"),
        log: true,
        args: []
    })

    console.log("deployed gamedata contract ", deployed_gamedata_contract.address)


};
export default deployGameData;
