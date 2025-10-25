// src/config/env.ts
import dotenv from "dotenv";
dotenv.config();

const get = (k: string, fallback?: string) => {
  const v = process.env[k];
  if (v === undefined) return fallback;
  return v;
};

const env = {
  DATABASE_URL: get("DATABASE_URL", ""),
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(get("PORT", "4000")),
  JWT_SECRET: get("JWT_SECRET", "please-set-a-secret"),
  JWT_EXPIRES_IN: get("JWT_EXPIRES_IN", "7d"),
};

export default env;
