import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";
import { VOTING_PERIOD, VOTING_DELAY } from "../helper-hardhat-config";

const deployGovernorContract: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log, get } = deployments;
  const { deployer } = await getNamedAccounts();
  log("deploying GovernorContract...");

  const governanceToken = await get("GovernanceToken");
  const timeLock = await get("TimeLock");

  const args = [
    governanceToken.address,
    timeLock.address,
    VOTING_DELAY,
    VOTING_PERIOD,
  ];

  const GovernorContract = await deploy("GovernerContract", {
    from: deployer,
    args: args,
    log: true,
  });

  log("Deployed Governance Token to address", GovernorContract.address);
};

export default deployGovernorContract;
