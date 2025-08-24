import { Variants, motion, useReducedMotion } from "framer-motion";
import React from "react";

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export const containerStagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

export function Reveal({
  children,
  variants = fadeUp,
  className = "",
  as = "div",
}: {
  children: React.ReactNode;
  variants?: Variants;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}) {
  const prefersReducedMotion = useReducedMotion();
  const Comp: any = motion[as] ?? motion.div;

  if (prefersReducedMotion) {
    // Без анимации — сразу видимая секция
    return <div className={className}>{children}</div>;
  }

  return (
    <Comp
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      variants={variants}
    >
      {children}
    </Comp>
  );
}
