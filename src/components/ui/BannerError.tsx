import React from "react";
export default function BannerError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-2 text-sm text-red-700">
      {msg}
    </div>
  );
}
