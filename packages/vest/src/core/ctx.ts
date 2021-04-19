import createContext from 'context';
import type createStateRef from 'createStateRef';
import type VestTest from 'VestTest';

import {
  EXCLUSION_ITEM_TYPE_TESTS,
  EXCLUSION_ITEM_TYPE_GROUPS,
} from 'runnableTypes';

type TStateRef = ReturnType<typeof createStateRef>;
type TCtxExclusion = {
  tests: Record<string, boolean>;
  groups: Record<string, boolean>;
};

const context = createContext<{
  stateRef?: TStateRef['stateRef'];
  exclusion?: TCtxExclusion;
  currentTest?: VestTest;
  groupName?: string;
  skip?: boolean;
}>((ctxRef, parentContext) =>
  parentContext
    ? null
    : Object.assign(
        {},
        {
          exclusion: {
            [EXCLUSION_ITEM_TYPE_TESTS]: {},
            [EXCLUSION_ITEM_TYPE_GROUPS]: {},
          },
        },
        ctxRef
      )
);

export default context;
