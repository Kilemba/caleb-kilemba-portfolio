import { readFileSync } from "node:fs";

type PgSslConfig = false | { ca?: string; rejectUnauthorized: boolean };

type PgPoolTuning = {
  /** Fail fast instead of hanging a page render when the host is unreachable. */
  connectionTimeoutMillis: number;
  /** Recycle idle sockets before a NAT/firewall silently drops them. */
  idleTimeoutMillis: number;
  /** TCP keepalive stops long-lived idle connections going stale. */
  keepAlive: boolean;
  max: number;
};

const POOL_TUNING: PgPoolTuning = {
  connectionTimeoutMillis: 10_000,
  idleTimeoutMillis: 30_000,
  keepAlive: true,
  max: 10
};

/**
 * Builds the connection options shared by every PrismaPg adapter in the project.
 *
 * `pg-connection-string` currently treats `sslmode=require` as `verify-full`, so managed
 * providers that serve a self-signed CA chain (Aiven, Heroku, Supabase) fail with
 * "self-signed certificate in certificate chain". Values parsed out of the connection
 * string also override any `ssl` option passed next to it, so the mode is stripped from
 * the URL here and the TLS settings are supplied explicitly instead.
 *
 * Set DATABASE_CA_CERT (inline PEM) or DATABASE_CA_CERT_PATH to verify the chain properly.
 */
export function pgConnectionConfig(): { connectionString: string; ssl?: PgSslConfig } & PgPoolTuning {
  const raw = process.env.DATABASE_URL;
  if (!raw) {
    throw new Error("DATABASE_URL is not configured.");
  }

  const url = new URL(raw);
  const sslmode = url.searchParams.get("sslmode");
  url.searchParams.delete("sslmode");
  url.searchParams.delete("sslrootcert");
  const connectionString = url.toString();

  // No mode requested: leave TLS to pg's own defaults (plain local databases).
  if (!sslmode) return { connectionString, ...POOL_TUNING };
  if (sslmode === "disable") return { connectionString, ssl: false, ...POOL_TUNING };

  const ca = readCaCertificate();
  return {
    connectionString,
    ssl: ca ? { ca, rejectUnauthorized: true } : { rejectUnauthorized: false },
    ...POOL_TUNING
  };
}

/** Env vars carry PEM blocks with escaped newlines, so those are restored here. */
function readCaCertificate(): string | undefined {
  const inline = process.env.DATABASE_CA_CERT;
  if (inline) return inline.replace(/\\n/g, "\n");

  const path = process.env.DATABASE_CA_CERT_PATH;
  return path ? readFileSync(path, "utf8") : undefined;
}
