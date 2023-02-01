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

const deployBcat: DeployFunction = async function (
    hre
        : HardhatRuntimeEnvironment) {

    console.log("start deploy quiz")

    const {deployer, owner, manager} = await hre.getNamedAccounts();


    //固定
    let operator = "0xaC8a7df5cd8e7617Aa5D1D4FFF164abaC60b068c"
    let quizAwardAmount = ethers.utils.parseEther("10")
    let tgoAwardAmount = ethers.utils.parseEther("1")
    //以下地址根据对应链部署变化
    let quizToken = ""
    let tgo = ""
    let dataStorage = ""
    let lottery = ""


    console.log("current deployer is ", deployer)
    console.log("current owner is ", owner)
    console.log("current operator is ", operator)

    const {deploy} = hre.deployments;


    console.log(await ethers.provider.getGasPrice())

    //klaytn链需要gas固定为250
    let deployed_quiz_contract = await deploy("QuizV3", {
        from: owner,
        // gasLimit: 12500000,
        gasPrice: ethers.utils.parseUnits("300", "gwei"),
        log: true,
        args: [operator, lottery, quizToken, tgo, dataStorage, ethers.utils.parseEther("10"), quizAwardAmount, tgoAwardAmount]
    })

    console.log("deployed quiz contract ", deployed_quiz_contract.address)

    const quizContract = await hre.ethers.getContractAt("ERC20Template", quizToken)
    const tgoContract = await hre.ethers.getContractAt("StrictToken", tgo)
    const dataStorageContract = await hre.ethers.getContractAt("DataStorage", dataStorage)
    const lotteryContract = await hre.ethers.getContractAt("LotteryPool", lottery)


    console.log("add quiz operator ", deployed_quiz_contract.address)
    await quizContract.connect(owner).addOperator(deployed_quiz_contract.address)
    let success = await quizContract.operators(deployed_quiz_contract.address)
    console.log("quiz add operator success:", success)


    console.log("add tgo operator ", deployed_quiz_contract.address)
    await tgoContract.connect(owner).addOperator(deployed_quiz_contract.address)
    success = await tgoContract.operators(deployed_quiz_contract.address)
    console.log("tgo add operator success:", success)

    console.log("add dataStorage operator ", deployed_quiz_contract.address)
    await dataStorageContract.connect(owner).addOperator(deployed_quiz_contract.address)
    success = await dataStorageContract.operators(deployed_quiz_contract.address)
    console.log("dataStorage add operator success:", success)


    console.log("add lottery operator ", deployed_quiz_contract.address)
    await lotteryContract.connect(owner).addOperator(deployed_quiz_contract.address)
    success = await dataStorageContract.operators(deployed_quiz_contract.address)
    console.log("lottery add operator success:", success)


};
export default deployBcat;
