export type TimerStatus = 'idle' | 'running' | 'paused' | 'completed';

export function calculateRemaining(
  durationSec: number,
  startedAtMs: number | undefined,
  totalPausedMs: number,
  nowMs: number,
  status: TimerStatus
): number {
  if (durationSec <= 0) return 0;

  if (status === 'completed') return 0;

  // If we haven't started yet (or timestamps were cleared), we treat this as a full-duration timer.
  if (status === 'idle' || startedAtMs == null) {
    return Math.max(0, Math.floor(durationSec));
  }

  const elapsedMs = Math.max(0, nowMs - startedAtMs - Math.max(0, totalPausedMs));
  const elapsedSec = Math.floor(elapsedMs / 1000);
  const remainingSec = durationSec - elapsedSec;

  return Math.max(0, remainingSec);
}
