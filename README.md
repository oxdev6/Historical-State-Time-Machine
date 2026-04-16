# ENS Historical State Time Machine

**Historical indexing and reconstruction for [ENS](https://ens.domains/) names on Ethereum.**

This project is an open-source **infrastructure** tool: it ingests ENS-related chain events, stores them in a structured form, and (as the implementation grows) exposes **history**, **state at a block**, and **diffs** so developers and researchers can reason about how a name evolved over time—without manually combing explorers and raw logs.

---

## Why it exists

ENS state today is easy to read *at the tip*, but **hard to reconstruct over time**. Ownership, resolver wiring, and records change through events spread across the registry, resolvers, and registrars. This repository builds a **dedicated historical layer**: deterministic ingestion, queryable storage, and APIs intended for audits, research, and developer tooling.

---

## What we are building

| Area | Role |
|------|------|
| **Indexer** | Connect to Ethereum, fetch and decode ENS-related logs, normalize events |
| **Database (`db/`)** | PostgreSQL schema for events and derived tables (ownership, resolver, records, etc.) |
| **API** | REST endpoints for history, state-at-block, and comparisons |
| **Web** | Explorer UI: timelines and (later) richer views over the same data |

Design goals:

- **Incremental indexing** — safe to resume and extend
- **Deterministic processing** — same chain inputs produce the same stored outputs
- **Modular layout** — each package can evolve and ship independently

---

## Repository layout

```
├── indexer/     # Chain ingestion and decoding (worker / backfill)
├── api/         # HTTP API for historical queries
├── web/         # Next.js explorer (timeline and related UI)
├── db/          # SQL schema and migration assets
├── package.json # Root workspace metadata
└── pnpm-workspace.yaml
```

The monorepo uses **pnpm workspaces**. Application code, tooling, and CI will land incrementally as the packages mature.

---

## Status

The project is under **active development**. The roadmap follows a staged rollout: indexer and storage first, then reconstruction and API surfaces, then the explorer and an MVP release.

If you are reviewing this for **grants or public-goods programs**: the intent is neutral **ecosystem infrastructure**—transparent ENS history, not a paid analytics product.

---

## License

A license file will be added with the first release milestone; the working assumption is **MIT** unless the maintainers choose otherwise.
