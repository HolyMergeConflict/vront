import React from "react";
interface Col<T> {
  key: keyof T | string;
  title: string;
  render?: (row: T) => React.ReactNode;
}
export default function SimpleTable<T>({
  columns,
  rows,
  loading,
  empty = "Пусто",
}: {
  columns: Col<T>[];
  rows: T[];
  loading?: boolean;
  empty?: string;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b bg-neutral-50 text-left">
            {columns.map((c) => (
              <th key={String(c.key)} className="p-2">
                {c.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td className="p-3" colSpan={columns.length}>
                Загрузка...
              </td>
            </tr>
          ) : rows?.length ? (
            rows.map((r, i) => (
              <tr key={(r as any).id ?? i} className="border-b">
                {columns.map((c) => (
                  <td key={String(c.key)} className="p-2">
                    {c.render ? c.render(r) : (r as any)[c.key as any]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td className="p-3" colSpan={columns.length}>
                {empty}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
