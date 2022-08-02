import {DeployFunction} from "hardhat-deploy/types";
import {HardhatRuntimeEnvironment} from "hardhat/types";

import {CONTRACT_NAMES, SALT} from "../ts/deploy";
import {ethers, waffle} from "hardhat";
import {string} from "hardhat/internal/core/params/argumentTypes";
import {Contract} from "hardhat/internal/hardhat-network/stack-traces/model";

const deployUnlimitToken: DeployFunction = async function ({
                                                               deployments,
                                                               getNamedAccounts,
                                                           }: HardhatRuntimeEnvironment) {

    console.log("start deploy unlimited token")

    const {deployer, owner, manager} = await getNamedAccounts();

    console.log("current deployer is ", deployer)
    console.log("current owner is ", owner)

    const {deploy} = deployments;

    const {unlimittoken} = CONTRACT_NAMES;
    let contract = await deploy(unlimittoken, {
        from: deployer,
        gasLimit: 2000000,
        gasPrice: ethers.utils.parseUnits("103", "gwei"),
        deterministicDeployment: SALT,
        log: true,
        args: ["QuizToken", "QZT"],
    });

};

export default deployUnlimitToken;
