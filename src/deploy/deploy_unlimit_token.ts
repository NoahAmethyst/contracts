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
    const {deployer, owner, manager} = await getNamedAccounts();
    const {deploy} = deployments;

    const {unlimittoken} = CONTRACT_NAMES;
    let contract = await deploy(unlimittoken, {
        from: deployer,
        gasLimit: 2000000,
        deterministicDeployment: SALT,
        log: true,
        // proxy: {
        //   owner,
        //   methodName: "initializeManager",
        // },
        args: ["QuizToken", "QZT"],
    });


    const token = await ethers.getContractAt(
        "ERC20Template",
        contract.address,
    );


    let t = await token.deployed()

    console.log("tokenSymbol:" + t.symbol())

};

export default deployUnlimitToken;
