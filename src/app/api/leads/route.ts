import { NextRequest, NextResponse } from "next/server";

import { MissingDatabaseBindingError, withDb } from "@/lib/db";

type LeadPayload = {
  name: string;
  company: string;
  email: string;
  budgetRange: string;
  message: string;
};

const EMAIL_REGEX = /.+@.+\..+/i;

export async function GET() {
  try {
    const leads = await withDb(async (db) => {
      const { results } = await db
        .prepare(
          "SELECT id, name, company, email, budget_range as budgetRange, message, created_at as createdAt FROM leads ORDER BY datetime(created_at) DESC LIMIT 50"
        )
        .all();

      return (results ?? []) as Array<Record<string, unknown>>;
    });

    return NextResponse.json({ leads });
  } catch (error) {
    return mapErrorToResponse(error);
  }
}

export async function POST(request: NextRequest) {
  let payload: LeadPayload;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON payload" },
      { status: 400 }
    );
  }

  const lead = normalizePayload(payload);
  const validationError = validatePayload(lead);

  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 422 });
  }

  try {
    await withDb(async (db) => {
      await db
        .prepare(
          `INSERT INTO leads (name, company, email, budget_range, message) VALUES (?, ?, ?, ?, ?)`
        )
        .bind(lead.name, lead.company, lead.email, lead.budgetRange, lead.message)
        .run();
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    return mapErrorToResponse(error);
  }
}

function normalizePayload(payload: LeadPayload) {
  return {
    name: (payload.name ?? "").trim(),
    company: (payload.company ?? "").trim(),
    email: (payload.email ?? "").trim(),
    budgetRange: (payload.budgetRange ?? "").trim(),
    message: (payload.message ?? "").trim(),
  } satisfies LeadPayload;
}

function validatePayload(payload: LeadPayload): string | null {
  if (!payload.email) {
    return "Email is required.";
  }

  if (!EMAIL_REGEX.test(payload.email)) {
    return "Enter a valid email address.";
  }

  if (payload.message.length > 2000) {
    return "Message is too long.";
  }

  return null;
}

function mapErrorToResponse(error: unknown) {
  if (error instanceof MissingDatabaseBindingError) {
    return NextResponse.json(
      { error: "Database binding missing. Configure Cloudflare D1 to enable lead capture." },
      { status: 503 }
    );
  }

  console.error("Lead API unexpected error", error);
  return NextResponse.json(
    { error: "Unexpected error while processing the request." },
    { status: 500 }
  );
}
