import { useMemo, useState } from "react";
export default function usePagination({ pageSize = 20 } = {}) {
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pages = useMemo(
    () => Math.max(1, Math.ceil(total / pageSize)),
    [total, pageSize],
  );
  return { page, setPage, total, setTotal, pages, pageSize };
}
