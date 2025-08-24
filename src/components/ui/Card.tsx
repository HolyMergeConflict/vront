import React from "react";
import { Link } from "react-router-dom";
export default function Card({
  title,
  subtitle,
  to,
}: {
  title: string;
  subtitle?: string;
  to?: string;
}) {
  const Comp: any = to ? Link : "div";
  return (
    <Comp
      to={to}
      className="rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md"
    >
      <div className="text-sm text-neutral-500">Раздел</div>
      <div className="mt-1 text-lg font-medium">{title}</div>
      <div className="mt-1 text-sm text-neutral-500">{subtitle}</div>
    </Comp>
  );
}
