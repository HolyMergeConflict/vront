// src/components/ui/StackedTile.tsx
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

type Variant = "light" | "dark";

export interface StackedTileProps {
  variant?: Variant;
  eyebrow?: string;
  title: string;
  description?: string;
  points?: string[];
  cta?: { to: string; label: string };
}

const stylesByVariant: Record<
  Variant,
  {
    shell: string;
    bar: string;
    eyebrow: string;
    title: string;
    text: string;
    list: string;
    cta: string;
  }
> = {
  light: {
    shell: "bg-white text-neutral-900 border border-neutral-200 shadow-sm",
    bar: "bg-neutral-900", // верхняя плашка (тёмная)
    eyebrow: "text-neutral-500",
    title: "text-neutral-900",
    text: "text-neutral-600",
    list: "text-neutral-700",
    cta: "border border-neutral-300 hover:bg-neutral-100",
  },
  dark: {
    shell: "bg-neutral-900 text-white border border-neutral-800 shadow-sm",
    bar: "bg-white/90", // верхняя плашка (светлая)
    eyebrow: "text-neutral-400",
    title: "text-white",
    text: "text-neutral-300",
    list: "text-neutral-200",
    cta: "bg-white text-neutral-900 hover:bg-neutral-200",
  },
};

export default function StackedTile({
  variant = "light",
  eyebrow,
  title,
  description,
  points = [],
  cta,
}: StackedTileProps) {
  const s = stylesByVariant[variant];

  return (
    <motion.article
      initial={{ opacity: 0, y: 16, scale: 0.995 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className={`rounded-3xl overflow-hidden ${s.shell}`}
    >
      {/* верхняя плашка (единая у всех по ширине) */}
      <div className={`h-2 w-full ${s.bar}`} />

      <div className="p-6 md:p-8">
        {eyebrow && (
          <div className={`text-xs uppercase tracking-wide ${s.eyebrow}`}>
            {eyebrow}
          </div>
        )}
        <h3 className={`mt-1 text-xl md:text-2xl font-semibold ${s.title}`}>
          {title}
        </h3>
        {description && (
          <p className={`mt-2 text-sm md:text-base ${s.text}`}>{description}</p>
        )}
        {!!points.length && (
          <ul
            className={`mt-3 space-y-1 list-disc pl-5 text-sm md:text-base ${s.list}`}
          >
            {points.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        )}
        {cta && (
          <Link
            to={cta.to}
            className={`mt-5 inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm ${s.cta}`}
          >
            {cta.label}
          </Link>
        )}
      </div>
    </motion.article>
  );
}
