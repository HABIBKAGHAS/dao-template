import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";
import { VOTING_PERIOD, VOTING_DELAY } from "../helper-hardhat-config";

const deployBox: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log, get } = deployments;
  const { deployer } = await getNamedAccounts();
  log("deploying Box...");

  const Box = await deploy("Box", {
    from: deployer,
    args: [],
    log: true,
  });

  log("Deployed Box to address", Box.address);

  const timeLock = await ethers.getContract("TimeLock");
  const boxContract = await ethers.getContractAt("Box", Box.address);

  const tranferOwnerTx = await boxContract.transferOwnership(timeLock.address);
  await tranferOwnerTx.wait(1);

  log("DONEEEEE");
};

export default deployBox;
