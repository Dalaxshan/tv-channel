import { Db } from "mongodb";
import { COLLECTIONS } from "@/lib/db/mongodb";
import { slugify } from "@/lib/slugify";

export { slugify };

/**
 * Generates a slug guaranteed to be unique in the `teledramas` collection.
 * The backend is the source of truth - it re-derives the slug from the
 * title itself rather than trusting whatever the client sent, and appends
 * a numeric suffix (-2, -3, ...) if a collision is found.
 *
 * @param excludeId - when editing, exclude the document's own slug from the collision check.
 */
export async function generateUniqueSlug(
  db: Db,
  title: string,
  excludeId?: string
): Promise<string> {
  const base = slugify(title) || "teledrama";
  const collection = db.collection(COLLECTIONS.teledramas);

  let candidate = base;
  let suffix = 2;

  for (;;) {
    const query: Record<string, unknown> = { slug: candidate };
    if (excludeId) {
      const { ObjectId } = await import("mongodb");
      query._id = { $ne: new ObjectId(excludeId) };
    }
    const existing = await collection.findOne(query, { projection: { _id: 1 } });
    if (!existing) return candidate;
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
}
