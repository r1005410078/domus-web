"use client";
import { nanoid } from "nanoid";

if (typeof window !== "undefined" && typeof crypto.randomUUID !== "function") {
  window.crypto.randomUUID = nanoid;
}
