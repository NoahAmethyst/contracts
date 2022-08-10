import {ethers} from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log(await ethers.provider.getGasPrice())

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const Token = await ethers.getContractFactory("UnlimitedToken");

  const token = await Token.deploy("QuizToken", "QZT");

  console.log("Token address:", token.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
