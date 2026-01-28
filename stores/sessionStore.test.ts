import { createSessionStore } from './sessionStore';

describe('sessionStore', () => {
  it('Reset -> task name persists, but timer resets', () => {
    const store = createSessionStore();

    store.getState().setTaskName('Pay rent');
    store.getState().start(0);

    // Simulate some time passing.
    const remainingBeforeReset = store.getState().getRemainingSec(5_000);
    expect(remainingBeforeReset).toBeLessThan(store.getState().durationSec);

    store.getState().reset(5_000);

    const stateAfter = store.getState();
    expect(stateAfter.taskName).toBe('Pay rent');
    expect(stateAfter.status).toBe('idle');

    const remainingAfterReset = stateAfter.getRemainingSec(123_000);
    expect(remainingAfterReset).toBe(stateAfter.durationSec);
  });
});
