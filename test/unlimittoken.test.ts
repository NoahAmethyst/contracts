import { expect } from "chai";
import { Contract } from "ethers";
import { ethers, waffle } from "hardhat";

import { AllowListReader } from "../src/ts/reader";
import symbols = Mocha.reporters.Base.symbols;

describe("ulimittoken", () => {
  const [deployer, owner, nonSolver, ...solvers] = waffle.provider.getWallets();
  let tokenContract: Contract;

  console.log("current deployer is ", deployer.address)
  console.log("current owner is ", owner.address)

  beforeEach(async () => {
    const tokenSolidity = await ethers.getContractFactory(
      "UnlimitedToken",
      deployer,
    );

    tokenContract = await tokenSolidity.deploy("QuizToken", "QZT");
  });

  describe("check symbol", () => {
    it("symbol should be QZT", async () => {
      expect(await tokenContract.connect(owner).symbol()).to.equal("QZT")
    });
  });
});
