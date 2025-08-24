const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

function buildHeaders(token?: string, extra: HeadersInit = {}) {
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  } as HeadersInit;
}

let _token = "";
const api = {
  setToken(t?: string) {
    _token = t || "";
  },
  async request<T = any>(
    path: string,
    {
      method = "GET",
      body,
      headers = {} as HeadersInit,
    }: { method?: string; body?: any; headers?: HeadersInit } = {},
  ): Promise<T> {
    const res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: buildHeaders(_token, headers),
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) {
      let msg = `${res.status} ${res.statusText}`;
      try {
        const data = await res.json();
        msg = (data?.detail || data?.message) ?? msg;
      } catch {}
      throw new Error(msg);
    }
    const ct = res.headers.get("content-type") || "";
    if (ct.includes("application/json")) return res.json() as Promise<T>;
    return (await res.text()) as unknown as T;
  },
  get: <T>(p: string) => api.request<T>(p),
  post: <T>(p: string, body?: any) => api.request<T>(p, { method: "POST", body }),
  patch: <T>(p: string, body?: any) => api.request<T>(p, { method: "PATCH", body }),
  delete: <T>(p: string) => api.request<T>(p, { method: "DELETE" }),
};

export default api;
