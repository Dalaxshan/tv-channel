/**
 * Seeds the programs collection with the full weekly schedule.
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/seed-programs.ts
 */
import { MongoClient } from "mongodb";
import { programs } from "./programs.seed";

async function main() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB_NAME || "tv_channel_admin";

  if (!uri) throw new Error("Missing MONGODB_URI environment variable");

  const client = new MongoClient(uri);
  await client.connect();

  try {
    const db = client.db(dbName);
    const col = db.collection("programs");

    await col.createIndex({ slug: 1 }, { unique: true });
    await col.createIndex({ createdAt: -1 });

    let inserted = 0;
    let skipped = 0;

    for (const program of programs) {
      const result = await col.updateOne(
        { slug: program.slug },
        { $setOnInsert: program },
        { upsert: true }
      );
      if (result.upsertedCount > 0) inserted++;
      else skipped++;
    }

    console.log(`✅ Seeded programs: ${inserted} inserted, ${skipped} already existed.`);
  } finally {
    await client.close();
  }
}

main().catch((err) => {
  console.error("❌ Failed to seed programs:", err.message);
  process.exit(1);
});
