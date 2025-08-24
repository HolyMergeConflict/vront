import React, { useEffect } from "react";
import useApi from "../hooks/useApi";
import api from "../services/apiClient";
import endpoints from "../config/endpoints";
import TaskCard from "../components/tasks/TaskCard";
import CreateTaskDialog from "../components/tasks/CreateTaskDialog";
import { TaskBase, TaskCreate } from "../types/api";

export default function TasksPage() {
  const { run, loading, error, data } = useApi<TaskBase[]>(() =>
    api.get(endpoints.tasks),
  );
  useEffect(() => {
    run();
  }, [run]);

  const reload = () => run();
  const create = async (payload: TaskCreate) => {
    await api.post(endpoints.tasks, payload);
    await reload();
  };
  const del = async (id: number) => {
    if (confirm("Удалить задачу?")) {
      await api.delete(`${endpoints.tasks}/${id}`);
      await reload();
    }
  };
  const toggle = async (t: TaskBase) => {
    const next = t.status === "APPROVED" ? "REJECTED" : "APPROVED";
    await api.patch(`${endpoints.tasks}/${t.id}`, { status: next });
    await reload();
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Задачи</h1>
        <div className="flex items-center gap-2">
          <CreateTaskDialog onCreated={create} />
          <button
            onClick={reload}
            className="rounded-xl border px-3 py-1 text-sm hover:bg-neutral-100"
          >
            Обновить
          </button>
        </div>
      </div>
      {error && <div className="mb-3 text-red-600 text-sm">{error}</div>}
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <div className="text-sm">Загрузка...</div>
        ) : data?.length ? (
          data.map((t) => (
            <TaskCard
              key={t.id}
              task={t}
              onDelete={() => del(t.id)}
              onToggle={() => toggle(t)}
            />
          ))
        ) : (
          <div className="text-sm text-neutral-500">Пусто</div>
        )}
      </div>
    </section>
  );
}
