import React, { useEffect } from "react";
import SimpleTable from "../components/tables/SimpleTable";
import useApi from "../hooks/useApi";
import api from "../services/apiClient";
import endpoints from "../config/endpoints";
import { TaskHistoryRow } from "../types/api";

export default function TaskHistoryPage() {
  const { run, loading, error, data } = useApi<TaskHistoryRow[]>(() =>
    api.get(endpoints.taskHistory.my),
  );
  useEffect(() => {
    run();
  }, [run]);
  const columns = [
    { key: "id", title: "ID" },
    {
      key: "user",
      title: "Пользователь",
      render: (r: TaskHistoryRow) => r.user_id ?? r.user?.email,
    },
    {
      key: "task",
      title: "Задача",
      render: (r: TaskHistoryRow) => r.task_id ?? r.task?.title,
    },
    { key: "status", title: "Статус" },
    { key: "score", title: "Оценка" },
    {
      key: "timestamp",
      title: "Время",
      render: (r: TaskHistoryRow) =>
        r.timestamp ? new Date(r.timestamp).toLocaleString() : "",
    },
  ];
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">История решений</h1>
        <button
          onClick={() => run()}
          className="rounded-xl border px-3 py-1 text-sm hover:bg-neutral-100"
        >
          Обновить
        </button>
      </div>
      {error && <div className="mb-3 text-red-600 text-sm">{error}</div>}
      <SimpleTable columns={columns} rows={data || []} loading={loading} />
    </section>
  );
}
