import {expect} from "chai";
import {BigNumber, Contract, providers} from "ethers";
import {ethers, waffle, upgrades} from "hardhat";
import {CONTRACT_NAMES} from "../src/ts";
import {GameDataStorage} from "../ethereum-abi-types/GameDataStorage";
import {getNamedSigner} from "../src/tasks/ts/signers";
import {string} from "hardhat/internal/core/params/argumentTypes";
import {Address} from "hardhat-deploy/dist/types";
import {address} from "hardhat/internal/core/config/config-validation";
import {AddressOne} from "@gnosis.pm/safe-contracts";

describe("catTest", () => {
    const [deployer, owner, nonSolver, ...solvers] = waffle.provider.getWallets();
    let tokenUrlContract: Contract;


    console.log("current deployer is ", deployer.address)
    console.log("current owner is ", owner.address)
    let catContract: Contract;
    let proxyContract: Contract
    let token1Contract: Contract
    let token2Contract: Contract


    beforeEach(async () => {
        const tokenUrlSolidity = await ethers.getContractFactory(
            "Tokenuri",
            owner,
        );

        tokenUrlContract = await tokenUrlSolidity.deploy("https://test");

        const tokenSolidity = await ethers.getContractFactory(
            "UnlimitedToken",
            owner,
        );

        token1Contract = await tokenSolidity.deploy("TestT1", "TT1");
        token2Contract = await tokenSolidity.deploy("TestT2", "TT2");

        const cashierSolidity = await ethers.getContractFactory(
            "CatProxy",
            owner,
        );

        proxyContract = await cashierSolidity.deploy();

        const catSolidity = await ethers.getContractFactory(
            "CATV2",
            owner,
        );

        catContract = await catSolidity.deploy(
            "Tristan Community Activity Token", "TristanCAT", tokenUrlContract.address, "Tristan",
            proxyContract.address,
            token1Contract.address,
            token2Contract.address
        );

        const canTransfer = await catContract.canTransfer()
        const maxLevel = await catContract.maxLevel()
        const freeMintCount = await catContract.freeMintCount()
        console.log("canTransfer:%s  maxLevel:%s freeMintCount:%s", canTransfer, maxLevel, freeMintCount)

        for (let i = 1; i < 6; i++) {
            const price = await catContract.getUpgradeCost(i)
            console.log("level%s", i, "cost:", price)
        }
    });


    describe("cat mint", () => {
        it("transfer when canTransfer is false", async () => {
            console.log("set canTransfer false")
            console.log("mint")
            const result1 = await catContract.connect(owner).batchFreeMint([solvers[0].address]);
            const txn1 = await result1.wait()
            expect(txn1.blockNumber).to.be.greaterThan(0)
            console.log("mint success")

            console.log("transfer")
            const result2 = await catContract.connect(solvers[0]).transferFrom(solvers[0].address, solvers[1].address, 2023)
            const txn2 = await result2.wait()
            expect(txn2.blockNumber).to.be.greaterThan(0)
            console.log("transfer success")
        })

        it("transfer when canTransfer is false and caller is operator", async () => {
            console.log("set canTransfer false")
            console.log("mint")
            const result1 = await catContract.connect(owner).batchFreeMint([owner.address]);
            const txn1 = await result1.wait()
            expect(txn1.blockNumber).to.be.greaterThan(0)
            console.log("mint success")

            console.log("transfer")
            const result2 = await catContract.connect(owner).transferFrom(owner.address, solvers[1].address, 2023)
            const txn2 = await result2.wait()
            expect(txn2.blockNumber).to.be.greaterThan(0)
            console.log("transfer success")
        })

        it("batch free mint", async () => {
            await catContract.connect(owner).setConfig(false, 5, 50, 2000)
            const freeMintCount = await catContract.freeMintCount()
            console.log("free mint count:", freeMintCount)
            let receivers = []
            for (let i = 1; i < freeMintCount; i++) {
                receivers.push(solvers[i].address)
            }

            const result = await catContract.connect(owner).batchFreeMint(receivers);
            const txn = await result.wait()
            expect(txn.blockNumber).to.be.greaterThan(0)

            const freeMintProcess = await catContract.freeMintProcessCount()
            const level1Count = await catContract.levelCount(1)

            console.log("free mint process count:", freeMintProcess, " level1Count:", level1Count)


            // const result1 = await catContract.connect(owner).freeMint(solvers[0].address);
            // const txn1 = await result1.wait()
            // expect(txn1.blockNumber).to.be.greaterThan(0)
        })


        it("upgrade", async () => {
            await catContract.connect(owner).setConfig(false, 5, 0, 0)
            await token1Contract.connect(owner).mint(solvers[0].address, ethers.utils.parseEther("100000"))
            await token1Contract.connect(solvers[0]).approve(catContract.address, ethers.utils.parseEther("100000"))
            await token2Contract.connect(owner).mint(solvers[0].address, ethers.utils.parseEther("100000"))
            await token2Contract.connect(solvers[0]).approve(catContract.address, ethers.utils.parseEther("100000"))

            console.log("mint")

            const result1 = await catContract.connect(solvers[0]).publicMint({value: ethers.utils.parseEther("5")});
            const txn1 = await result1.wait()
            expect(txn1.blockNumber).to.be.greaterThan(0)
            const balance = await catContract.balanceOf(solvers[0].address)
            const tokenId = await catContract.tokenOfOwnerByIndex(solvers[0].address, balance - 1)
            console.log("mint success,start upgrade")

            for (let i = 0; i < 4; i++) {
                const result2 = await catContract.connect(solvers[0]).upgrade(tokenId);
                const txn2 = await result2.wait()
                expect(txn2.blockNumber).to.be.greaterThan(0)
            }
            console.log("upgrade success")

            const level = await catContract.level(tokenId)
            const nowLevelCount = await catContract.levelCount(level)
            console.log("token level:%s,now level count:%s", level, nowLevelCount)
            const tokenBalance = await token1Contract.balanceOf(solvers[0].address)
            const catTokenBalance = await token1Contract.balanceOf(catContract.address)
            const catEthBalance = await owner.provider.getBalance(catContract.address)
            console.log("caller tokenBalance:", tokenBalance, " catTokenBalance:", catTokenBalance,
                "\ncatEth:", catEthBalance)


        })

        //
        it("batch public mint", async () => {

            catContract.connect(owner).setConfig(false, 5, 0, 0)

            for (let i = 0; i < 50; i++) {
                const result1 = await catContract.connect(solvers[i]).publicMint({value: ethers.utils.parseEther("5")});
                const txn1 = await result1.wait()
                expect(txn1.blockNumber).to.be.greaterThan(0)
                const balance = await catContract.balanceOf(solvers[i].address)
                const tokenId = await catContract.tokenOfOwnerByIndex(solvers[i].address, balance - 1)
                console.log(" mint tokenId:", tokenId)
            }

            const catEthBalance = await owner.provider.getBalance(catContract.address)
            console.log("catEth:", catEthBalance)

            const freeMintProcess = await catContract.freeMintProcessCount()
            const level1Count = await catContract.levelCount(1)
            const price = await catContract.getUpgradeCost(1)

            console.log("free mint process count:", freeMintProcess, " level1Count:", level1Count, " mintPrice: ", price)
        })


        it("mint with level", async () => {
            console.log("\n mint with level")
            const result1 = await catContract.connect(owner).mintWithLevel(solvers[0].address, 5);
            const txn1 = await result1.wait()
            expect(txn1.blockNumber).to.be.greaterThan(0)
            const level = await catContract.level(2023)
            const nowLevelCount = await catContract.levelCount(level)
            console.log("token level:%s,now level count:%s", level, nowLevelCount)
        })
    })

});
