import React from "react";
interface Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}
export default function TextArea({ label, ...rest }: Props) {
  return (
    <label className="block">
      <div className="mb-1 text-xs text-neutral-600">{label}</div>
      <textarea
        {...rest}
        className="w-full rounded-xl border px-3 py-2 text-sm outline-none ring-black/10 focus:ring"
      />
    </label>
  );
}
