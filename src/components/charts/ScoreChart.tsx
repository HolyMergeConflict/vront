import React, { useEffect, useMemo, useState } from "react";

type Point = { ts: string; score: number };

export default function ScoreChart({ data }: { data: Point[] }) {
  const [R, setR] = useState<null | any>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const mod = await import("recharts");
        if (mounted) setR(mod);
      } catch {
        setR(null);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const safeData = useMemo(
    () => (data?.length ? data : [{ ts: "", score: 0 }]),
    [data],
  );
  const maxScore = useMemo(
    () => Math.max(0, ...safeData.map((d) => Number(d.score) || 0)),
    [safeData],
  );

  if (!R) {
    return (
      <div className="grid h-40 place-items-center rounded-lg border text-xs text-neutral-500">
        График недоступен
      </div>
    );
  }

  const { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } = R;

  return (
    <div className="h-40 w-full">
      <ResponsiveContainer>
        <LineChart data={safeData}>
          <XAxis dataKey="ts" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 10 }} domain={[0, maxScore + 1]} />
          <Tooltip />
          <Line type="monotone" dataKey="score" dot={false} strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
