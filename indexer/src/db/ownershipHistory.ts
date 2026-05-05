import type pg from "pg";

export async function insertOwnershipHistory(
  client: pg.PoolClient,
  params: {
    node: string;
    owner: string;
    blockNumber: number;
    logIndex: number;
    txHash: string;
  },
): Promise<void> {
  await client.query(
    `INSERT INTO ownership_history (node, owner, block_number, log_index, tx_hash)
     VALUES ($1,$2,$3,$4,$5)
     ON CONFLICT (tx_hash, log_index, node) DO NOTHING`,
    [params.node, params.owner.toLowerCase(), params.blockNumber, params.logIndex, params.txHash],
  );
}
