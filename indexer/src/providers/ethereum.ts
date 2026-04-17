import "dotenv/config";
import { ethers } from "ethers";

export function createProvider(): ethers.JsonRpcProvider {
  const url = process.env.RPC_URL;
  if (!url) {
    throw new Error("RPC_URL is required");
  }
  return new ethers.JsonRpcProvider(url);
}

