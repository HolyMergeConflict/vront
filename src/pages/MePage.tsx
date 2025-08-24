import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Reveal, fadeUp, containerStagger } from "../utils/motion";
import { motion } from "framer-motion";
import SimpleTable from "../components/tables/SimpleTable";
import useApi from "../hooks/useApi";
import api from "../services/apiClient";
import endpoints from "../config/endpoints";
import StatusBadge from "../components/ui/StatusBadge";
import { TaskBase, TaskHistoryRow } from "../types/api";
import React, { useEffect, useMemo, useState } from "react";
import ScoreChart from "../components/charts/ScoreChart";

type TabKey = "overview" | "drafts" | "approved";

export default function MePage() {
  const { user } = useAuth();
  const role = user?.role;
  const isAdmin = role === "ADMIN";
  const isModerator = role === "MODERATOR";

  const histApi = useApi<TaskHistoryRow[]>(() =>
    api.get(endpoints.taskHistory.my),
  );
  const tasksApi = useApi<TaskBase[]>(() => api.get(endpoints.tasks));

  useEffect(() => {
    histApi.run();
    tasksApi.run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const myTasks = useMemo(
    () => (tasksApi.data || []).filter((t) => t.creator_id === user?.id),
    [tasksApi.data, user?.id],
  );

  const myDrafts = useMemo(
    () => myTasks.filter((t) => t.status === "PENDING"),
    [myTasks],
  );

  const myApproved = useMemo(
    () =>
      [...myTasks.filter((t) => t.status === "APPROVED")].sort((a, b) => {
        const da = new Date(a.updated_at || a.created_at || 0).getTime();
        const db = new Date(b.updated_at || b.created_at || 0).getTime();
        return db - da; // последние сверху
      }),
    [myTasks],
  );

  const last5 = useMemo(() => (histApi.data || []).slice(0, 5), [histApi.data]);

  // Данные для графика прогресса (по времени)
  const chartData = useMemo(() => {
    const rows = (histApi.data || [])
      .slice()
      .reverse() // от старых к новым
      .slice(-12); // последние 12 записей
    return rows.map((r) => ({
      ts: r.timestamp ? new Date(r.timestamp).toLocaleDateString() : "",
      score: r.score ?? 0,
    }));
  }, [histApi.data]);

  const maxScore = useMemo(
    () => Math.max(0, ...chartData.map((d) => Number(d.score) || 0)),
    [chartData],
  );

  const [tab, setTab] = useState<TabKey>("overview");

  const actions: Array<{
    to: string;
    title: string;
    desc: string;
    visible: boolean;
  }> = [
    {
      to: "/tasks",
      title: "Задачи",
      desc: "Создавайте и управляйте задачами",
      visible: !!user,
    },
    {
      to: "/task-history",
      title: "История",
      desc: "Смотрите свои отправленные решения",
      visible: !!user,
    },
    {
      to: "/moderation",
      title: "Модерация",
      desc: "Проверяйте задачи и меняйте статус",
      visible: isModerator || isAdmin,
    },
    {
      to: "/users",
      title: "Пользователи",
      desc: "Список пользователей и роли",
      visible: isAdmin,
    },
  ];

  return (
    <section className="space-y-8">
      {/* Заголовок и профиль */}
      <Reveal
        variants={fadeUp}
        className="rounded-3xl border bg-white p-8 shadow-sm"
      >
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
          Личный кабинет
        </h1>
        <p className="mt-2 text-neutral-600">
          Привет{user?.username ? `, ${user.username}` : ""}! Ваша роль:{" "}
          <span className="font-medium">{role || "—"}</span>.
        </p>
        <div className="mt-4 grid gap-3 text-sm text-neutral-700 md:grid-cols-3">
          <InfoCard label="Email" value={user?.email || "—"} />
          <InfoCard label="Username" value={user?.username || "—"} />
          <InfoCard label="Role" value={role || "—"} />
        </div>
      </Reveal>

      {/* Быстрые действия по роли */}
      <Reveal variants={containerStagger}>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {actions
            .filter((a) => a.visible)
            .map((a, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="rounded-2xl border bg-white p-5 shadow-sm"
              >
                <div className="text-sm text-neutral-500">Действие</div>
                <div className="mt-1 text-lg font-medium">{a.title}</div>
                <p className="mt-1 text-sm text-neutral-600">{a.desc}</p>
                <Link
                  to={a.to}
                  className="mt-4 inline-block rounded-xl border px-4 py-2 text-sm hover:bg-neutral-100"
                >
                  Открыть
                </Link>
              </motion.div>
            ))}
        </div>
      </Reveal>

      {/* Переключатель вкладок */}
      <Reveal variants={fadeUp} className="rounded-2xl border bg-white p-2">
        <div className="flex flex-wrap gap-2">
          <TabButton
            active={tab === "overview"}
            onClick={() => setTab("overview")}
          >
            Обзор
          </TabButton>
          <TabButton active={tab === "drafts"} onClick={() => setTab("drafts")}>
            Черновики
          </TabButton>
          <TabButton
            active={tab === "approved"}
            onClick={() => setTab("approved")}
          >
            Одобренные
          </TabButton>
        </div>

        <div className="mt-4 space-y-6">
          {tab === "overview" && (
            <>
              {/* История — последние 5 */}
              <div className="rounded-xl border p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-base font-medium">
                    Моя история (последние 5)
                  </h2>
                  <Link to="/task-history" className="text-sm underline">
                    Вся история
                  </Link>
                </div>
                <HistoryTable
                  rows={last5}
                  loading={histApi.loading}
                  error={histApi.error}
                />
              </div>

              {/* Мои задачи (все) */}
              <div className="rounded-xl border p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-base font-medium">Мои задачи</h2>
                  <Link to="/tasks" className="text-sm underline">
                    Все задачи
                  </Link>
                </div>
                <MyTasksTable
                  rows={myTasks}
                  loading={tasksApi.loading}
                  error={tasksApi.error}
                />
              </div>
            </>
          )}

          {tab === "drafts" && (
            <div className="rounded-xl border p-4">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-base font-medium">Черновики (PENDING)</h2>
                <Link to="/tasks" className="text-sm underline">
                  К задачам
                </Link>
              </div>
              <MyTasksTable
                rows={myDrafts}
                loading={tasksApi.loading}
                error={tasksApi.error}
              />
            </div>
          )}

          {tab === "approved" && (
            <div className="rounded-xl border p-4">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-base font-medium">Недавно одобренные</h2>
                <Link to="/tasks" className="text-sm underline">
                  К задачам
                </Link>
              </div>
              <MyTasksTable
                rows={myApproved}
                loading={tasksApi.loading}
                error={tasksApi.error}
              />
            </div>
          )}
        </div>
      </Reveal>
    </section>
  );
}

function InfoCard({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-xl border bg-white p-4">
      <div className="text-xs text-neutral-500">{label}</div>
      <div className="font-mono">{value}</div>
    </div>
  );
}

function TabButton({
  active,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      {...props}
      className={`rounded-lg px-3 py-1 text-sm border ${active ? "bg-neutral-900 text-white" : "hover:bg-neutral-100"}`}
    >
      {children}
    </button>
  );
}

function HistoryTable({
  rows,
  loading,
  error,
}: {
  rows: TaskHistoryRow[];
  loading?: boolean;
  error?: string;
}) {
  const columns = [
    { key: "id", title: "ID" },
    {
      key: "task",
      title: "Задача",
      render: (r: TaskHistoryRow) => r.task?.title || r.task_id,
    },
    {
      key: "status",
      title: "Статус",
      render: (r: TaskHistoryRow) => <StatusBadge status={r.status} />,
    },
    {
      key: "score",
      title: "Оценка",
      render: (r: TaskHistoryRow) => (
        <span className="font-medium">{r.score ?? "—"}</span>
      ),
    },
    {
      key: "timestamp",
      title: "Время",
      render: (r: TaskHistoryRow) =>
        r.timestamp ? new Date(r.timestamp).toLocaleString() : "",
    },
  ];
  return (
    <>
      {error && <div className="mb-2 text-sm text-red-600">{error}</div>}
      <SimpleTable
        columns={columns}
        rows={rows || []}
        loading={loading}
        empty="Пока нет записей"
      />
    </>
  );
}

function MyTasksTable({
  rows,
  loading,
  error,
}: {
  rows: TaskBase[];
  loading?: boolean;
  error?: string;
}) {
  const columns = [
    { key: "id", title: "ID" },
    { key: "title", title: "Заголовок" },
    { key: "subject", title: "Предмет" },
    {
      key: "difficulty",
      title: "Сложн.",
      render: (t: TaskBase) => (
        <span className="rounded-full bg-neutral-100 px-2 py-[2px] text-[11px]">
          #{t.difficulty}
        </span>
      ),
    },
    {
      key: "status",
      title: "Статус",
      render: (t: TaskBase) => <StatusBadge status={t.status} />,
    },
  ];
  return (
    <>
      {error && <div className="mb-2 text-sm text-red-600">{error}</div>}
      <SimpleTable
        columns={columns}
        rows={rows || []}
        loading={loading}
        empty="Нет задач для показа"
      />
    </>
  );
}
