/**
 * Creates or updates a CRM user.
 *
 *   npm run crm:user
 *
 * The password is typed here by you and never leaves this machine except as a
 * scrypt hash. Nobody else, including this script's author, sees it.
 */
import { createInterface } from "node:readline/promises";
import { randomBytes, randomUUID, scryptSync } from "node:crypto";
import { stdin, stdout } from "node:process";
import { readFileSync } from "node:fs";

for (const line of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
  const match = /^([A-Z0-9_]+)=(.*)$/.exec(line.trim());
  if (match && !process.env[match[1]]) process.env[match[1]] = match[2];
}

const ROLES = [
  "Super Administrator",
  "Leasing Manager",
  "Leasing Agent",
  "Marketing Manager",
  "Viewer",
];

const rl = createInterface({ input: stdin, output: stdout });

async function hidden(question) {
  stdout.write(question);
  stdin.setRawMode?.(true);
  let value = "";
  for await (const chunk of stdin) {
    const char = chunk.toString();
    if (char === "\r" || char === "\n") break;
    if (char === "\u0003") process.exit(1);
    if (char === "\u007f") { value = value.slice(0, -1); continue; }
    value += char;
  }
  stdin.setRawMode?.(false);
  stdout.write("\n");
  return value;
}

async function query(sql, params = []) {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/d1/database/${process.env.CLOUDFLARE_D1_DATABASE_ID}/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sql, params }),
    },
  );
  const payload = await response.json();
  if (!payload.success) throw new Error(JSON.stringify(payload.errors));
  return payload.result?.[0]?.results ?? [];
}

const name = (await rl.question("Full name: ")).trim();
const email = (await rl.question("Email: ")).trim().toLowerCase();

console.log("\nRoles:");
ROLES.forEach((role, index) => console.log(`  ${index + 1}. ${role}`));
const choice = Number(await rl.question("Role number: "));
const role = ROLES[choice - 1];

if (!name || !email || !role) {
  console.error("\nName, email and a valid role number are required.");
  process.exit(1);
}

rl.pause();
const password = await hidden("Password (min 12 characters): ");
const confirm = await hidden("Confirm password: ");

if (password.length < 12) {
  console.error("Password must be at least 12 characters.");
  process.exit(1);
}
if (password !== confirm) {
  console.error("Passwords do not match.");
  process.exit(1);
}

const salt = randomBytes(16).toString("hex");
const hash = scryptSync(password, salt, 64).toString("hex");

const existing = await query("SELECT id FROM users WHERE lower(email) = ?1", [email]);

if (existing.length > 0) {
  await query(
    "UPDATE users SET name = ?1, role = ?2, password_hash = ?3, password_salt = ?4, active = 1 WHERE id = ?5",
    [name, role, hash, salt, existing[0].id],
  );
  console.log(`\nUpdated ${email} (${role}).`);
} else {
  await query(
    "INSERT INTO users (id, created_at, email, name, role, password_hash, password_salt, active) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, 1)",
    [randomUUID(), new Date().toISOString(), email, name, role, hash, salt],
  );
  console.log(`\nCreated ${email} (${role}). Sign in at /crm/login`);
}

rl.close();
process.exit(0);
