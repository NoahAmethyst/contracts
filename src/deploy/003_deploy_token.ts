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

const deployToken: DeployFunction = async function (
    hre
        : HardhatRuntimeEnvironment) {

    console.log("start deploy token")

    const {deployer, owner, manager} = await hre.getNamedAccounts();

    console.log("current deployer is ", deployer)
    console.log("current owner is ", owner)

    const {deploy} = hre.deployments;


    console.log(await ethers.provider.getGasPrice())

    //klaytn链需要gas固定为250
    let deployed_quizToken_contract = await deploy("ERC20Template", {
        from: owner,
        // gasLimit: 12500000,
        gasPrice: ethers.utils.parseUnits("300", "gwei"),
        log: true,
        args: ["Quiz Token", "QZT"]
    })

    console.log("deployed quizToken contract ", deployed_quizToken_contract.address)

    let deployed_tgo_contract = await deploy("StrictToken", {
        from: owner,
        // gasLimit: 12500000,
        gasPrice: ethers.utils.parseUnits("300", "gwei"),
        log: true,
        args: ["TGO Ticket", "t.TGO"]
    })

    console.log("deployed tgo contract ", deployed_tgo_contract.address)


    let deployed_tgr_contract = await deploy("StandardToken", {
        from: owner,
        // gasLimit: 12500000,
        gasPrice: ethers.utils.parseUnits("300", "gwei"),
        log: true,
        args: ["TGR Point", "TGRP", ethers.utils.parseEther("100000000")]
    })

    console.log("deployed tgr contract ", deployed_tgr_contract.address)


};
export default deployToken;
