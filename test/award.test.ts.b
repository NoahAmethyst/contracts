import {expect} from "chai";
import {BigNumber, Contract} from "ethers";
import {ethers, waffle} from "hardhat";
import {CONTRACT_NAMES} from "../src/ts";
import {GameDataStorage} from "../ethereum-abi-types/GameDataStorage";
import {getNamedSigner} from "../src/tasks/ts/signers";
import {string} from "hardhat/internal/core/params/argumentTypes";

describe("testAward", () => {
    const [deployer, owner, nonSolver, ...solvers] = waffle.provider.getWallets();
    let tokenContract: Contract;

    console.log("current deployer is ", deployer.address)
    console.log("current owner is ", owner.address)
    let awardDataContract: Contract, awardContract: Contract, adminDataContract: Contract;
    let nftContract: Contract

    beforeEach(async () => {
        const tokenSolidity = await ethers.getContractFactory(
            "UnlimitedToken",
            owner,
        );

        tokenContract = await tokenSolidity.deploy("QuizToken", "QZT");

        const nftSodility = await ethers.getContractFactory(
            CONTRACT_NAMES.nft_token,
            owner,
        );

        nftContract = await nftSodility.deploy();


        const adminStorageSolidity = await ethers.getContractFactory(
            CONTRACT_NAMES.data_storage,
            owner,
        );

        const adminDataContract = await adminStorageSolidity.deploy()


        const awardDataSolidity = await ethers.getContractFactory(
            CONTRACT_NAMES.award_data,
            owner,
        );

        awardDataContract = await awardDataSolidity.deploy();

        const awardSolidity = await ethers.getContractFactory(
            CONTRACT_NAMES.award,
            owner,
        );


        awardContract = await awardSolidity.deploy(
            owner.address,
            adminDataContract.address,
            awardDataContract.address);

        await nftContract
        await adminDataContract
        await awardDataContract
        await awardContract


        await awardDataContract.addOperator(awardContract.address);
        await tokenContract.connect(owner).mint(owner.address, 100000000000)
        await tokenContract.connect(owner).approve(awardContract.address, 100000000000)
        await nftContract.connect(owner).safeMint(owner.address, 1);
        await nftContract.connect(owner).approve(awardContract.address, 1);


    });


    describe("test award", () => {

        it("test award", async () => {

            let _appId = "test"
            let _id = 1
            let _preGas = 0
            let _pools = [[tokenContract.address, true, false, nftContract.address,
                100000000, [1]]]

            const result1 = await awardContract.connect(owner).createAwardPools(_appId, _id, _pools, _preGas,
                {value: ethers.utils.parseEther("0.0000001")});
            const txn1 = await result1.wait()
            expect(txn1.blockNumber).to.be.greaterThan(0)

            let awardInfo = await awardContract.getAwardPools(_id)
            console.log(awardInfo)


            console.log("execute award")
            let _receivers = [[
                solvers[0].address,solvers[1].address,solvers[2].address
            ]]
            let _amounts = [[
                10000, 10000, 10000
            ]]

            const result2 = await awardContract.connect(owner).executeAward(_appId, _id, _receivers, _amounts);
            const txn2 = await result2.wait()
            expect(txn2.blockNumber).to.be.greaterThan(0)


            let nftOwner = await nftContract.ownerOf(1);
            console.log("nft belong to ", nftOwner,"original owner is ",owner.address)

            console.log("get token amount",solvers[0].getBalance())

        })
    })

});
