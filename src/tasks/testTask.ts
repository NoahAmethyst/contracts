import "hardhat-deploy";
import "@nomiclabs/hardhat-ethers";

import {subtask, task} from "hardhat/config";
import {HardhatRuntimeEnvironment} from "hardhat/types";

import {getDeployedContract} from "./ts/deployment";
import {getNamedSigner} from "./ts/signers";
import {getSolvers} from "./ts/solver";
import {transactionUrl} from "./ts/tui";
import {CONTRACT_NAMES} from "../ts";

const solversTaskList = ["add", "check", "remove", "list"] as const;
type SolversTasks = typeof solversTaskList[number];


interface Args {
    printTransaction: boolean;
}

async function testTask(args: Args, hre: HardhatRuntimeEnvironment) {
    console.log("test task")
    console.log(args)

    const contract = await hre.ethers.getContractAt(CONTRACT_NAMES.unlimittoken, "0xe2F843862BADa0E9965989C2bFC36fb64aC87aa6")
    // const contract = await getDeployedContract(
    //   CONTRACT_NAMES.unlimittoken,
    //   hre,
    // );


    if (args.printTransaction) {
        const data = contract.interface.encodeFunctionData("symbol", []);
        console.log(`transaction:`);
        console.log(`To:   ${contract.address}`);
        console.log(`Data: ${data}`);
    } else {
        const owner = await getNamedSigner(hre, "owner");
        const operation = await contract.connect(owner)
        const _owner = await operation.owner();
        console.log("contract owner ", _owner);
        // await contract.connect(owner).mint("0xA5Ba38f32404Bc3C2de4ff540718054a7d6ed2Cd", 100000);
        let balance = await operation.balanceOf("0xA5Ba38f32404Bc3C2de4ff540718054a7d6ed2Cd");
        console.log("balance ", balance)


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
