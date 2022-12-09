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

describe("testBcat", () => {
    const [deployer, owner, nonSolver, ...solvers] = waffle.provider.getWallets();
    let tokenUrlContract: Contract;


    console.log("current deployer is ", deployer.address)
    console.log("current owner is ", owner.address)
    let catContract: Contract;
    let minterContract: Contract
    let cashierContract: Contract
    let tokenContract: Contract


    beforeEach(async () => {
        const tokenUrlSolidity = await ethers.getContractFactory(
            "Tokenuri",
            owner,
        );

        tokenUrlContract = await tokenUrlSolidity.deploy("https://test");

        /**

         const catSolidity = await ethers.getContractFactory(
         "BCAT",
         owner,
         );

         const catMinterSolidity = await ethers.getContractFactory(
         "BCatMinter",
         owner,
         );


         let cost = [true, "0x0000000000000000000000000000000000000000", BigNumber.from("1")]
         let mintPrices = [cost]
         let upgradePrices = [[cost], [cost]]

         console.log("deploy upgradable bcat")

         const catDeployProxy = await upgrades.deployProxy(catSolidity,
         [
         "Tristan Community Activity Token", "TristanCAT", tokenUrlContract.address, "Tristan",
         BigNumber.from("100000000"), BigNumber.from("5"), true, deployer.address
         ],
         {
                initializer: "initialize",
                kind: "uups"
            });
         catContract = await catDeployProxy.deployed();

         console.log("deploy cat success")


         console.log("deploy upgradable bcat minter")


         const minterDeployProxy = await upgrades.deployProxy(catMinterSolidity,
         [BigNumber.from(100), [[]], owner.address, catContract.address],
         {
                initializer: "initialize",
                kind: "uups"
            });
         minterContract = await minterDeployProxy.deployed();

         console.log("deploy upgradable minter success")
         */

        const tokenSolidity = await ethers.getContractFactory(
            "UnlimitedToken",
            owner,
        );

        tokenContract = await tokenSolidity.deploy("TestT", "TT");

        const cashierSolidity = await ethers.getContractFactory(
            "Cashier",
            owner,
        );

        cashierContract = await cashierSolidity.deploy();

        const catSolidity = await ethers.getContractFactory(
            "BCATV3",
            owner,
        );

        catContract = await catSolidity.deploy(
            "Tristan Community Activity Token", "TristanCAT", tokenUrlContract.address, "Tristan",
            BigNumber.from("5"), true, BigNumber.from("100000000"), BigNumber.from("20"),
            [
                [
                    [tokenContract.address, BigNumber.from("100")],
                    ["0x0000000000000000000000000000000000000000", ethers.utils.parseEther("1")],
                ],
                [
                    [tokenContract.address, BigNumber.from("200")],
                    ["0x0000000000000000000000000000000000000000", ethers.utils.parseEther("2")]
                ]
            ],
            cashierContract.address
        );
    });


    describe("test cat mint", () => {


        // it("test free mint", async () => {
        //
        //     // const result1 = await minterContract.connect(owner).freeMint(solvers[0].address);
        //     // const txn1 = await result1.wait()
        //     // expect(txn1.blockNumber).to.be.greaterThan(0)
        //     //
        //     // const balance = await catContract.balanceOf(solvers[0].address)
        //     // const tokenId = await catContract.tokenOfOwnerByIndex(solvers[0].address, balance - 1)
        //     // console.log("mint tokenId:", tokenId)
        // })

        it("public mint and withdraw", async () => {

            await tokenContract.connect(owner).mint(solvers[0].address, 1000)
            await tokenContract.connect(solvers[0]).approve(catContract.address, 1000)

            console.log("mint")
            const result1 = await catContract.connect(solvers[0]).publicMint({value: ethers.utils.parseEther("1")});
            const txn1 = await result1.wait()
            expect(txn1.blockNumber).to.be.greaterThan(0)
            console.log("mint success")

            const balance = await catContract.balanceOf(solvers[0].address)
            const tokenId = await catContract.tokenOfOwnerByIndex(solvers[0].address, balance - 1)
            const tokenBalance = await tokenContract.balanceOf(solvers[0].address)
            const directorBalance = await tokenContract.balanceOf("0xDa97bF10cfb4527df7c565877FFEF4888d54d695")
            const catTokenBalance = await tokenContract.balanceOf(catContract.address)
            console.log("mint tokenId:", tokenId, " caller tokenBalance:", tokenBalance,
                " \ncatTokenBalance:", catTokenBalance, " director tokenBalance:", directorBalance)
            const receiveTokens = await catContract.getAssets()
            console.log("cat receive tokens:", receiveTokens)

            const catEthBalance = await catContract.provider.getBalance(catContract.address)
            const directorEthBalance = await owner.provider.getBalance("0xDa97bF10cfb4527df7c565877FFEF4888d54d695")
            console.log("cat eth:", catEthBalance, " director eth:", directorEthBalance)


            const ownerEth = await owner.provider.getBalance(owner.address)
            console.log("before withdraw owner eth:", ownerEth)


            const result2 = await catContract.connect(owner).withdraw(owner.address, tokenContract.address, 10)
            const txn2 = await result2.wait()
            expect(txn2.blockNumber).to.be.greaterThan(0)
            const result3 = await catContract.connect(owner).withdraw(owner.address, "0x0000000000000000000000000000000000000000", ethers.utils.parseEther("0.3"))
            const txn3 = await result3.wait()
            expect(txn3.blockNumber).to.be.greaterThan(0)
            const ownerTokenBalance = await tokenContract.balanceOf(owner.address)
            const ownerEthBalance = await owner.provider.getBalance(owner.address)
            console.log("owner token:", ownerTokenBalance, " owner eth:", ownerEthBalance)


        })


        it("upgrade", async () => {
            await tokenContract.connect(owner).mint(solvers[0].address, 1000)
            await tokenContract.connect(solvers[0]).approve(catContract.address, 1000)

            console.log("mint")

            const result1 = await catContract.connect(solvers[0]).publicMint({value: ethers.utils.parseEther("1")});
            const txn1 = await result1.wait()
            expect(txn1.blockNumber).to.be.greaterThan(0)
            const balance = await catContract.balanceOf(solvers[0].address)
            const tokenId = await catContract.tokenOfOwnerByIndex(solvers[0].address, balance - 1)
            console.log("mint success,start upgrade")

            const result2 = await catContract.connect(solvers[0]).upgrade(tokenId, {value: ethers.utils.parseEther("2")});
            const txn2 = await result2.wait()
            expect(txn2.blockNumber).to.be.greaterThan(0)
            console.log("upgrade success")

            const level = await catContract.level(tokenId)
            console.log("token level:", level)
            const tokenBalance = await tokenContract.balanceOf(solvers[0].address)
            const directorBalance = await tokenContract.balanceOf("0xDa97bF10cfb4527df7c565877FFEF4888d54d695")
            const catTokenBalance = await tokenContract.balanceOf(catContract.address)
            const catEthBalance = await owner.provider.getBalance(catContract.address)
            const directorEthBalance = await owner.provider.getBalance("0xDa97bF10cfb4527df7c565877FFEF4888d54d695")
            console.log("caller tokenBalance:", tokenBalance, " catTokenBalance:", catTokenBalance, "  director tokenBalance:", directorBalance,
                "\ncatEth:", catEthBalance, "directorEth:", directorEthBalance)
            const receiveTokens = await catContract.getAssets()
            console.log("cat receive tokens:", receiveTokens)


        })

        it("batch free mint", async () => {

            const freeMintCount = await catContract.freeMintCount()
            console.log("free mint count:", freeMintCount)
            for (let i = 0; i < freeMintCount; i++) {
                const result = await catContract.connect(owner).freeMint(solvers[i].address);
                const txn = await result.wait()
                expect(txn.blockNumber).to.be.greaterThan(0)
                const balance = await catContract.balanceOf(solvers[i].address)
                const tokenId = await catContract.tokenOfOwnerByIndex(solvers[i].address, balance - 1)
                console.log("process:", i, " mint tokenId:", tokenId)
            }

            const freeMintProcess = await catContract.freeMintProcessCount()

            console.log("free mint process count:", freeMintProcess)


            // const result1 = await catContract.connect(owner).freeMint(solvers[0].address);
            // const txn1 = await result1.wait()
            // expect(txn1.blockNumber).to.be.greaterThan(0)
        })
        //
        it("batch public mint", async () => {

            for (let i = 0; i < 100; i++) {
                await tokenContract.connect(owner).mint(solvers[i].address, 1000)
                await tokenContract.connect(solvers[i]).approve(catContract.address, 1000)
                const result1 = await catContract.connect(solvers[i]).publicMint({value: ethers.utils.parseEther("1")});
                const txn1 = await result1.wait()
                expect(txn1.blockNumber).to.be.greaterThan(0)
                const balance = await catContract.balanceOf(solvers[i].address)
                const tokenId = await catContract.tokenOfOwnerByIndex(solvers[i].address, balance - 1)
                console.log(" mint tokenId:", tokenId)
            }

            const directorBalance = await tokenContract.balanceOf("0xDa97bF10cfb4527df7c565877FFEF4888d54d695")
            const catTokenBalance = await tokenContract.balanceOf(catContract.address)
            const catEthBalance = await owner.provider.getBalance(catContract.address)
            const directorEthBalance = await owner.provider.getBalance("0xDa97bF10cfb4527df7c565877FFEF4888d54d695")
            console.log(" catTokenBalance:", catTokenBalance, "  director tokenBalance:", directorBalance,
                "\ncatEth:", catEthBalance, "directorEth:", directorEthBalance)
            const receiveTokens = await catContract.getAssets()
            console.log("cat receive tokens:", receiveTokens)
        })
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

        // it("test open transfer", async () => {
        //
        //     const result1 = await minterContract.connect(owner).freeMint(solvers[0].address);
        //     const txn1 = await result1.wait()
        //     expect(txn1.blockNumber).to.be.greaterThan(0)
        //
        //     const balance = await catContract.balanceOf(solvers[0].address)
        //     const tokenId = await catContract.tokenOfOwnerByIndex(solvers[0].address, balance - 1)
        //     console.log("mint tokenId:", tokenId)
        //
        //     const result2 = await catContract.connect(owner).switchCanTransfer();
        //     const txn2 = await result2.wait()
        //     expect(txn2.blockNumber).to.be.greaterThan(0)
        //
        //     // const canTransfer = await catContract.canTransfer();
        //     // console.log("can transfer:", canTransfer)
        //
        //     const result3 = await catContract.connect(solvers[0]).transferFrom(solvers[0].address, solvers[1].address, tokenId)
        //     const txn3 = await result3.wait()
        //     expect(txn3.blockNumber).to.be.greaterThan(0)
        //
        //     const balance2 = await catContract.balanceOf(solvers[1].address)
        //     const tokenId2 = await catContract.tokenOfOwnerByIndex(solvers[1].address, balance2 - 1)
        //     console.log("transfered tokenId:", tokenId2)
        //
        //
        // })
    })

});
