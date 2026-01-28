import { calculateRemaining } from './timerEngine';

describe('calculateRemaining', () => {
  it('Start -> wait 5s -> remaining decreases by 5', () => {
    const durationSec = 25;
    const startedAtMs = 0;
    const totalPausedMs = 0;

    const remainingAtStart = calculateRemaining(
      durationSec,
      startedAtMs,
      totalPausedMs,
      0,
      'running'
    );

    const remainingAfter5s = calculateRemaining(
      durationSec,
      startedAtMs,
      totalPausedMs,
      5_000,
      'running'
    );

    expect(remainingAtStart - remainingAfter5s).toBe(5);
  });
});
