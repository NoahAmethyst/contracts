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
    const Web3 = require('web3');
    let web3 = new Web3(waffle.provider);
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
            "BcatProxyV3",
            owner,
        );

        cashierContract = await cashierSolidity.deploy();

        const catSolidity = await ethers.getContractFactory(
            "BCATV5",
            owner,
        );

        catContract = await catSolidity.deploy(
            "Tristan Community Activity Token", "TristanCAT", tokenUrlContract.address, "Tristan",
            BigNumber.from("5"), false, BigNumber.from("0"), BigNumber.from("20"),
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
            cashierContract.address,
            solvers[0].address,
            {value: ethers.utils.parseEther("1")}
        );

        await catContract.connect(owner).setPartner("0xDa97bF10cfb4527df7c565877FFEF4888d54d695")

        const canTransfer = await catContract.canTransfer()
        const maxSupply = await catContract.maxSupply()
        const maxLevel = await catContract.maxLevel()
        const freeMintCount = await catContract.freeMintCount()
        const ethBalance = await catContract.provider.getBalance("0xDa97bF10cfb4527df7c565877FFEF4888d54d695")
        console.log("canTransfer:%s maxSupply:%s maxLevel:%s freeMintCount:%s,operatorEth:%s", canTransfer, maxSupply, maxLevel, freeMintCount, ethBalance)

    });


    describe("cat mint", () => {
        // it("transfer when canTransfer is false", async () => {
        //
        //     await tokenContract.connect(owner).mint(solvers[1].address, 1000)
        //     await tokenContract.connect(solvers[1]).approve(catContract.address, 1000)
        //     console.log("set canTransfer false")
        //     const result = await catContract.connect(owner).setConfig(false, 0, 5, 20)
        //     const txn = await result.wait()
        //     expect(txn.blockNumber).to.be.greaterThan(0)
        //
        //     console.log("mint")
        //     const result1 = await catContract.connect(solvers[1]).publicMint({value: ethers.utils.parseEther("1")});
        //     const txn1 = await result1.wait()
        //     expect(txn1.blockNumber).to.be.greaterThan(0)
        //     console.log("mint success")
        //
        //     console.log("transfer")
        //     const result2 = await catContract.connect(solvers[1]).transferFrom(solvers[1].address, solvers[2].address, 1)
        //     const txn2 = await result2.wait()
        //     expect(txn2.blockNumber).to.be.greaterThan(0)
        //     console.log("transfer success")
        // })

        // it("public mint and withdraw", async () => {
        //
        //     await tokenContract.connect(owner).mint(solvers[0].address, 1000)
        //     await tokenContract.connect(solvers[0]).approve(catContract.address, 1000)
        //
        //     console.log("mint")
        //     const result1 = await catContract.connect(solvers[0]).publicMint({value: ethers.utils.parseEther("1")});
        //     const txn1 = await result1.wait()
        //     expect(txn1.blockNumber).to.be.greaterThan(0)
        //     console.log("mint success")
        //
        //     const balance = await catContract.balanceOf(solvers[0].address)
        //     const tokenId = await catContract.tokenOfOwnerByIndex(solvers[0].address, balance - 1)
        //     const tokenBalance = await tokenContract.balanceOf(solvers[0].address)
        //     const directorBalance = await tokenContract.balanceOf("0xDa97bF10cfb4527df7c565877FFEF4888d54d695")
        //     const catTokenBalance = await tokenContract.balanceOf(catContract.address)
        //     console.log("mint tokenId:", tokenId, " caller tokenBalance:", tokenBalance,
        //         " \ncatTokenBalance:", catTokenBalance, " director tokenBalance:", directorBalance)
        //
        //
        //     const catEthBalance = await catContract.provider.getBalance(catContract.address)
        //     const directorEthBalance = await owner.provider.getBalance("0xDa97bF10cfb4527df7c565877FFEF4888d54d695")
        //     console.log("cat eth:", catEthBalance, " director eth:", directorEthBalance)
        //
        //
        //     const ownerEth = await owner.provider.getBalance(owner.address)
        //     console.log("before withdraw owner eth:", ownerEth)
        //
        //
        //     const result2 = await catContract.connect(owner).withdraw(owner.address, tokenContract.address, 10)
        //     const txn2 = await result2.wait()
        //     expect(txn2.blockNumber).to.be.greaterThan(0)
        //     const result3 = await catContract.connect(owner).withdraw(owner.address, "0x0000000000000000000000000000000000000000", ethers.utils.parseEther("0.3"))
        //     const txn3 = await result3.wait()
        //     expect(txn3.blockNumber).to.be.greaterThan(0)
        //     const ownerTokenBalance = await tokenContract.balanceOf(owner.address)
        //     const ownerEthBalance = await owner.provider.getBalance(owner.address)
        //     console.log("owner token:", ownerTokenBalance, " owner eth:", ownerEthBalance)
        //
        //     const level1Count = await catContract.levelCount(1)
        //     console.log("lv1 count:", level1Count)
        // })


        // it("upgrade", async () => {
        //     await tokenContract.connect(owner).mint(solvers[0].address, 1000)
        //     await tokenContract.connect(solvers[0]).approve(catContract.address, 1000)
        //
        //     console.log("mint")
        //
        //     const result1 = await catContract.connect(solvers[0]).publicMint({value: ethers.utils.parseEther("1")});
        //     const txn1 = await result1.wait()
        //     expect(txn1.blockNumber).to.be.greaterThan(0)
        //     const balance = await catContract.balanceOf(solvers[0].address)
        //     const tokenId = await catContract.tokenOfOwnerByIndex(solvers[0].address, balance - 1)
        //     console.log("mint success,start upgrade")
        //
        //     for (let i = 0; i < 4; i++) {
        //         const result2 = await catContract.connect(solvers[0]).upgrade(tokenId, {value: ethers.utils.parseEther("2")});
        //         const txn2 = await result2.wait()
        //         expect(txn2.blockNumber).to.be.greaterThan(0)
        //     }
        //     console.log("upgrade success")
        //
        //     const level = await catContract.level(tokenId)
        //     const nowLevelCount = await catContract.levelCount(level)
        //     console.log("token level:%s,now level count:%s", level, nowLevelCount)
        //     const tokenBalance = await tokenContract.balanceOf(solvers[0].address)
        //     const directorBalance = await tokenContract.balanceOf("0xDa97bF10cfb4527df7c565877FFEF4888d54d695")
        //     const catTokenBalance = await tokenContract.balanceOf(catContract.address)
        //     const catEthBalance = await owner.provider.getBalance(catContract.address)
        //     const directorEthBalance = await owner.provider.getBalance("0xDa97bF10cfb4527df7c565877FFEF4888d54d695")
        //     console.log("caller tokenBalance:", tokenBalance, " catTokenBalance:", catTokenBalance, "  director tokenBalance:", directorBalance,
        //         "\ncatEth:", catEthBalance, "directorEth:", directorEthBalance)
        //
        //
        // })
        //
        // it("batch free mint", async () => {
        //
        //     const freeMintCount = await catContract.freeMintCount()
        //     console.log("free mint count:", freeMintCount)
        //     let receivers = []
        //     for (let i = 1; i < freeMintCount; i++) {
        //         receivers.push(solvers[i].address)
        //     }
        //
        //     const result = await catContract.connect(solvers[0]).batchFreeMint(receivers);
        //     const txn = await result.wait()
        //     expect(txn.blockNumber).to.be.greaterThan(0)
        //
        //     const freeMintProcess = await catContract.freeMintProcessCount()
        //     const level1Count = await catContract.levelCount(1)
        //
        //     console.log("free mint process count:", freeMintProcess, " level1Count:", level1Count)
        //
        //
        //     // const result1 = await catContract.connect(owner).freeMint(solvers[0].address);
        //     // const txn1 = await result1.wait()
        //     // expect(txn1.blockNumber).to.be.greaterThan(0)
        // })
        //
        it("batch public mint", async () => {
            let callData = web3.eth.abi.encodeFunctionCall({
                name: 'publicMint',
                type: 'function',
                inputs: []
            }, [])
            for (let i = 0; i < 10; i++) {
                await tokenContract.connect(owner).mint(solvers[i].address, 1000)
                await tokenContract.connect(solvers[i]).approve(catContract.address, 1000)
                // const result1 = await catContract.connect(solvers[i]).publicMint({value: ethers.utils.parseEther("1")});
                // const txn1 = await result1.wait()
                // expect(txn1.blockNumber).to.be.greaterThan(0)

                const result1 = await catContract.connect(solvers[i]).callMint(callData, {value: ethers.utils.parseEther("1")})
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

            const freeMintProcess = await catContract.freeMintProcessCount()
            const level1Count = await catContract.levelCount(1)

            console.log("free mint process count:", freeMintProcess, " level1Count:", level1Count)


            let callReturnData = web3.eth.abi.encodeFunctionCall({
                name: 'levelCount',
                type: 'function',
                inputs: [{
                    type: 'uint256',
                    name: '_level'
                }]
            }, ['1'])
            const levelCount = await catContract.callValue(callReturnData)
            console.log("levelCount:", web3.eth.abi.decodeParameter('uint256', levelCount.data))
        })


        // it("white list mint", async () => {
        //     const result1 = await catContract.connect(solvers[0]).whiteListMint('0x88d85b191225788d2976c34e16cd7bce1617095c11b42d7312262527beeaafdd309e77c35cd22557fcb0c03dd717f09c7d0a7ec9bd8ffa9c68de8e83db1d750e00');
        //     const txn1 = await result1.wait()
        //     expect(txn1.blockNumber).to.be.greaterThan(0)
        // })
        //
        //
        // it("set config", async () => {
        //     const result1 = await catContract.connect(owner).setConfig(true, 50000, 4, 100)
        //     const txn1 = await result1.wait()
        //     expect(txn1.blockNumber).to.be.greaterThan(0)
        //
        //     const canTransfer = await catContract.canTransfer()
        //     const maxSupply = await catContract.maxSupply()
        //     const maxLevel = await catContract.maxLevel()
        //     const freeMintCount = await catContract.freeMintCount()
        //     console.log("canTransfer:%s maxSupply:%s maxLevel:%s freeMintCount:%s", canTransfer, maxSupply, maxLevel, freeMintCount)
        // })
    })

});
