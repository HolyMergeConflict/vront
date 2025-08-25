import React from "react";
import { motion } from "framer-motion";

type AccentPart = "badge" | "icon" | "cta";

interface Props {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  bullets?: string[];
  cta?: { label: string; to: string };
  delay?: number;
  /** Какие части подсветить акцентом: "badge" | "icon" | "cta" */
  accentParts?: AccentPart[]; // по умолчанию []
}

export default function SectionCard({
  icon,
  title,
  subtitle,
  bullets = [],
  cta,
  delay = 0,
  accentParts = [],
}: Props) {
  const useBadgeAccent = accentParts.includes("badge");
  const useIconAccent = accentParts.includes("icon");
  const useCtaAccent = accentParts.includes("cta");

  const badgeCls = useBadgeAccent
    ? "bg-[var(--accent)] text-black"
    : "bg-black text-white";

  const iconWrapCls = useIconAccent
    ? "bg-[var(--accent)]/15 text-[var(--accent)] ring-1 ring-[var(--accent)]/30"
    : "bg-black/5 text-black ring-1 ring-black/10";

  const ctaCls = useCtaAccent
    ? "bg-[var(--accent)] text-black hover:brightness-95"
    : "bg-black text-white hover:bg-neutral-800";

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.45, delay }}
      className="rounded-3xl border border-neutral-200 bg-white shadow-sm p-6 md:p-8"
    >
      {/* бейдж */}
      {subtitle && (
        <div
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${badgeCls}`}
        >
          {icon && (
            <span
              className={`grid h-3 w-3 place-items-center rounded-full ${useBadgeAccent ? "bg-black/20" : "bg-white/20"}`}
            />
          )}
          {subtitle}
        </div>
      )}

      <div className="mt-4 flex items-start gap-3">
        {icon && (
          <span
            className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${iconWrapCls}`}
          >
            {icon}
          </span>
        )}
        <h3 className="text-xl md:text-2xl font-semibold tracking-tight text-neutral-900">
          {title}
        </h3>
      </div>

      {!!bullets.length && (
        <ul className="mt-4 space-y-2 text-sm text-neutral-700">
          {bullets.map((b, i) => (
            <li key={i} className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-neutral-900" />
              {b}
            </li>
          ))}
        </ul>
      )}

      {cta && (
        <div className="mt-6">
          <a
            href={cta.to}
            className={`inline-flex items-center rounded-xl px-4 py-2 text-sm ${ctaCls}`}
          >
            {cta.label}
          </a>
        </div>
      )}
    </motion.article>
  );
}
