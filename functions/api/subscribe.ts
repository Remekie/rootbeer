/*
  POST /api/subscribe — captures a waitlist email into Cloudflare D1.

  Bind a D1 database as `DB` for the Pages project (see wrangler.toml, or
  Pages dashboard -> Settings -> Functions -> D1 database bindings).
  Table schema lives in db/schema.sql.

  Contract: accepts JSON { email, source?, company? }, returns JSON.
    201 { ok: true }              new signup stored
    200 { ok: true }              already on the list, or honeypot tripped
    422 { error }                 invalid email
    400 / 415 { error }           bad body / wrong content type
    503 { error }                 D1 not bound
    500 { error }                 unexpected storage failure
*/

// Minimal local typings so this compiles without @cloudflare/workers-types.
interface D1Result {
  success: boolean;
}
interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  run(): Promise<D1Result>;
}
interface D1Database {
  prepare(query: string): D1PreparedStatement;
}
interface Env {
  DB?: D1Database;
}
type RequestContext = { request: Request; env: Env };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LENGTH = 254; // RFC 5321 practical maximum

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

export const onRequestPost = async ({ request, env }: RequestContext): Promise<Response> => {
  const contentType = request.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    return json({ error: 'Send JSON.' }, 415);
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return json({ error: 'Invalid JSON.' }, 400);
  }

  const data = (payload ?? {}) as {
    email?: unknown;
    source?: unknown;
    company?: unknown;
  };

  // Honeypot: real users never fill the hidden "company" field. Accept without
  // storing so bots get a success and move on.
  if (typeof data.company === 'string' && data.company.trim() !== '') {
    return json({ ok: true });
  }

  const email = typeof data.email === 'string' ? data.email.trim().toLowerCase() : '';
  if (!email || email.length > MAX_EMAIL_LENGTH || !EMAIL.test(email)) {
    return json({ error: 'Please enter a valid email address.' }, 422);
  }

  const source =
    typeof data.source === 'string' && data.source.trim() !== ''
      ? data.source.trim().slice(0, 40)
      : null;

  if (!env.DB) {
    return json({ error: 'Signups are not configured yet.' }, 503);
  }

  try {
    await env.DB.prepare('INSERT INTO subscribers (email, source) VALUES (?, ?)')
      .bind(email, source)
      .run();
  } catch (err) {
    // A unique-constraint failure just means the address is already on the
    // list. Report success and never reveal whether it was already stored.
    const message = err instanceof Error ? err.message : '';
    if (/unique|constraint/i.test(message)) {
      return json({ ok: true });
    }
    return json({ error: 'Could not save your signup. Please try again.' }, 500);
  }

  return json({ ok: true }, 201);
};

// Any non-POST method.
export const onRequest = async (): Promise<Response> =>
  json({ error: 'Method not allowed.' }, 405);
