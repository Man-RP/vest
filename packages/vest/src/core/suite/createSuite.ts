import type { ProduceResult } from 'produce';
import asArray from 'asArray';
import createStateRef from 'createStateRef';
import context from 'ctx';
import genId from 'genId';
import isFunction from 'isFunction';
import mergeExcludedTests from 'mergeExcludedTests';
import produce from 'produce';
import { usePending, useTestObjects } from 'stateHooks';
import throwError from 'throwError';
import withArgs from 'withArgs';

function createSuite(
  args: [string, () => void] | [() => void]
): TCreateSuiteResult {
  const [tests, name] = args.reverse() as [() => void, string | void];

  if (!isFunction(tests)) {
    throwError(
      'Suite initialization error. Expected `tests` to be a function.'
    );
  }

  const handlers: Function[] = [];

  const { stateRef, state } = createStateRef({ suiteId: genId(), name });

  /*
    context.bind returns our `validate` function
    We then wrap it with defineProperties to add
    the `get`, and `reset` functions.

  */
  const suite: TCreateSuiteResult = context.bind({ stateRef }, function () {
    const [previousTestObjects] = useTestObjects();
    const [{ pending }, setPending] = usePending();
    state.reset();

    // Move all the active pending tests to the lagging array
    setPending({ lagging: pending, pending: [] });

    // Run the consumer's callback
    tests.apply(null, (arguments as unknown) as []);

    // Merge all the skipped tests with their previous results
    mergeExcludedTests(previousTestObjects);

    return produce();
  });
  // @ts-ignore
  suite.get = context.bind({ stateRef }, produce, /*isDraft:*/ true);
  // @ts-ignore
  suite.reset = state.reset;
  // @ts-ignore
  suite.remove = context.bind({ stateRef }, name => {
    const [testObjects] = useTestObjects();

    // We're mutating the array in `cancel`, so we have to first copy it.
    asArray(testObjects).forEach(testObject => {
      if (testObject.fieldName === name) {
        testObject.cancel();
      }
    });
  });
  // @ts-ignore
  suite.subscribe = function (handler) {
    if (!isFunction(handler)) return;

    handlers.push(handler);

    handler({
      type: 'suiteSubscribeInit',
      suiteState: stateRef,
    });
  };

  return suite;
}

export default withArgs(createSuite);

type TCreateSuiteResult = (...args: any[]) => ProduceResult;
