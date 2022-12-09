import {expect} from "chai";
import {BigNumber, Contract} from "ethers";
import {ethers, waffle} from "hardhat";
import {CONTRACT_NAMES} from "../src/ts";
import {GameDataStorage} from "../ethereum-abi-types/GameDataStorage";
import {getNamedSigner} from "../src/tasks/ts/signers";
import {string} from "hardhat/internal/core/params/argumentTypes";

describe("testAward", () => {
    const [deployer, owner, nonSolver, ...solvers] = waffle.provider.getWallets();
    let tokenUrlContract: Contract;

    console.log("current deployer is ", deployer.address)
    console.log("current owner is ", owner.address)
    let minterContract: Contract;
    let catContract: Contract

    beforeEach(async () => {
        const tokenUrlSolidity = await ethers.getContractFactory(
            "Tokenuri",
            owner,
        );

        tokenUrlContract = await tokenUrlSolidity.deploy("https://test");

        const catSolidity = await ethers.getContractFactory(
            "CAT",
            owner,
        );

        catContract = await catSolidity.deploy("Tristan Community Activity Token", "TristanCAT", tokenUrlContract.address, "Tristan");


        const minterSolidity = await ethers.getContractFactory(
            "Minter",
            owner,
        );

        minterContract = await minterSolidity.deploy(catContract.address)


        await catContract
        await minterContract
        await catContract.connect(owner).addOperator(minterContract.address);

    });


    describe("test cat mint", () => {


        // it("test free mint", async () => {
        //
        //     const result1 = await minterContract.connect(owner).freeMint(solvers[0].address);
        //     const txn1 = await result1.wait()
        //     expect(txn1.blockNumber).to.be.greaterThan(0)
        //
        //     const balance = await catContract.balanceOf(solvers[0].address)
        //     const tokenId = await catContract.tokenOfOwnerByIndex(solvers[0].address, balance - 1)
        //     console.log("mint tokenId:", tokenId)
        //
        // })


        // it("test batch free mint", async () => {
        //
        //     let receivers = []
        //     for (let i = 0; i < 5; i++) {
        //         receivers.push(solvers[i].address)
        //     }
        //
        //     const result1 = await minterContract.connect(owner).batchFreeMint(receivers);
        //     const txn1 = await result1.wait()
        //     expect(txn1.blockNumber).to.be.greaterThan(0)
        //
        //     for (let i = 0; i < receivers.length; i++) {
        //         const balance = await catContract.balanceOf(receivers[i])
        //         if (balance == 0) {
        //             continue
        //         }
        //         const tokenId = await catContract.tokenOfOwnerByIndex(receivers[i], balance - 1)
        //         console.log("mint tokenId:", tokenId, ",owner:", receivers[i])
        //     }
        //
        // })

        // it("test free mint twice", async () => {
        //
        //     const result1 = await minterContract.connect(owner).freeMint(solvers[0].address);
        //     const txn1 = await result1.wait()
        //     expect(txn1.blockNumber).to.be.greaterThan(0)
        //
        //     const balance = await catContract.balanceOf(solvers[0].address)
        //     const tokenId = await catContract.tokenOfOwnerByIndex(solvers[0].address, balance - 1)
        //     console.log("mint tokenId:", tokenId)
        //
        //     console.log("mint twice:", tokenId)
        //     const result2 = await minterContract.connect(owner).freeMint(solvers[0].address);
        //     const txn2 = await result2.wait()
        //     expect(txn2.blockNumber).to.be.greaterThan(0)
        //
        //     const balance2 = await catContract.balanceOf(solvers[0].address)
        //     const tokenId2 = await catContract.tokenOfOwnerByIndex(solvers[0].address, balance2 - 1)
        //     console.log("mint tokenId:", tokenId2)
        // })
        //
        // it("test whitelist mint", async () => {
        //
        //     const result1 = await minterContract.connect(solvers[0]).whiteListMint();
        //     const txn1 = await result1.wait()
        //     expect(txn1.blockNumber).to.be.greaterThan(0)
        //
        //     const balance = await catContract.balanceOf(solvers[0].address)
        //     const tokenId = await catContract.tokenOfOwnerByIndex(solvers[0].address, balance - 1)
        //     console.log("mint tokenId:", tokenId)
        //
        // })
        //
        // it("test whitelist mint twice", async () => {
        //
        //     const result1 = await minterContract.connect(solvers[0]).whiteListMint();
        //     const txn1 = await result1.wait()
        //     expect(txn1.blockNumber).to.be.greaterThan(0)
        //
        //     const balance = await catContract.balanceOf(solvers[0].address)
        //     const tokenId = await catContract.tokenOfOwnerByIndex(solvers[0].address, balance - 1)
        //     console.log("mint tokenId:", tokenId)
        //
        //
        //     console.log("mint twice")
        //
        //     const result2 = await minterContract.connect(solvers[0]).whiteListMint();
        //     const txn2 = await result2.wait()
        //     expect(txn2.blockNumber).to.be.greaterThan(0)
        //
        //     const balance2 = await catContract.balanceOf(solvers[0].address)
        //     const tokenId2 = await catContract.tokenOfOwnerByIndex(solvers[0].address, balance2 - 1)
        //     console.log("mint tokenId:", tokenId2)
        // })
        //
        // it("test public price", async () => {
        //
        //     const result1 = await minterContract.publicMintPrice();
        //     console.log("public mint price:", result1)
        // })
        //
        // it("test public mint", async () => {
        //
        //     const result1 = await minterContract.connect(solvers[0]).publicMint();
        //     const txn1 = await result1.wait()
        //     expect(txn1.blockNumber).to.be.greaterThan(0)
        //
        //     const balance = await catContract.balanceOf(solvers[0].address)
        //     const tokenId = await catContract.tokenOfOwnerByIndex(solvers[0].address, balance - 1)
        //     console.log("mint tokenId:", tokenId)
        // })
        //
        // it("test public mint twice", async () => {
        //
        //     const result1 = await minterContract.connect(solvers[0]).publicMint();
        //     const txn1 = await result1.wait()
        //     expect(txn1.blockNumber).to.be.greaterThan(0)
        //
        //     const balance = await catContract.balanceOf(solvers[0].address)
        //     const tokenId = await catContract.tokenOfOwnerByIndex(solvers[0].address, balance - 1)
        //     console.log("mint tokenId:", tokenId)
        //
        //
        //     console.log("mint twice")
        //
        //     const result2 = await minterContract.connect(solvers[0]).publicMint();
        //     const txn2 = await result2.wait()
        //     expect(txn2.blockNumber).to.be.greaterThan(0)
        //
        //     const balance2 = await catContract.balanceOf(solvers[0].address)
        //     const tokenId2 = await catContract.tokenOfOwnerByIndex(solvers[0].address, balance2 - 1)
        //     console.log("mint tokenId:", tokenId2)
        // })
        //
        //
        // it("test upgrade", async () => {
        //
        //     const result1 = await minterContract.connect(owner).freeMint(owner.address);
        //     const txn1 = await result1.wait()
        //     expect(txn1.blockNumber).to.be.greaterThan(0)
        //
        //     const balance = await catContract.balanceOf(owner.address)
        //     const tokenId = await catContract.tokenOfOwnerByIndex(owner.address, balance - 1)
        //     console.log("mint tokenId:", tokenId)
        //
        //     const oldLevel = await catContract.level(tokenId)
        //     const oldLevelCount = await catContract.levelCount(oldLevel)
        //     console.log("old level:", oldLevel, ",old level count:", oldLevelCount)
        //
        //
        //     const result2 = await catContract.connect(owner).upgrade(tokenId)
        //     const txn2 = await result2.wait()
        //     expect(txn2.blockNumber).to.be.greaterThan(0)
        //
        //     const newLevel = await catContract.level(tokenId)
        //     const oldLevelCount2 = await catContract.levelCount(oldLevel)
        //     const newLevelCount = await catContract.levelCount(newLevel)
        //     console.log("old level:", oldLevel, ",old level count:", oldLevelCount2, ",new level:", newLevel, ",new level count:", newLevelCount)
        //
        // })

        it("test open transfer", async () => {

            const result1 = await minterContract.connect(owner).freeMint(solvers[0].address);
            const txn1 = await result1.wait()
            expect(txn1.blockNumber).to.be.greaterThan(0)

            const balance = await catContract.balanceOf(solvers[0].address)
            const tokenId = await catContract.tokenOfOwnerByIndex(solvers[0].address, balance - 1)
            console.log("mint tokenId:", tokenId)

            const result2 = await catContract.connect(owner).switchCanTransfer();
            const txn2 = await result2.wait()
            expect(txn2.blockNumber).to.be.greaterThan(0)

            // const canTransfer = await catContract.canTransfer();
            // console.log("can transfer:", canTransfer)

            const result3 = await catContract.connect(solvers[0]).transferFrom(solvers[0].address, solvers[1].address, tokenId)
            const txn3 = await result3.wait()
            expect(txn3.blockNumber).to.be.greaterThan(0)

            const balance2 = await catContract.balanceOf(solvers[1].address)
            const tokenId2 = await catContract.tokenOfOwnerByIndex(solvers[1].address, balance2 - 1)
            console.log("transfered tokenId:", tokenId2)


        })
    })

});
