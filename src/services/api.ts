// Thin wrapper over fetch for all /api/* calls. Centralizes JSON parsing and
// error normalization so components don't each reimplement res.ok / res.json /
// network-failure handling. Throws ApiError for non-2xx responses; plain fetch
// errors (network down, aborted request) propagate unchanged.

export class ApiError extends Error {
  readonly status: number;
  readonly body: unknown;

  constructor(status: number, body: unknown) {
    super(`Request failed with status ${status}`);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

interface ErrorBody {
  message?: string;
  rejected?: { slot: string; reason: string }[];
}

// Maps any thrown value to a user-facing message. ApiError bodies follow the
// backend's error contract: 400 gear-validation responses carry a `rejected`
// list (first reason wins), everything else carries `message`.
export function apiErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof ApiError) {
    const body = err.body as ErrorBody | null;
    return body?.rejected?.[0]?.reason ?? body?.message ?? fallback;
  }
  return "Network error. Please try again.";
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, init);
  if (!res.ok) {
    const body: unknown = await res.json().catch(() => null);
    throw new ApiError(res.status, body);
  }
  return res.json() as Promise<T>;
}

export function getJson<T>(path: string, signal?: AbortSignal): Promise<T> {
  return request<T>(path, { signal });
}

export function sendJson<T>(path: string, method: "POST" | "PATCH" | "PUT" | "DELETE", body: unknown): Promise<T> {
  return request<T>(path, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
