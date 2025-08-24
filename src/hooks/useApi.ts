import { useState, useCallback } from "react";
export default function useApi<T>(fn: (...args: any[]) => Promise<T>) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [data, setData] = useState<T | null>(null);

  const run = useCallback(
    async (...args: any[]) => {
      setLoading(true);
      setError("");
      try {
        const res = await fn(...args);
        setData(res);
        return res as T;
      } catch (e: any) {
        setError(e.message);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [fn],
  );

  return { run, loading, error, data, setData };
}
