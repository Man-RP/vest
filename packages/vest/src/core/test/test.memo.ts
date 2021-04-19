import addTestToState from 'addTestToState';
import createCache from 'cache';
import isPromise from 'isPromise';
import { setPending } from 'pending';
import type VestTest from 'VestTest';
import { useSuiteId } from 'stateHooks';
import withArgs from 'withArgs';

import { isExcluded } from 'exclusive';
import { isNull } from 'isNull';
import runAsyncTest from 'runAsyncTest';

type TMemoArgs =
  | [string, () => void | Promise<string | void>, boolean, any[]]
  | [string, string, () => void | Promise<string | void>, boolean, any[]];

/* eslint-disable jest/no-export */
export default function bindTestMemo(test: Function) {
  const cache = createCache(100); // arbitrary cache size

  function memo(fieldName: string, args: TMemoArgs): VestTest {
    const [suiteId] = useSuiteId();

    const [deps, testFn, msg] = args.reverse();

    // Implicit dependency for more specificity
    const dependencies = [suiteId.id, fieldName].concat(deps as any[]);

    const cached = cache.get(dependencies);

    if (isNull(cached)) {
      // Cache miss. Start fresh
      return cache(dependencies, test.bind(null, fieldName, msg, testFn));
    }

    const [, testObject] = cached;

    if (isExcluded(testObject)) {
      return testObject;
    }

    addTestToState(testObject);

    if (testObject && isPromise(testObject.asyncTest)) {
      setPending(testObject);
      runAsyncTest(testObject);
    }

    return testObject;
  }

  // @ts-ignore
  test.memo = withArgs(memo);
}
