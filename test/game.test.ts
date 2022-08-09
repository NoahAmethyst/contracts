import {expect} from "chai";
import {BigNumber, Contract} from "ethers";
import {ethers, waffle} from "hardhat";
import {CONTRACT_NAMES} from "../src/ts";
import {GameDataStorage} from "../ethereum-abi-types/GameDataStorage";
import {getNamedSigner} from "../src/tasks/ts/signers";

describe("initGame", () => {
    const [deployer, owner, nonSolver, ...solvers] = waffle.provider.getWallets();
    let tokenContract: Contract;

    console.log("current deployer is ", deployer.address)
    console.log("current owner is ", owner.address)
    let gameContract: Contract, gameLogicContract: Contract;
    let gameDataContract: GameDataStorage, dataStorageContract;

    beforeEach(async () => {
        const tokenSolidity = await ethers.getContractFactory(
            "UnlimitedToken",
            owner,
        );

        tokenContract = await tokenSolidity.deploy("QuizToken", "QZT");

        const dataSolidity = await ethers.getContractFactory(
            CONTRACT_NAMES.game_data,
            owner,
        );

        const deployedGameStorage = await dataSolidity.deploy();

        gameDataContract = (deployedGameStorage as unknown) as GameDataStorage;

        const adminStorageSolidity = await ethers.getContractFactory(
            CONTRACT_NAMES.data_storage,
            owner,
        );

        const adminStorageContract = await adminStorageSolidity.deploy()


        const gameLogicSolidity = await ethers.getContractFactory(
            CONTRACT_NAMES.game_logic,
            owner,
        );

        gameLogicContract = await gameLogicSolidity.deploy(
            deployedGameStorage.address);

        const gameSolidity = await ethers.getContractFactory(
            CONTRACT_NAMES.game,
            owner,
        );

        gameContract = await gameSolidity.deploy(
            owner.address,
            adminStorageContract.address,
            deployedGameStorage.address,
            gameLogicContract.address,
            tokenContract.address, 100000000);

        await gameDataContract
        await gameContract
        await gameLogicContract


        await gameDataContract.addOperator(gameContract.address);
        await gameLogicContract.addOperator(gameContract.address)
        await tokenContract.connect(owner).addOperator(gameContract.address);


    });

    const gameId = 1;


    describe("test game", () => {

        // it("get operator", async () => {
        //     const result = await gameContract.operator();
        //     console.log("game operator", result)
        // })
        //
        // it("get logic", async () => {
        //     const result = await gameContract.gameLogic();
        //     console.log("game logic", result)
        // })
        //
        // it("check game logic operator", async () => {
        //     const result = await gameDataContract.operators(gameContract.address);
        //     console.log("game data operator is ", result)
        //     expect(result).equal(true)
        // })

        it("test game", async () => {
            let _game = [
                1, BigNumber.from(1), "test", BigNumber.from(1),
                BigNumber.from(1), "test", "test", "test",
                BigNumber.from(50), BigNumber.from(50), BigNumber.from(1), [BigNumber.from(1), BigNumber.from(1), BigNumber.from(1)],
                "test", ["test", "test"], false, "0x8464135c8F25Da09e49BC8782676a84730C318bC", ethers.utils.parseEther("1"),
                BigNumber.from(1), BigNumber.from(1), false, BigNumber.from(1),
                BigNumber.from(1), true, owner.address
            ];
            const result1 = await gameContract.connect(owner).createGame(_game);
            const txn1 = await result1.wait()
            expect(txn1.blockNumber).to.be.greaterThan(0)

            let game = await gameDataContract.getGame(gameId)
            console.log(game)


            console.log("start game")
            const result2 = await gameContract.connect(owner).startGame("test", gameId, new Date().getUTCSeconds(),
                {value: ethers.utils.parseEther("0.0000001")});
            const txn2 = await result2.wait()
            expect(txn2.blockNumber).to.be.greaterThan(0)


            console.log("mint token")
            for (let i = 0; i < 10; i++) {
                await tokenContract.connect(owner).mint(solvers[i].address, ethers.utils.parseEther("2"))
                await tokenContract.connect(solvers[i]).approve(gameContract.address, ethers.utils.parseEther("1"));
            }


            console.log("buy tickets")

            let round3 = await gameDataContract.getGameLatestRoundNum(gameId);

            for (let i = 0; i < 10; i++) {
                const result3 = await gameContract.connect(solvers[i]).buyTicket(gameId, round3,
                    {value: ethers.utils.parseEther("1")});
                const txn3 = await result3.wait()
                expect(txn3.blockNumber).to.be.greaterThan(0)
            }

            console.log("buy buff")

            for (let i = 0; i < 5; i++) {
                const result3 = await gameContract.connect(solvers[i]).buyBuff(gameId, round3, BigNumber.from(1));
                const txn3 = await result3.wait()
                expect(txn3.blockNumber).to.be.greaterThan(0)
            }


            console.log("game over")
            let round4 = await gameDataContract.getGameLatestRoundNum(gameId);
            const result4 = await gameContract.connect(owner).gameRoundOver("test", gameId, round4);
            const txn4 = await result4.wait()
            expect(txn4.blockNumber).to.be.greaterThan(0)

            let round5 = await gameDataContract.getGameLatestRoundNum(gameId);

            console.log("get game round")
            const result5 = await gameDataContract.getGameRound(gameId, round5);
            console.log(result5)

            let balance = await tokenContract.balanceOf(result5.winners[0])
            console.log(balance)


        })

        // it("start game", async () => {
        //     const result = await gameContract.connect(owner).startGame("test", gameId, new Date().getUTCSeconds(),
        //         {value: ethers.utils.parseEther("0.0000001")});
        //     const txn = await result.wait()
        //     expect(txn.blockNumber).to.be.greaterThan(0)
        // })
        //
        // it("buy ticket", async () => {
        //
        //     let round = await gameDataContract.getGameLatestRoundNum(gameId);
        //     const result = await gameContract.connect(owner).buyEthTicket(gameId, round,
        //         {value: ethers.utils.parseEther("1")});
        //     const txn = await result.wait()
        //     expect(txn.blockNumber).to.be.greaterThan(0)
        // })
        //
        // it("game over", async () => {
        //     let round = await gameDataContract.getGameLatestRoundNum(gameId);
        //     const result = await gameContract.connect(owner).gameRoundOver("test", gameId, round);
        //     const txn = await result.wait()
        //     expect(txn.blockNumber).to.be.greaterThan(0)
        // })
        //
        // it("get game round result", async () => {
        //     let round = await gameDataContract.getGameLatestRoundNum(gameId);
        //     const result = await gameDataContract.getGameRound(gameId, round);
        //     console.log(result)
        // })
    })

});
