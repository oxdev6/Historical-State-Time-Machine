import type { Log } from "ethers";
import type pg from "pg";
import type { DecodedEnsEvent } from "./decoder.js";
import { insertEnsEvent } from "../db/ensEvents.js";
import { insertOwnershipHistory } from "../db/ownershipHistory.js";

function getNodeFromDecoded(decoded: DecodedEnsEvent): string | null {
  const node = decoded.args?.node;
  if (typeof node === "string") {
    return node;
  }
  return null;
}

export async function persistDecodedLog(
  client: pg.PoolClient,
  decoded: DecodedEnsEvent,
  log: Log,
  blockTimestamp: Date | null,
): Promise<void> {
  const node = getNodeFromDecoded(decoded);
  if (!node) {
    return;
  }

  await insertEnsEvent(client, {
    node,
    decoded,
    log,
    contractAddress: (log.address as string).toLowerCase(),
    blockNumber: Number(log.blockNumber),
    logIndex: log.index,
    txHash: log.transactionHash,
    blockTimestamp,
  });

  const owner = decoded.args?.owner;
  if (typeof owner === "string") {
    await insertOwnershipHistory(client, {
      node,
      owner,
      blockNumber: Number(log.blockNumber),
      logIndex: log.index,
      txHash: log.transactionHash,
    });
  }
}

