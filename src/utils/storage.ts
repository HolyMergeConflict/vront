export function get(k: string) {
  return localStorage.getItem(k) || "";
}
export function set(k: string, v?: string) {
  if (!v) localStorage.removeItem(k);
  else localStorage.setItem(k, v);
}
export function del(k: string) {
  localStorage.removeItem(k);
}
