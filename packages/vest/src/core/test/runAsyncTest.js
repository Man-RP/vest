import callEach from 'callEach';
import context from 'ctx';
import hasRemainingTests from 'hasRemainingTests';
import isStringValue from 'isStringValue';
import { removePending } from 'pending';
import { useTestCallbacks, useTestObjects } from 'stateHooks';
import * as testStatuses from 'testStatuses';

/**
 * Runs async test.
 * @param {VestTest} testObject A VestTest instance.
 */
const runAsyncTest = testObject => {
  const { asyncTest, statement } = testObject;
  const { stateRef } = context.use();
  const done = context.bind({ stateRef }, () => {
    removePending(testObject);

    switch (testObject.status) {
      // This is for cases in which the suite state was already reset
      case testStatuses.CANCELLED:
        return;
      case testStatuses.PENDING:
        testObject.status = testStatuses.TESTED;
    }

    // Perform required done callback calls and cleanups after the test is finished
    runDoneCallbacks(testObject.fieldName);
  });
  const fail = context.bind({ stateRef }, rejectionMessage => {
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
    testObject.setStatus(testStatuses.PENDING);
    asyncTest.then(done, fail);
  } catch (e) {
    fail();
  }
};

/**
 * Runs done callback when async tests are finished running.
 * @param {string} [fieldName] Field name with associated callbacks.
 */
const runDoneCallbacks = fieldName => {
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
