import "hardhat-deploy";
import "@nomiclabs/hardhat-ethers";

import { subtask, task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";

import { getDeployedContract } from "./ts/deployment";
import { getNamedSigner } from "./ts/signers";
import { getSolvers } from "./ts/solver";
import { transactionUrl } from "./ts/tui";
import {CONTRACT_NAMES} from "../ts";

const solversTaskList = ["add", "check", "remove", "list"] as const;
type SolversTasks = typeof solversTaskList[number];

interface Args {
  printTransaction: boolean;
}

async function testTask(args: Args, hre: HardhatRuntimeEnvironment) {
  console.log(args)

  const contract = await hre.ethers.getContractAt(CONTRACT_NAMES.unlimittoken, "0x9ac80cd6f9c2aa3F1b1A9345c978e781b2B1D288")
  // const contract = await getDeployedContract(
  //   CONTRACT_NAMES.unlimittoken,
  //   hre,
  // );

  //
  if (args.printTransaction) {
    const data = contract.interface.encodeFunctionData("symbol", []);
    console.log(`transaction:`);
    console.log(`To:   ${contract.address}`);
    console.log(`Data: ${data}`);
  } else {
    const owner = await getNamedSigner(hre, "manager");
    const tx = await contract.connect(owner).symbol();
    console.log(transactionUrl(hre, tx));
    await tx.wait();
  }
}

const isSolver = async (solver: string, hre: HardhatRuntimeEnvironment) => {
  const authenticator = await getDeployedContract(
    CONTRACT_NAMES.unlimittoken,
    hre,
  );

  console.log(
    `${solver} is ${
      (await authenticator.isSolver(solver)) ? "" : "NOT "
    }a solver.`,
  );
};

export const setupTasks: () => void = () => {
  task("test", "this is a test task")
    .addOptionalParam(
      "param",
      `this is a positional param`,
    )
    .addOptionalParam(
      "printTransaction",
      `this is a positional param`,
    )
    .setAction(testTask);
};
