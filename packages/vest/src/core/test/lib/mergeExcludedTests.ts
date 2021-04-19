import type VestTest from 'VestTest';
import { isExcluded } from 'exclusive';
import { useTestObjects } from 'stateHooks';

/**
 * Merges excluded tests with their prevState values.
 */
export default function mergeExcludedTests(prevState: VestTest[]): void {
  const [, setTestObjects] = useTestObjects();
  setTestObjects(state =>
    state.concat(
      (prevState || []).reduce((movedTests, testObject) => {
        // Checking prev-test object against current state;
        if (isExcluded(testObject)) {
          return movedTests.concat(testObject);
        }

        return movedTests;
      }, [] as VestTest[])
    )
  );
}
