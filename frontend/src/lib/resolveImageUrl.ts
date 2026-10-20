const backendOrigin = (process.env.NEXT_PUBLIC_API_URL ?? "")
  .replace(/\/api\/v1\/?$/, "")
  .replace(/\/$/, "");

export function resolveImageUrl(value: string | null | undefined): string {
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  if (!backendOrigin) return value;
  return `${backendOrigin}${value.startsWith("/") ? "" : "/"}${value}`;
}
