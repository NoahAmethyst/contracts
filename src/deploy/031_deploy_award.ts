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

const deployAward: DeployFunction = async function (
    hre
        : HardhatRuntimeEnvironment) {

    console.log("start deploy award")

    const {deployer, owner, manager} = await hre.getNamedAccounts();

    //固定配置
    let operator = "0xaC8a7df5cd8e7617Aa5D1D4FFF164abaC60b068c"

    //以下地址需根据不同链配置
    let adminData = "" //quiz文档里的dataStorage
    let awardData = ""


    console.log("current deployer is ", deployer)
    console.log("current owner is ", owner)

    const {deploy} = hre.deployments;


    console.log(await ethers.provider.getGasPrice())


    let deployed_award_contract = await deploy("Award", {
        from: owner,
        // gasLimit: 12500000,
        gasPrice: ethers.utils.parseUnits("300", "gwei"),
        log: true,
        args: [operator, adminData, awardData]
    })

    console.log("deployed game contract ", deployed_award_contract.address)

    const awardDataContract = await hre.ethers.getContractAt("AwardData", awardData)
    await awardDataContract.connect(owner).addOperator(deployed_award_contract.address)
    let success = await awardDataContract.operators(deployed_award_contract.address)
    console.log("game data  add operator success:", success)


};
export default deployAward;
