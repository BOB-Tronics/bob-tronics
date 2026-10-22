// Contact message API. Field aliases and response envelopes are UNVERIFIED from the supplied endpoint list.
import { authApiFetch } from "@/lib/auth";
import { ApiError } from "@/lib/api";

export type ContactMessageInput = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

export type ContactMessage = ContactMessageInput & {
  id: number;
  subject: string;
  status: string;
  receivedAt: string;
};

export type ContactMessageUpdate = Partial<ContactMessageInput> & {
  subject?: string;
  status?: string;
};

type ContactRecord = Record<string, unknown>;
type ContactListEnvelope = {
  count?: number;
  results?: ContactRecord[];
  data?: ContactRecord[] | ContactListEnvelope;
  messages?: ContactRecord[];
  success?: boolean;
};

function asRecord(value: unknown): ContactRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? value as ContactRecord
    : {};
}

function text(row: ContactRecord, ...keys: string[]): string {
  for (const key of keys) {
    const value = row[key];
    if (typeof value === "string" || typeof value === "number") return String(value);
  }
  return "";
}

function mapContactMessage(value: ContactRecord): ContactMessage {
  return {
    id: Number(value.id ?? value.contact_id ?? value.contact_message_id ?? value.message_id ?? 0),
    name: text(value, "name", "sender", "sender_name", "customer_name", "full_name"),
    email: text(value, "email", "sender_email", "contact_email", "customer_email"),
    phone: text(value, "phone", "phone_number", "contact_phone"),
    subject: text(value, "subject"),
    message: text(value, "message", "body", "content"),
    status: text(value, "status", "status_display") || "\u2014",
    receivedAt: text(value, "created_at", "received_at", "submitted_at"),
  };
}

function listFrom(response: unknown): { rows: ContactRecord[]; count: number } {
  function findRows(value: unknown, depth = 0): ContactRecord[] | null {
    if (Array.isArray(value)) return value.map(asRecord);
    if (depth > 4) return null;
    const record = asRecord(value);
    for (const key of ["results", "messages", "contact_messages", "items", "data"]) {
      const nested = record[key];
      if (Array.isArray(nested)) return nested.map(asRecord);
      if (nested && typeof nested === "object") {
        const rows = findRows(nested, depth + 1);
        if (rows) return rows;
      }
    }
    return null;
  }

  const root = asRecord(response);
  const rows = findRows(response) ?? [];
  const countValue = root.count ?? asRecord(root.data).count;
  return { rows, count: typeof countValue === "number" ? countValue : rows.length };
}
function unwrapMessage(response: unknown): ContactMessage | null {
  if (!response) return null;
  const root = asRecord(response);
  const nested = root.data;
  const record = typeof nested === "object" && nested !== null && !Array.isArray(nested)
    ? asRecord(nested)
    : root;
  return mapContactMessage(record);
}

export async function listContactMessages(): Promise<{ results: ContactMessage[]; count: number }> {
  const response = await authApiFetch<unknown>("/contact/");
  const { rows, count } = listFrom(response);
  return { results: rows.map(mapContactMessage), count };
}

export async function getContactMessage(id: number): Promise<ContactMessage> {
  const response = await authApiFetch<unknown>(`/contact/${id}/`);
  const record = unwrapMessage(response);
  if (!record) throw new ApiError("Contact message was not found.", 404);
  return record;
}

export async function createContactMessage(input: ContactMessageInput): Promise<void> {
  await authApiFetch<unknown>("/contact/", { method: "POST", body: JSON.stringify(input) });
}

export async function replaceContactMessage(id: number, input: ContactMessageUpdate): Promise<void> {
  await authApiFetch<unknown>(`/contact/${id}/`, { method: "PUT", body: JSON.stringify(input) });
}

export async function patchContactMessage(id: number, input: ContactMessageUpdate): Promise<void> {
  await authApiFetch<unknown>(`/contact/${id}/`, { method: "PATCH", body: JSON.stringify(input) });
}

export async function deleteContactMessage(id: number): Promise<void> {
  await authApiFetch<unknown>(`/contact/${id}/`, { method: "DELETE" });
}
