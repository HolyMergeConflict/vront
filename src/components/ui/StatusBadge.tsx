import React from "react";

type Props = {
  status: string | undefined;
  className?: string;
  size?: "sm" | "md";
};

const MAP: Record<
  string,
  { label: string; base: string; text: string; ring: string }
> = {
  APPROVED: {
    label: "Одобрено",
    base: "bg-emerald-50",
    text: "text-emerald-700",
    ring: "ring-emerald-600/10",
  },
  PENDING: {
    label: "Черновик",
    base: "bg-amber-50",
    text: "text-amber-700",
    ring: "ring-amber-600/10",
  },
  REJECTED: {
    label: "Отклонено",
    base: "bg-rose-50",
    text: "text-rose-700",
    ring: "ring-rose-600/10",
  },
};

export default function StatusBadge({
  status,
  className = "",
  size = "sm",
}: Props) {
  const key = (status || "").toUpperCase();
  const cfg = MAP[key] || {
    label: status || "—",
    base: "bg-neutral-100",
    text: "text-neutral-700",
    ring: "ring-neutral-600/10",
  };
  const paddings =
    size === "md" ? "px-2 py-1 text-xs" : "px-2 py-[2px] text-[11px]";
  return (
    <span
      className={`${cfg.base} ${cfg.text} inline-flex items-center rounded-full ring-1 ${cfg.ring} ${paddings} ${className}`}
    >
      {cfg.label}
    </span>
  );
}
