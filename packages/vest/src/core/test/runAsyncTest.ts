import type VestTest from 'VestTest';
import callEach from 'callEach';
import context from 'ctx';
import hasRemainingTests from 'hasRemainingTests';
import isStringValue from 'isStringValue';
import { removePending } from 'pending';
import { useTestCallbacks, useTestObjects } from 'stateHooks';

/**
 * Runs async test.
 * @param {VestTest} testObject A VestTest instance.
 */
const runAsyncTest = (testObject: VestTest): void => {
  const { asyncTest, statement } = testObject;

  const ctx = context.use();

  if (!ctx || !ctx.stateRef || !asyncTest) {
    return;
  }

  const done = context.bind({ stateRef: ctx.stateRef }, () => {
    removePending(testObject);

    // This is for cases in which the suite state was already reset
    if (testObject.canceled) {
      return;
    }

    // Perform required done callback calls and cleanups after the test is finished
    runDoneCallbacks(testObject.fieldName);
  });
  const fail = context.bind({ stateRef: ctx.stateRef }, rejectionMessage => {
    testObject.statement = isStringValue(rejectionMessage)
      ? rejectionMessage
      : statement;
    testObject.fail();

    // Spreading the array to invalidate the cache
    const [, setTestObjects] = useTestObjects();
    setTestObjects(testObjects => testObjects.slice());
    done();
  });
  try {
    asyncTest.then(done, fail);
  } catch (e) {
    fail();
  }
};

/**
 * Runs done callback when async tests are finished running.
 * @param {string} [fieldName] Field name with associated callbacks.
 */
const runDoneCallbacks = (fieldName?: string): void => {
  const [{ fieldCallbacks, doneCallbacks }] = useTestCallbacks();

  if (fieldName) {
    if (
      !hasRemainingTests(fieldName) &&
      Array.isArray(fieldCallbacks[fieldName])
    ) {
      callEach(fieldCallbacks[fieldName]);
    }
  }
  if (!hasRemainingTests()) {
    callEach(doneCallbacks);
  }
};

export default runAsyncTest;
