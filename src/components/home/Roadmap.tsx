import React from "react";
import { motion, useReducedMotion } from "framer-motion";

export type RoadmapStatus = "done" | "in-progress" | "planned";

export interface RoadmapItem {
  id: string;
  title: string;
  period?: string; // Q3 2025, Sep–Oct, v0.3, ...
  status: RoadmapStatus;
  points?: string[];
  cta?: { to: string; label: string };
}

export default function Roadmap({
  items,
  accent = "#10B981",
  className = "",
  title = "Дорожная карта",
  subtitle,
}: {
  items: RoadmapItem[];
  accent?: string;
  className?: string;
  title?: string;
  subtitle?: string;
}) {
  const prefersReduced = useReducedMotion();

  return (
    <section
      className={`mx-auto w-full max-w-5xl ${className}`}
      style={{ ["--accent" as any]: accent }}
    >
      <header className="mb-6 md:mb-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-black px-3 py-1 text-xs font-medium text-white">
          roadmap
        </div>
        <h2 className="mt-3 text-2xl md:text-3xl font-semibold tracking-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 text-sm md:text-base text-neutral-600">
            {subtitle}
          </p>
        )}
      </header>

      <div className="relative">
        <div className="absolute left-6 top-0 h-full w-px bg-gradient-to-b from-black/10 via-black/10 to-transparent" />

        <ol className="space-y-6 md:space-y-7">
          {items.map((it, i) => (
            <motion.li
              key={it.id}
              initial={prefersReduced ? {} : { opacity: 0, y: 16 }}
              whileInView={prefersReduced ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.45, ease: "easeOut", delay: i * 0.05 }}
              className="relative pl-12 md:pl-16"
            >
              {/* узел статуса */}
              <Node status={it.status} />

              {/* карточка этапа */}
              <article className="rounded-2xl border border-neutral-200 bg-white shadow-sm p-4 md:p-5">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h3 className="text-lg md:text-xl font-semibold tracking-tight">
                    {it.title}
                  </h3>
                  {it.period ? (
                    <span className="text-xs md:text-sm text-neutral-500">
                      {it.period}
                    </span>
                  ) : null}
                  <StatusPill status={it.status} />
                </div>

                {it.points?.length ? (
                  <ul className="mt-3 grid gap-2 text-sm text-neutral-700 md:grid-cols-2">
                    {it.points.map((p, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="mt-1 block h-1.5 w-1.5 rounded-full bg-neutral-900" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}

                {it.cta ? (
                  <div className="mt-4">
                    <a
                      href={it.cta.to}
                      className="inline-flex items-center rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-medium text-black hover:brightness-95"
                    >
                      {it.cta.label}
                    </a>
                  </div>
                ) : null}
              </article>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Node({ status }: { status: RoadmapStatus }) {
  const styles = {
    done: "bg-[var(--accent)]",
    "in-progress":
      "bg-white ring-2 ring-neutral-300 after:absolute after:inset-1 after:rounded-full after:bg-neutral-200",
    planned: "bg-white ring-2 ring-neutral-200",
  }[status];

  return (
    <span
      className="absolute left-6 top-1.5 -translate-x-1/2 grid h-9 w-9 place-items-center"
      aria-hidden
    >
      <span className={`relative h-3.5 w-3.5 rounded-full ${styles}`} />
    </span>
  );
}

function StatusPill({ status }: { status: RoadmapStatus }) {
  const map = {
    done: { label: "Готово", cls: "bg-[var(--accent)] text-black" },
    "in-progress": {
      label: "В работе",
      cls: "bg-neutral-100 text-neutral-600 ring-1 ring-neutral-200",
    },
    planned: { label: "План", cls: "bg-black text-white" },
  }[status];

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${map.cls}`}
    >
      {map.label}
    </span>
  );
}
