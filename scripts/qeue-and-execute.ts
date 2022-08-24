import {
  MIN_DELAY,
  FUNC,
  NEW_STORE_VALUE,
  PROPOSAL_DESCRIPTION,
  developmentChains,
} from "../helper-hardhat-config";
import * as fs from "fs";
import { network, ethers } from "hardhat";
import { moveBlocks } from "../utils/move-blocks";
import { moveTime } from "../utils/move-time";

async function qeueAndExecute() {
  const args = [NEW_STORE_VALUE];
  const box = await ethers.getContract("Box");
  const encodedFunctionCall = box.interface.encodeFunctionData(FUNC, args);
  const descriptionHash = ethers.utils.keccak256(
    ethers.utils.toUtf8Bytes(PROPOSAL_DESCRIPTION)
  );

  const governor = await ethers.getContract("GovernerContract");
  console.log("queing...");
  const queueTx = await governor.queue(
    [box.address],
    [0],
    [encodedFunctionCall],
    descriptionHash
  );

  await queueTx.wait(1);

  if (developmentChains.includes(network.name)) {
    await moveTime(MIN_DELAY);
    await moveBlocks(1);
  }

  console.log("Executing...");
  const executingTx = await governor.execute(
    [box.address],
    [0],
    [encodedFunctionCall],
    descriptionHash
  );

  await executingTx.wait(1);

  const boxNewValue = await box.retrieve();
  console.log(`New Box Value: ${boxNewValue.toString()}`);
}

qeueAndExecute()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
