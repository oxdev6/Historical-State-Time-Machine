import type pg from "pg";
import type { Log } from "ethers";
import type { DecodedEnsEvent } from "../services/decoder.js";

export async function insertEnsEvent(
  client: pg.PoolClient,
  params: {
    node: string;
    decoded: DecodedEnsEvent;
    log: Log;
    contractAddress: string;
    blockNumber: number;
    logIndex: number;
    txHash: string;
    blockTimestamp: Date | null;
  },
): Promise<void> {
  await client.query(
    `INSERT INTO ens_events (node, event_type, contract_address, block_number, log_index, tx_hash, data, block_timestamp)
     VALUES ($1,$2,$3,$4,$5,$6,$7::jsonb,$8)
     ON CONFLICT (tx_hash, log_index) DO NOTHING`,
    [
      params.node,
      params.decoded.name,
      params.contractAddress,
      params.blockNumber,
      params.logIndex,
      params.txHash,
      JSON.stringify(params.decoded.args ?? {}),
      params.blockTimestamp,
    ],
  );
}

