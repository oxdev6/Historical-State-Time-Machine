import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { ethers } from "ethers";
import type { Log } from "ethers";

const here = dirname(fileURLToPath(import.meta.url));

function loadInterface(filename: string): ethers.Interface {
  const raw = readFileSync(join(here, "..", "abis", filename), "utf8");
  return new ethers.Interface(JSON.parse(raw) as string[]);
}

export const registryInterface = loadInterface("registry.json");
export const registrarInterface = loadInterface("registrar.json");
export const resolverInterface = loadInterface("resolver.json");

export type DecodedEnsEvent = {
  name: string;
  args: Record<string, unknown>;
};

export function decodeEnsLog(log: Log): DecodedEnsEvent | null {
  const candidates = [registryInterface, registrarInterface, resolverInterface];

  for (const iface of candidates) {
    try {
      const parsed = iface.parseLog({
        topics: log.topics as string[],
        data: log.data,
      });
      if (!parsed) {
        continue;
      }
      return { name: parsed.name, args: parsed.args as unknown as Record<string, unknown> };
    } catch {
      // try next interface
    }
  }

  return null;
}

