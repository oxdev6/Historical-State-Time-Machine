import type { Log } from "ethers";
import type pg from "pg";
import type { DecodedEnsEvent } from "../decoder.js";
import { insertOwnershipHistory } from "../../db/ownershipHistory.js";

/**
 * Process ownership-related events (Transfer, NewOwner) and persist to ownership_history
 */
export async function processOwnershipEvent(
  client: pg.PoolClient,
  decoded: DecodedEnsEvent,
  log: Log,
): Promise<void> {
  // Only handle Transfer and NewOwner events from registry
  if (decoded.name !== "Transfer" && decoded.name !== "NewOwner") {
    return;
  }

  const node = decoded.args?.node;
  const owner = decoded.args?.owner;

  // Validate required fields
  if (typeof node !== "string" || typeof owner !== "string") {
    return;
  }

  await insertOwnershipHistory(client, {
    node,
    owner,
    blockNumber: Number(log.blockNumber),
    logIndex: log.index,
    txHash: log.transactionHash,
  });
}
