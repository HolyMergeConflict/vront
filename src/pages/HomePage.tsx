import React from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  Shield,
  History,
  Users,
  Sparkles,
  CheckCircle2,
  Book,
  Cpu,
} from "lucide-react";
import SectionCard from "../components/home/SectionCard";
import Roadmap, { RoadmapItem } from "../components/home/Roadmap";

const ROADMAP: RoadmapItem[] = [
  {
    id: "mvp",
    title: "MVP backend: задачи, модерация, история",
    period: "Q3 2025",
    status: "done",
    points: ["Планирование и написание backend"],
  },
  {
    id: "frontend",
    title: "Написание frontend",
    period: "Q4 2025",
    status: "in-progress",
    points: ["Разработка и тестирование интерфейса", "Интеграция с backend"],
  },
  {
    id: "recs",
    title: "Рекомендательная система v1",
    period: "ВЧЕРА",
    status: "planned",
    points: ["Миша сделай модель пж пж пж"],
  },
  {
    id: "integration",
    title: "Интеграция backend с моделью",
    period: "ВЧЕРА",
    status: "planned",
    points: ["Миша, очень надо"],
  },
];

export default function HomePage() {
  const prefersReduced = useReducedMotion();

  const ACCENT = "#10B981";

  return (
    <section
      className="mx-auto w-full max-w-5xl px-4 space-y-10 overflow-x-clip"
      style={{ ["--accent" as any]: ACCENT }}
    >
      {/* HERO */}
      <motion.div
        initial={prefersReduced ? {} : { opacity: 0, y: 16 }}
        animate={prefersReduced ? {} : { opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="rounded-3xl border bg-white p-8 md:p-12 shadow-sm"
      >
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            reco syste — платформа задач с рекомендациями
          </h1>
          <p className="mt-3 text-neutral-600 text-base md:text-lg">
            Банк задач, модерация, история решений и база для рекомендательной
            системы. Бэкенд — FastAPI, БД — SQLAlchemy (async), роли и пайплайн
            модерации уже готовы.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/tasks"
              className="rounded-xl bg-black px-4 py-2 text-white text-sm"
            >
              Перейти к задачам
            </Link>
            <Link
              to="/task-history"
              className="rounded-xl border px-4 py-2 text-sm hover:bg-neutral-100"
            >
              Моя история
            </Link>
          </div>
        </div>
      </motion.div>

      <SectionCard
        icon={<Book size={16} />}
        subtitle="раздел"
        title="Задачи"
        bullets={[
          "Быстрый поиск",
          "Черновики",
          "Статусы: APPROVED/REJECTED/PENDING",
        ]}
        cta={{ to: "/tasks", label: "Открыть задачи" }}
        delay={0.05}
        accentParts={["icon"]}
      />

      <SectionCard
        icon={<Shield size={16} />}
        subtitle="процесс"
        title="Модерация контента"
        bullets={[
          "Очередь на проверку",
          "Комментарий модератора",
          "Аудит действий",
        ]}
        cta={{ to: "/moderation", label: "К модерации" }}
        delay={0.1}
        accentParts={["icon"]}
      />

      <SectionCard
        icon={<History size={16} />}
        subtitle="аналитика"
        title="История решений"
        bullets={["Статус, балл и время", "Фильтры по статусу и датам"]}
        cta={{ to: "/task-history", label: "Смотреть историю" }}
        delay={0.15}
        accentParts={["icon"]}
      />

      <SectionCard
        icon={<Users size={16} />}
        subtitle="доступ"
        title="Пользователи и роли"
        bullets={["Админ, модератор, студент", "Доступ зависит от роли"]}
        delay={0.2}
        accentParts={["icon"]}
      />

      <SectionCard
        icon={<Cpu size={16} />}
        subtitle="скоро"
        title="Рекомендации"
        bullets={["Похожие задачи после ошибок", "Адаптивная сложность"]}
        cta={{ to: "/tasks", label: "Скоро" }}
        delay={0.25}
        accentParts={["icon"]}
      />

      <Roadmap items={ROADMAP} accent="#10B981" className="mt-10" />
    </section>
  );
}
