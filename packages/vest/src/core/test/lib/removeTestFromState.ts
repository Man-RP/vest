import type VestTest from 'VestTest';
import asArray from 'asArray';
import { useTestObjects } from 'stateHooks';

import removeElementFromArray from 'removeElementFromArray';

/**
 * Removes test object from suite state
 * @param {VestTest} testObject
 */
export default (testObject: VestTest) => {
  const [, setTestObjects] = useTestObjects();
  setTestObjects(testObjects =>
    // using asArray to clear the cache.
    asArray(removeElementFromArray(testObjects, testObject))
  );
};
