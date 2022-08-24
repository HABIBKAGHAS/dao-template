import {
  developmentChains,
  proposalsFile,
  VOTING_PERIOD,
} from "../helper-hardhat-config";
import * as fs from "fs";
import { network, ethers } from "hardhat";
import { moveBlocks } from "../utils/move-blocks";
const index = 0;
async function main(proposalIndex: number) {
  const proposals = JSON.parse(fs.readFileSync(proposalsFile, "utf-8"));
  const proposalId = proposals[network.config.chainId!][proposalIndex];

  const voteWay = 1;
  const governor = await ethers.getContract("GovernerContract");
  const reason = "cz Hello world !!";
  const voteTxResponse = await governor.castVoteWithReason(
    proposalId,
    voteWay,
    reason
  );
  await voteTxResponse.wait(1);
  if (developmentChains.includes(network.name)) {
    await moveBlocks(VOTING_PERIOD + 1);
  }

  console.log("Voted !!");

  if (developmentChains.includes(network.name)) {
    await moveBlocks(VOTING_DELAY + 1);
  }
}

main(index)
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
