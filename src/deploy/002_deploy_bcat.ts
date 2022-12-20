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

    console.log("start deploy cat")

    const {deployer, owner, manager} = await hre.getNamedAccounts();

    let operator = "0x91e0B2c118CF4a656e8dea7F4D312dC95B170E94"

    console.log("current deployer is ", deployer)
    console.log("current owner is ", owner)
    console.log("current operator is ", operator)

    const {deploy} = hre.deployments;
    const {BCAT, BCAT_PROXY} = CONTRACT_NAMES;


    console.log(await ethers.provider.getGasPrice())


    let deployed_proxy_contract = await deploy(BCAT_PROXY, {
        from: owner,
        // gasLimit: 12500000,
        gasPrice: ethers.utils.parseUnits("300", "gwei"),
        log: true,
        args: []
    })

    let deployed_cat_contract = await deploy(BCAT, {
        from: owner,
        // gasLimit: 12500000,
        gasPrice: ethers.utils.parseUnits("300", "gwei"),
        log: true,
        args: ["Tristan Community Activity Token", "TristanCAT", "0x4a99683dd308243f4b2488683cF0C92C37789799", "Tristan",
            BigNumber.from("5"), false, BigNumber.from("0"), BigNumber.from("20"),
            [
                [
                    // [tokenContract.address, BigNumber.from("100")],
                    ["0x0000000000000000000000000000000000000000", ethers.utils.parseEther("1")],
                ],
                [
                    // [tokenContract.address, BigNumber.from("200")],
                    ["0x0000000000000000000000000000000000000000", ethers.utils.parseEther("2")]
                ]
            ],
            deployed_proxy_contract.address]

    });

    console.log("deployed cat contract ", deployed_cat_contract.address)
};
export default deployBcat;
