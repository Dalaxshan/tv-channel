import { MongoClient, Db, MongoClientOptions } from "mongodb";

/**
 * Native MongoDB driver connection utility.
 *
 * This is intentionally separate from `lib/mongodb.ts` (which powers the
 * legacy Mongoose-based public site) so the admin dashboard never depends on
 * an ORM. The client is cached on the Node.js global object so hot-reloads
 * in development and serverless invocations in production reuse a single
 * connection pool instead of opening a new one per request.
 */

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || "tv_channel_admin";

if (!MONGODB_URI) {
  throw new Error(
    "Missing MONGODB_URI environment variable. Add it to your .env.local file."
  );
}

const options: MongoClientOptions = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 8000,
  socketTimeoutMS: 20000,
};

type MongoCache = {
  client: MongoClient | null;
  promise: Promise<MongoClient> | null;
};

// Cache across hot reloads / lambda invocations.
const globalForMongo = global as unknown as { _mongoAdminCache?: MongoCache };

const cached: MongoCache = globalForMongo._mongoAdminCache ?? {
  client: null,
  promise: null,
};
globalForMongo._mongoAdminCache = cached;

async function getClient(): Promise<MongoClient> {
  if (cached.client) return cached.client;

  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) throw new Error("Missing MONGODB_URI environment variable.");

  if (!cached.promise) {
    const client = new MongoClient(MONGODB_URI, options);
    cached.promise = client.connect();
  }

  cached.client = await cached.promise;
  return cached.client;
}

/**
 * Returns a connected database handle. Reuses the pooled connection.
 */
export async function getDb(): Promise<Db> {
  const client = await getClient();
  return client.db(MONGODB_DB_NAME);
}

/**
 * Typed collection accessors — the single source of truth for collection
 * names so they can't drift between files.
 */
export const COLLECTIONS = {
  admins: "admins",
  heroes: "heroes",
  programs: "programs",
  teledramas: "teledramas",
  schedules: "schedules",
} as const;

/**
 * Ensures required indexes exist. Safe to call multiple times — MongoDB
 * no-ops if the index already exists with the same spec. Call this lazily
 * from API routes rather than at module load time so it doesn't run during
 * `next build`.
 */
let indexesEnsured = false;
export async function ensureIndexes(): Promise<void> {
  if (indexesEnsured) return;
  const db = await getDb();

  await Promise.all([
    db.collection(COLLECTIONS.admins).createIndex({ email: 1 }, { unique: true }),
    db.collection(COLLECTIONS.programs).createIndex({ slug: 1 }, { unique: true }),
    db.collection(COLLECTIONS.programs).createIndex({ createdAt: -1 }),
    db.collection(COLLECTIONS.teledramas).createIndex({ slug: 1 }, { unique: true }),
    db.collection(COLLECTIONS.heroes).createIndex({ createdAt: -1 }),
    db.collection(COLLECTIONS.teledramas).createIndex({ createdAt: -1 }),
    db.collection(COLLECTIONS.schedules).createIndex({ day: 1, time: 1 }),
  ]);

  indexesEnsured = true;
}
