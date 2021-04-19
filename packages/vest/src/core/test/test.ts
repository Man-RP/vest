import type { TTestCallbackType } from 'VestTest';
import VestTest from 'VestTest';
import addTestToState from 'addTestToState';
import context from 'ctx';
import { isExcluded } from 'exclusive';
import isFunction from 'isFunction';
import isPromise from 'isPromise';
import isStringValue from 'isStringValue';
import { isUndefined } from 'isUndefined';
import { setPending } from 'pending';
import runAsyncTest from 'runAsyncTest';
import { useSkippedTests } from 'stateHooks';
import bindTestEach from 'test.each';
import bindTestMemo from 'test.memo';
import throwError from 'throwError';
import withArgs from 'withArgs';

const sync = (testObject: VestTest): any =>
  context.run({ currentTest: testObject }, () => {
    let result;
    try {
      result = testObject.testFn();
    } catch (e) {
      if (isUndefined(testObject.statement) && isStringValue(e)) {
        testObject.statement = e;
      }
      result = false;
    }

    if (result === false) {
      testObject.fail();
    }

    return result;
  });

const register = (testObject: VestTest): void => {
  addTestToState(testObject);

  // Run test callback.
  // If a promise is returned, set as async and
  // Move to pending list.
  const result = sync(testObject);

  try {
    // try catch for safe property access
    // in case object is an enforce chain
    if (isPromise(result)) {
      testObject.asyncTest = result;
      setPending(testObject);
      runAsyncTest(testObject);
    }
  } catch {
    if (__DEV__) {
      throwError(
        `Your test function ${testObject.fieldName} returned ${JSON.stringify(
          result
        )}. Only "false" or a Promise are supported. Return values may cause unexpected behavior.`
      );
    }
  }
};

/**
 * Test function used by consumer to provide their own validations.
 * @param {String} fieldName            Name of the field to test.
 * @param {String} [statement]          The message returned in case of a failure.
 * @param {function} testFn             The actual test callback.
 * @return {VestTest}                 A VestTest instance.
 *
 * **IMPORTANT**
 * Changes to this function need to reflect in test.memo as well
 */
function test(
  fieldName: string,
  args: [string, TTestCallbackType] | [TTestCallbackType]
): VestTest {
  const ctx = context.use();

  let skip;
  let groupName;

  if (ctx) {
    skip = ctx.skip || false;
    groupName = ctx.groupName;
  }

  const [testFn, statement] = args.reverse() as [TTestCallbackType, string];
  const [, setSkippedTests] = useSkippedTests();

  const testObject = new VestTest({
    fieldName,
    group: groupName,
    statement,
    testFn,
  });

  if (skip || isExcluded(testObject)) {
    setSkippedTests(skippedTests => skippedTests.concat(testObject));
    return testObject;
  }

  if (!isFunction(testFn)) {
    return testObject;
  }

  register(testObject);

  return testObject;
}

const exportedTest = withArgs(test);

bindTestEach(exportedTest);
bindTestMemo(exportedTest);

/* eslint-disable jest/no-export */
export default exportedTest;
