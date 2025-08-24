import React from "react";
import { Link, useLocation } from "react-router-dom";
export default function NavLink({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) {
  const { pathname } = useLocation();
  const active = pathname === to;
  return (
    <Link
      to={to}
      className={`rounded-lg px-2 py-1 ${active ? "bg-neutral-900 text-white" : "text-neutral-700 hover:bg-neutral-100 hover:text-black"}`}
    >
      {children}
    </Link>
  );
}
