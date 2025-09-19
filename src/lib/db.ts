import { getCloudflareContext } from "@opennextjs/cloudflare";

type D1Database = CloudflareEnv["DB"];

export class MissingDatabaseBindingError extends Error {
  constructor() {
    super("Cloudflare D1 binding `DB` is not configured");
    this.name = "MissingDatabaseBindingError";
  }
}

export async function getDb(): Promise<D1Database> {
  const context = await getCloudflareContext({ async: true });
  const db = context.env?.DB;

  if (!db) {
    throw new MissingDatabaseBindingError();
  }

  return db;
}

export async function withDb<T>(callback: (db: D1Database) => Promise<T>): Promise<T> {
  const db = await getDb();
  return callback(db);
}
