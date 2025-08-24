import React, { useEffect } from "react";
import useApi from "../hooks/useApi";
import api from "../services/apiClient";
import endpoints from "../config/endpoints";
import { TaskBase } from "../types/api";

export default function ModerationPage() {
  const { run, loading, error, data } = useApi<TaskBase[]>(() =>
    api.get(endpoints.moderation),
  );
  useEffect(() => {
    run();
  }, [run]);
  const approve = async (id: number, approve: boolean) => {
    await api.post(`${endpoints.moderation}/${id}`, { approve });
    await run();
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Модерация</h1>
        <button
          onClick={() => run()}
          className="rounded-xl border px-3 py-1 text-sm hover:bg-neutral-100"
        >
          Обновить
        </button>
      </div>
      {error && <div className="mb-3 text-red-600 text-sm">{error}</div>}
      <div className="space-y-3">
        {data?.length ? (
          data.map((t) => (
            <div key={t.id} className="rounded-2xl border bg-white p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm text-neutral-500">#{t.id}</div>
                  <div className="text-lg font-medium">{t.title}</div>
                  {t.description && (
                    <p className="mt-1 text-sm text-neutral-600">
                      {t.description}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => approve(t.id, true)}
                    className="rounded-xl border px-3 py-1 text-xs hover:bg-neutral-100"
                  >
                    Одобрить
                  </button>
                  <button
                    onClick={() => approve(t.id, false)}
                    className="rounded-xl border px-3 py-1 text-xs hover:bg-neutral-100"
                  >
                    Отклонить
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-sm text-neutral-500">Нет задач на модерации</div>
        )}
      </div>
    </section>
  );
}
