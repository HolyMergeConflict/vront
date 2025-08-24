import React, { useEffect } from "react";
import SimpleTable from "../components/tables/SimpleTable";
import useApi from "../hooks/useApi";
import api from "../services/apiClient";
import endpoints from "../config/endpoints";
import { UserPublic } from "../types/api";

export default function UsersPage() {
  const { run, loading, error, data } = useApi<UserPublic[]>(() =>
    api.get(endpoints.users),
  );
  useEffect(() => {
    run();
  }, [run]);
  const columns = [
    { key: "id", title: "ID" },
    { key: "email", title: "Email" },
    { key: "username", title: "Username" },
    { key: "role", title: "Роль" },
  ];
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Пользователи</h1>
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
