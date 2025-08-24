import React from "react";
export default function Button({
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`rounded-xl border px-3 py-1 text-sm hover:bg-neutral-100 ${className}`.trim()}
    />
  );
}
