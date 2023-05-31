import {expect} from "chai";
import {BigNumber, Contract, providers} from "ethers";
import {ethers, waffle} from "hardhat";
import {CONTRACT_NAMES} from "../src/ts";
import {getNamedSigner} from "../src/tasks/ts/signers";
import {string} from "hardhat/internal/core/params/argumentTypes";
import {Address} from "hardhat-deploy/dist/types";
import {address} from "hardhat/internal/core/config/config-validation";
import {AddressOne} from "@gnosis.pm/safe-contracts";

describe("util test", () => {
    const [deployer, owner, nonSolver, ...solvers] = waffle.provider.getWallets();
    const Web3 = require('web3');
    let web3 = new Web3(waffle.provider);
    let tokenUrlContract: Contract;
    let zeroAddr = "0x0000000000000000000000000000000000000000"

    console.log("current deployer is ", deployer.address)
    console.log("current owner is ", owner.address)

    let tokenContract: Contract
    let airdropContract: Contract


    beforeEach(async () => {

        const tokenSolidity = await ethers.getContractFactory(
            "UnlimitedToken",
            owner,
        );

        tokenContract = await tokenSolidity.deploy("TestT", "TT");

        const airdropSolidity = await ethers.getContractFactory(
            "AirDropper",
            owner,
        );


        airdropContract = await airdropSolidity.deploy(
        );

        await tokenContract.connect(owner).mint(owner.address, 100000000)

    });


    describe("airdrop", () => {
        it("air drop erc20", async () => {

            await tokenContract.connect(owner).approve(airdropContract.address, 100000000)

            let receivers = []
            for (let i = 1; i < 50; i++) {
                receivers.push(solvers[i].address)
            }

            let amounts = []
            for (let i = 1; i < 50; i++) {
                amounts.push(i * 10)
            }

            const result = await airdropContract.connect(owner).airdrop(tokenContract.address, receivers, amounts)
            const txn = await result.wait()
            expect(txn.blockNumber).to.be.greaterThan(0)

            for (let i = 1; i < 50; i++) {
                const balance = await tokenContract.balanceOf(solvers[i].address)
                console.log("account %s balance %s", solvers[i].address, balance.toString())
            }
        })


        it("air drop eth", async () => {



            let receivers = []
            for (let i = 1; i < 50; i++) {
                receivers.push(solvers[i].address)
            }

            let amounts = []
            for (let i = 1; i < 50; i++) {
                amounts.push(ethers.utils.parseEther("1"))
            }

            const ethBalance = await owner.provider.getBalance(owner.address)
            console.log("before airdrop  balance %s", ethBalance.toString())

            const result = await airdropContract.connect(owner).airdrop(zeroAddr, receivers, amounts, {value: ethers.utils.parseEther("20")})
            const txn = await result.wait()
            expect(txn.blockNumber).to.be.greaterThan(0)

            for (let i = 1; i < 50; i++) {
                const ethBalance = await owner.provider.getBalance(solvers[i].address)
                console.log("account %s balance %s", solvers[i].address, ethBalance.toString())
            }
        })


    })

});
