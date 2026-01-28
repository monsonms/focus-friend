import { useEffect, useMemo, useState } from 'react';

import { useSessionStore } from '../stores/sessionStore';
import { calculateRemaining } from '../utils/timerEngine';

function formatSeconds(totalSeconds: number) {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function useTimerTick() {
  const durationSec = useSessionStore((s) => s.durationSec);
  const startedAtMs = useSessionStore((s) => s.startedAtMs);
  const totalPausedMs = useSessionStore((s) => s.totalPausedMs);
  const status = useSessionStore((s) => s.status);
  const complete = useSessionStore((s) => s.complete);

  const [remainingSec, setRemainingSec] = useState(() =>
    calculateRemaining(durationSec, startedAtMs, totalPausedMs, Date.now(), status)
  );

  useEffect(() => {
    const tick = () => {
      const nextRemaining = calculateRemaining(
        durationSec,
        startedAtMs,
        totalPausedMs,
        Date.now(),
        status
      );

      setRemainingSec(nextRemaining);

      if (nextRemaining === 0 && status === 'running') {
        complete();
      }
    };

    tick();
    const intervalId = setInterval(tick, 1000);
    return () => clearInterval(intervalId);
  }, [complete, durationSec, startedAtMs, status, totalPausedMs]);

  const formattedTime = useMemo(() => formatSeconds(remainingSec), [remainingSec]);

  return { remainingSec, formattedTime };
}
