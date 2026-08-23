import "server-only";

/**
 * Thin client for Cloudflare D1 over the REST query API.
 *
 * Talking to D1 over HTTP (rather than a Workers binding) keeps the app
 * host-agnostic: the same build runs on Vercel, Node or Cloudflare Workers.
 */

const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const DATABASE_ID = process.env.CLOUDFLARE_D1_DATABASE_ID;
const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;

export const d1Configured = Boolean(ACCOUNT_ID && DATABASE_ID && API_TOKEN);

interface D1Response<T> {
  success: boolean;
  errors: { code: number; message: string }[];
  result: { results: T[]; success: boolean; meta: Record<string, unknown> }[];
}

export async function d1Query<T = Record<string, unknown>>(
  sql: string,
  params: (string | number | null)[] = [],
): Promise<T[]> {
  if (!d1Configured) {
    throw new Error(
      "Cloudflare D1 is not configured. Set CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_D1_DATABASE_ID and CLOUDFLARE_API_TOKEN.",
    );
  }

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/d1/database/${DATABASE_ID}/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sql, params }),
      cache: "no-store",
    },
  );

  const payload = (await response.json()) as D1Response<T>;

  if (!response.ok || !payload.success) {
    const message =
      payload.errors?.map((e) => e.message).join("; ") ??
      `D1 request failed with status ${response.status}`;
    throw new Error(message);
  }

  return payload.result?.[0]?.results ?? [];
}
