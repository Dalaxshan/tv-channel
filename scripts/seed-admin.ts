/**
 * Creates (or updates the password for) an admin user.
 *
 * Usage:
 *   ADMIN_EMAIL=admin@tvchannel.com ADMIN_PASSWORD=change-me-now npx tsx scripts/seed-admin.ts
 *
 * Or add ADMIN_EMAIL / ADMIN_PASSWORD / ADMIN_NAME to your .env.local and run:
 *   npx tsx --env-file=.env.local scripts/seed-admin.ts
 */
import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

async function main() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB_NAME || "tv_channel_admin";
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || "Administrator";

  if (!uri) throw new Error("Missing MONGODB_URI / MONGODB_URI environment variable");
  if (!email) throw new Error("Missing ADMIN_EMAIL environment variable");
  if (!password) throw new Error("Missing ADMIN_PASSWORD environment variable");
  if (password.length < 8) throw new Error("ADMIN_PASSWORD must be at least 8 characters");

  const client = new MongoClient(uri);
  await client.connect();

  try {
    const db = client.db(dbName);
    const admins = db.collection("admins");
    await admins.createIndex({ email: 1 }, { unique: true });

    const passwordHash = await bcrypt.hash(password, 12);
    const now = new Date();

    const result = await admins.updateOne(
      { email: email.toLowerCase() },
      {
        $set: { email: email.toLowerCase(), passwordHash, name, updatedAt: now },
        $setOnInsert: { createdAt: now },
      },
      { upsert: true }
    );

    if (result.upsertedCount > 0) {
      console.log(`✅ Created admin user: ${email}`);
    } else {
      console.log(`✅ Updated password for existing admin user: ${email}`);
    }
  } finally {
    await client.close();
  }
}

main().catch((err) => {
  console.error("❌ Failed to seed admin:", err.message);
  process.exit(1);
});
