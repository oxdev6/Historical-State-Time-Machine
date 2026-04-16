-- ENS Historical State Time Machine — core schema
-- Stores raw decoded events plus derived projection tables used for
-- deterministic state reconstruction at any block height.

CREATE TABLE IF NOT EXISTS ens_events (
  id BIGSERIAL PRIMARY KEY,
  node TEXT NOT NULL,
  event_type TEXT NOT NULL,
  contract_address TEXT NOT NULL,
  block_number BIGINT NOT NULL,
  log_index INT NOT NULL,
  tx_hash TEXT NOT NULL,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  block_timestamp TIMESTAMPTZ,
  UNIQUE (tx_hash, log_index)
);

CREATE INDEX IF NOT EXISTS idx_ens_events_node_block
  ON ens_events (node, block_number, log_index);

CREATE INDEX IF NOT EXISTS idx_ens_events_type_block
  ON ens_events (event_type, block_number);

-- Optional: quick lookup for the human-readable name associated with a node.
CREATE TABLE IF NOT EXISTS ens_names (
  node TEXT PRIMARY KEY,
  name TEXT,
  parent_node TEXT,
  created_block BIGINT
);

-- Ownership history (owner / resolver control over time)
CREATE TABLE IF NOT EXISTS ownership_history (
  id BIGSERIAL PRIMARY KEY,
  node TEXT NOT NULL,
  owner TEXT NOT NULL,
  block_number BIGINT NOT NULL,
  log_index INT NOT NULL,
  tx_hash TEXT NOT NULL,
  UNIQUE (tx_hash, log_index, node)
);

CREATE INDEX IF NOT EXISTS idx_ownership_node_block
  ON ownership_history (node, block_number, log_index);

CREATE TABLE IF NOT EXISTS resolver_history (
  id BIGSERIAL PRIMARY KEY,
  node TEXT NOT NULL,
  resolver TEXT NOT NULL,
  block_number BIGINT NOT NULL,
  log_index INT NOT NULL,
  tx_hash TEXT NOT NULL,
  UNIQUE (tx_hash, log_index, node)
);

CREATE INDEX IF NOT EXISTS idx_resolver_node_block
  ON resolver_history (node, block_number, log_index);

-- Generic record changes (addr/text/contenthash/etc.) needed for state snapshots and diffs.
CREATE TABLE IF NOT EXISTS record_changes (
  id BIGSERIAL PRIMARY KEY,
  node TEXT NOT NULL,
  record_type TEXT NOT NULL,
  key TEXT,
  value TEXT,
  block_number BIGINT NOT NULL,
  log_index INT NOT NULL,
  tx_hash TEXT NOT NULL,
  data JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_record_changes_node_block
  ON record_changes (node, block_number, log_index);

-- Subname relationships (e.g., grants.uniswap.eth is a child of uniswap.eth)
CREATE TABLE IF NOT EXISTS subnames (
  id BIGSERIAL PRIMARY KEY,
  parent_node TEXT NOT NULL,
  label_hash TEXT NOT NULL,
  child_node TEXT NOT NULL,
  block_number BIGINT NOT NULL,
  log_index INT NOT NULL,
  tx_hash TEXT NOT NULL,
  UNIQUE (child_node, tx_hash, log_index)
);

CREATE INDEX IF NOT EXISTS idx_subnames_parent
  ON subnames (parent_node, block_number);

-- Indexer progress / cursors (used for resumable backfills)
CREATE TABLE IF NOT EXISTS indexer_state (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

