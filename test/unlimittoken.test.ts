import {expect} from "chai";
import {Contract} from "ethers";
import {ethers, waffle} from "hardhat";
import {UnlimitedToken} from "../ethereum-abi-types/UnlimitedToken";
import {CONTRACT_NAMES} from "../src/ts";
import {GameDataStorage} from "../ethereum-abi-types/GameDataStorage";

describe("ulimittoken", () => {
  const [deployer, owner, nonSolver, ...solvers] = waffle.provider.getWallets();
  let tokenContract: Contract;

  console.log("current deployer is ", deployer.address)
  console.log("current owner is ", owner.address)
  let gameContract: Contract;
  let gameDataContract: GameDataStorage, dataStorageContract;

  beforeEach(async () => {
    const tokenSolidity = await ethers.getContractFactory(
      "UnlimitedToken",
      deployer,
    );

    tokenContract = await tokenSolidity.deploy("QuizToken", "QZT");

    const dataSolidity = await ethers.getContractFactory(
      CONTRACT_NAMES.game_data,
      deployer,
    );

    const deployedGameStorage = await dataSolidity.deploy();

    gameDataContract = (deployedGameStorage as unknown) as GameDataStorage;

    const adminStorageSolidity = await ethers.getContractFactory(
      CONTRACT_NAMES.data_storage,
      deployer,
    );

    const adminStorageContract = await adminStorageSolidity.deploy()

    const gameSolidity = await ethers.getContractFactory(
      CONTRACT_NAMES.game,
      deployer,
    );

    gameContract = await gameSolidity.deploy(
      owner.address, adminStorageContract.address, deployedGameStorage.address, "0x8464135c8F25Da09e49BC8782676a84730C318bC", 100000000);

  });

  describe("check symbol", () => {
    it("symbol should be QZT", async () => {
      const contract = (tokenContract.connect(owner) as unknown) as UnlimitedToken
      expect(await contract.symbol()).to.equal("QZT")
    });
  });

  describe("check game operator", () => {
    it("add operator", async () => {
      const result = await gameDataContract.addOperator(gameContract.address)
      const txn = await result.wait()
      expect(txn.blockNumber).to.be.greaterThan(0)
    })

  })
});
