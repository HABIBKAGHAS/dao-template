import { ethers, network } from "hardhat";
import {
  NEW_STORE_VALUE,
  FUNC,
  PROPOSAL_DESCRIPTION,
  developmentChains,
  VOTING_DELAY,
  proposalsFile,
} from "../helper-hardhat-config";
import { moveBlocks } from "../utils/move-blocks";
import * as fs from "fs";
export async function propose(
  args: any[],
  functionToCall: string,
  proposalDescription: string
) {
  const governor = await ethers.getContract("GovernerContract");
  const box = await ethers.getContract("Box");

  const encodedFunctionCall = box.interface.encodeFunctionData(
    functionToCall,
    args
  );

  console.log(`Proposing ${functionToCall} on ${box.address} with ${args}`);
  console.log(`Proposal Desc ${proposalDescription}`);

  const propseTX = await governor.propose(
    [box.address],
    [0],
    [encodedFunctionCall],
    proposalDescription
  );

  console.log("proposed");

  const proposeReciept = await propseTX.wait(1);

  if (developmentChains.includes(network.name)) {
    await moveBlocks(VOTING_DELAY + 1);
  }

  const proposalId = proposeReciept.events[0].args.proposalId;
  let proposals = JSON.parse(fs.readFileSync(proposalsFile, "utf-8"));
  proposals[network.config.chainId!.toString()].push(proposalId.toString());
  fs.writeFileSync(proposalsFile, JSON.stringify(proposals));
}

propose([NEW_STORE_VALUE], FUNC, PROPOSAL_DESCRIPTION)
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
