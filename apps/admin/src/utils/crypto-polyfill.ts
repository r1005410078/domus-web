"use client";
import { nanoid } from "nanoid";

if (
  typeof globalThis !== "undefined" &&
  typeof crypto.randomUUID !== "function"
) {
  globalThis.crypto.randomUUID = nanoid;
}
