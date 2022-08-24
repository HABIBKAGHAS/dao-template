import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";
import { MIN_DELAY } from "../helper-hardhat-config";

const deployTimelock: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  log("deploying TimeLock...");
  const args = [MIN_DELAY, [], []];

  const Timelock = await deploy("TimeLock", {
    from: deployer,
    args: args,
    log: true,
  });

  log("Deployed Governance Token to address", Timelock.address);
};

export default deployTimelock;
