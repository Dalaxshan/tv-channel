import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

/** Hash a plain-text password for storage. Never store plain text. */
export async function hashPassword(plainPassword: string): Promise<string> {
  return bcrypt.hash(plainPassword, SALT_ROUNDS);
}

/** Compare a plain-text password against a stored bcrypt hash. */
export async function verifyPassword(
  plainPassword: string,
  passwordHash: string
): Promise<boolean> {
  return bcrypt.compare(plainPassword, passwordHash);
}
