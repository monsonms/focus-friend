import { useStore } from 'zustand';
import { createStore } from 'zustand/vanilla';
import type { TimerStatus } from '../utils/timerEngine';
import { calculateRemaining } from '../utils/timerEngine';

export type SessionStatus = TimerStatus;

export type SessionSnapshot = {
  taskName: string;
  durationSec: number;
  status: SessionStatus;
  startedAtMs?: number;
  pausedAtMs?: number;
  totalPausedMs: number;
};

export type SessionState = SessionSnapshot & {
  setTaskName: (taskName: string) => void;
  setDurationSec: (durationSec: number) => void;

  start: (nowMs: number) => void;
  pause: (nowMs: number) => void;
  complete: () => void;
  reset: (nowMs: number) => void;
  newSession: () => void;

  getRemainingSec: (nowMs: number) => number;

  serialize: () => SessionSnapshot;
  rehydrate: (snapshot: SessionSnapshot) => void;
};

const DEFAULT_DURATION_SEC = 25 * 60;

export function createSessionStore() {
  return createStore<SessionState>()((set, get) => ({
    taskName: '',
    durationSec: DEFAULT_DURATION_SEC,
    status: 'idle',
    startedAtMs: undefined,
    pausedAtMs: undefined,
    totalPausedMs: 0,

    setTaskName: (taskName) => set({ taskName }),

    setDurationSec: (durationSec) => {
      const safeDurationSec = Math.max(0, Math.floor(durationSec));
      set({ durationSec: safeDurationSec });
    },

    start: (nowMs) => {
      const { status, startedAtMs, pausedAtMs, totalPausedMs } = get();

      if (status === 'running') return;

      if (status === 'paused' && startedAtMs != null && pausedAtMs != null) {
        set({
          status: 'running',
          pausedAtMs: undefined,
          totalPausedMs: totalPausedMs + Math.max(0, nowMs - pausedAtMs),
        });
        return;
      }

      set({
        status: 'running',
        startedAtMs: nowMs,
        pausedAtMs: undefined,
        totalPausedMs: 0,
      });
    },

    pause: (nowMs) => {
      const { status } = get();
      if (status !== 'running') return;

      set({ status: 'paused', pausedAtMs: nowMs });
    },

    complete: () => {
      set({ status: 'completed', pausedAtMs: undefined });
    },

    reset: (_nowMs) => {
      const { taskName, durationSec } = get();
      set({
        taskName,
        durationSec,
        status: 'idle',
        startedAtMs: undefined,
        pausedAtMs: undefined,
        totalPausedMs: 0,
      });
    },

    newSession: () => {
      set({
        taskName: '',
        durationSec: DEFAULT_DURATION_SEC,
        status: 'idle',
        startedAtMs: undefined,
        pausedAtMs: undefined,
        totalPausedMs: 0,
      });
    },

    getRemainingSec: (nowMs) => {
      const { durationSec, startedAtMs, totalPausedMs, status } = get();
      return calculateRemaining(durationSec, startedAtMs, totalPausedMs, nowMs, status);
    },

    serialize: () => {
      const { taskName, durationSec, status, startedAtMs, pausedAtMs, totalPausedMs } = get();
      return { taskName, durationSec, status, startedAtMs, pausedAtMs, totalPausedMs };
    },

    rehydrate: (snapshot) => {
      set({
        taskName: snapshot.taskName,
        durationSec: snapshot.durationSec,
        status: snapshot.status,
        startedAtMs: snapshot.startedAtMs,
        pausedAtMs: snapshot.pausedAtMs,
        totalPausedMs: snapshot.totalPausedMs,
      });
    },
  }));
}

export const sessionStore = createSessionStore();

export function useSessionStore<T>(selector: (state: SessionState) => T): T {
  return useStore(sessionStore, selector);
}
