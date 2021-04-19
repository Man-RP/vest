import createState from 'vast';

import type VestTest from 'VestTest';
import type { TDoneCallback } from 'produce';

export default function createStateRef({
  suiteId,
  name,
}: {
  suiteId: string;
  name: string | void;
}) {
  const state = createState(() => {
    // handlers.forEach(fn =>
    //   fn({
    //     suiteState: stateRef,
    //     type: 'suiteStateUpdate',
    //   })
    // );
  });

  const stateRef = {
    optionalFields: state.registerStateKey<Record<string, boolean>>(() => ({})),
    pending: state.registerStateKey<{
      pending: VestTest[];
      lagging: VestTest[];
    }>(() => ({
      pending: [],
      lagging: [],
    })),
    skippedTests: state.registerStateKey<VestTest[]>(() => []),
    suiteId: state.registerStateKey<{ id: string; name: string | void }>(
      () => ({ id: suiteId, name })
    ),
    testCallbacks: state.registerStateKey<{
      fieldCallbacks: Record<string, TDoneCallback[]>;
      doneCallbacks: TDoneCallback[];
    }>(() => ({
      fieldCallbacks: {},
      doneCallbacks: [],
    })),
    testObjects: state.registerStateKey<VestTest[]>(() => []),
  };

  return { state, stateRef };
}
