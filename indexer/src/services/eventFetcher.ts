import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { ethers } from "ethers";
import type { JsonRpcProvider, Log } from "ethers";
import { ENS_REGISTRY, ETH_REGISTRAR_CONTROLLER } from "../contracts.js";

const here = dirname(fileURLToPath(import.meta.url));

function loadEventFragments(filename: string): string[] {
  const raw = readFileSync(join(here, "..", "abis", filename), "utf8");
  return JSON.parse(raw) as string[];
}

const resolverIface = new ethers.Interface(loadEventFragments("resolver.json"));

const resolverEventNames = [
  "AddrChanged",
  "AddressChanged",
  "TextChanged",
  "ContenthashChanged",
  "NameChanged",
  "ABIChanged",
  "VersionChanged",
] as const;

export function resolverTopic0Filter(): string[] {
  return resolverEventNames
    .map((name) => resolverIface.getEvent(name)?.topicHash)
    .filter((t): t is string => Boolean(t));
}

export async function fetchRegistryLogs(
  provider: JsonRpcProvider,
  fromBlock: number,
  toBlock: number,
): Promise<Log[]> {
  return provider.getLogs({
    address: ENS_REGISTRY,
    fromBlock,
    toBlock,
  });
}

export async function fetchRegistrarLogs(
  provider: JsonRpcProvider,
  fromBlock: number,
  toBlock: number,
): Promise<Log[]> {
  return provider.getLogs({
    address: ETH_REGISTRAR_CONTROLLER,
    fromBlock,
    toBlock,
  });
}

export async function fetchResolverLogs(
  provider: JsonRpcProvider,
  fromBlock: number,
  toBlock: number,
): Promise<Log[]> {
  const topics = resolverTopic0Filter();
  return provider.getLogs({
    topics: [topics],
    fromBlock,
    toBlock,
  });
}

