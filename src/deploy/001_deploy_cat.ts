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

    console.log("start deploy cat")

    const {deployer, owner, manager} = await hre.getNamedAccounts();

    let operator = "0x91e0B2c118CF4a656e8dea7F4D312dC95B170E94"

    console.log("current deployer is ", deployer)
    console.log("current owner is ", owner)
    console.log("current operator is ", operator)

    const {deploy} = hre.deployments;
    const {CAT, CatMinter} = CONTRACT_NAMES;


    console.log(await ethers.provider.getGasPrice())
    let deployed_cat_contract = await deploy(CAT, {
        from: owner,
        // gasLimit: 12500000,
        gasPrice: ethers.utils.parseUnits("300", "gwei"),
        log: true,
        args: ["TestCat", "TCAT", "0x4a99683dd308243f4b2488683cF0C92C37789799", "Tristan"]

    });

    console.log("deployed cat contract ", deployed_cat_contract.address)


    let deployed_minter_contract = await deploy(CatMinter, {
        from: owner,
        gasLimit: 12500000,
        gasPrice: ethers.utils.parseUnits("300", "gwei"),
        // deterministicDeployment: utils.formatBytes32String("test12"),
        log: true,
        args: [deployed_cat_contract.address]
    });

    console.log("deployed minter contract ", deployed_minter_contract.address)

    const minterContract = await hre.ethers.getContractAt(CONTRACT_NAMES.CatMinter, deployed_minter_contract.address)
    const catContract = await hre.ethers.getContractAt(CONTRACT_NAMES.CAT, deployed_cat_contract.address)


    const signedOwner = await getNamedSigner(hre, "owner");

    // await catContract.connect(signedOwner).addOperator(minterContract.address)
    // console.log("add cat operator ", minterContract.address)
    // let success = await catContract.operators(minterContract.address)
    // console.log("add cat operator success is ", success)
    // addoperator
    // await minterContract.connect(signedOwner).addOperator(operator)
    // const isOperator = await minterContract.operators(operator)
    // console.log("minter operator add ", isOperator)


    // let chainId = 137
    // console.log("UPDATE contracts SET address = '%s' WHERE name='cat' AND chain_id = %s;", catContract.address, chainId)
    // console.log("UPDATE contracts SET address = '%s' WHERE name='cat_minter' AND chain_id = %s;", minterContract.address, chainId)
    // console.log("INSERT INTO `admins` (`id`, `address`, `contract_address`, `secret_key`) VALUES ('6b52971d52354b3bb386cb583c901425',	" +
    //     "'0x91e0B2c118CF4a656e8dea7F4D312dC95B170E94',	'%s',	'666666');", minterContract.address);
    // console.log("update mint_jobs set contr_addr = '%s' where app_id='Tristan';", catContract.address);
    //
    //
    // //swichTransfer
    // // const result2 = await catContract.connect(signedOwner).switchCanTransfer();
    // // const txn2 = await result2.wait()
    // // console.log(txn2)



};
export default deployTest;
