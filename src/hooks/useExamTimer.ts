import { useEffect, useRef, useState } from "react";

export type TimerInfo = {
  remainingMs: number;
  elapsedMs: number;
  expired: boolean;
};

// Warning thresholds in minutes remaining.
export const WARN_MINUTES = [30, 15, 5] as const;

type WarnFn = (minutesRemaining: number) => void;

export function useExamTimer({
  startedAt,
  durationMs,
  enabled = true,
  onWarn,
  onExpire,
}: {
  startedAt: number;
  durationMs: number;
  enabled?: boolean;
  onWarn?: WarnFn;
  onExpire?: () => void;
}): TimerInfo {
  const compute = (): TimerInfo => {
    const elapsedMs = Date.now() - startedAt;
    const remainingMs = Math.max(0, durationMs - elapsedMs);
    return { elapsedMs, remainingMs, expired: remainingMs <= 0 };
  };

  const [info, setInfo] = useState<TimerInfo>(compute);
  const firedWarns = useRef<Set<number>>(new Set());
  const firedExpire = useRef(false);

  useEffect(() => {
    if (!enabled) return;
    const id = window.setInterval(() => {
      const next = compute();
      setInfo(next);

      const minsLeft = Math.ceil(next.remainingMs / 60000);
      for (const m of WARN_MINUTES) {
        if (
          minsLeft === m &&
          !firedWarns.current.has(m) &&
          next.remainingMs > 0
        ) {
          firedWarns.current.add(m);
          onWarn?.(m);
        }
      }

      if (next.expired && !firedExpire.current) {
        firedExpire.current = true;
        onExpire?.();
      }
    }, 1000);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startedAt, durationMs, enabled]);

  return info;
}
