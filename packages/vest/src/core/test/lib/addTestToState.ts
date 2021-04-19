import type VestTest from 'VestTest';
import { useTestObjects } from 'stateHooks';

export default (testObject: VestTest): void => {
  const [, setTestObjects] = useTestObjects();
  setTestObjects(testObjects => testObjects.concat(testObject));
};
