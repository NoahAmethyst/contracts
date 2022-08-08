import {DeployFunction} from "hardhat-deploy/types";
import {HardhatRuntimeEnvironment} from "hardhat/types";

import {CONTRACT_NAMES, SALT} from "../ts/deploy";
import {ethers, waffle} from "hardhat";
import {string} from "hardhat/internal/core/params/argumentTypes";
import {Contract} from "hardhat/internal/hardhat-network/stack-traces/model";
import {utils} from "ethers";
import {getNamedSigner} from "../tasks/ts/signers";


const deployUnlimitToken: DeployFunction = async function (
    hre
        : HardhatRuntimeEnvironment) {

    console.log("start deploy unlimited token")

    const {deployer, owner, manager, operator} = await hre.getNamedAccounts();

    console.log("current deployer is ", deployer)
    console.log("current owner is ", owner)
    console.log("current operator is ", operator)

    const {deploy} = hre.deployments;

    const {unlimittoken} = CONTRACT_NAMES;


    console.log(await ethers.provider.getGasPrice())
    let deployed_contract = await deploy(unlimittoken, {
        from: owner,
        // gasLimit: 2000000,
        // gasPrice: ethers.utils.parseUnits("100", "gwei"),
        // deterministicDeployment: utils.formatBytes32String("test12"),
        log: true,
        // nonce: 8,
        args: ["TestToken", "TT"],
    });

    console.log("deployed token contract ", deployed_contract.address)

    // const contract = await hre.ethers.getContractAt(CONTRACT_NAMES.unlimittoken, deployed_contract.address)
    //
    // // const contract = await hre.ethers.getContractAt(CONTRACT_NAMES.unlimittoken, "0xB7CB18d334A74472Bd32a1D572802A58E0bDC61d")
    // const signedOwner = await getNamedSigner(hre, "owner");
    // const operation = await contract.connect(signedOwner)
    // const _owner = await operation.owner();
    // console.log("contract owner ", _owner);
    // // await operation.mint("0xA5Ba38f32404Bc3C2de4ff540718054a7d6ed2Cd", 100000);
    // let balance = await operation.balanceOf("0xA5Ba38f32404Bc3C2de4ff540718054a7d6ed2Cd");
    // console.log("balance ", balance)
    // // await operation.burn("0xA5Ba38f32404Bc3C2de4ff540718054a7d6ed2Cd", 50000)
    // balance = await operation.balanceOf("0xA5Ba38f32404Bc3C2de4ff540718054a7d6ed2Cd");
    // console.log("balance ", balance)




};
export default deployUnlimitToken;
