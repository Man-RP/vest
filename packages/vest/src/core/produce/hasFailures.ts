import type VestTest from 'VestTest';
import isMatchingSeverityProfile from 'isMatchingSeverityProfile';
import type { TSeverityGroup } from 'resultKeys';
import { useTestObjects } from 'stateHooks';

export const hasLogic = (
  testObject: VestTest,
  severityKey: TSeverityGroup,
  fieldName?: string
): boolean => {
  if (!testObject.failed) {
    return false;
  }

  if (fieldName && fieldName !== testObject.fieldName) {
    return false;
  }

  if (isMatchingSeverityProfile(severityKey, testObject)) {
    return false;
  }

  return true;
};

const has = (severityKey: TSeverityGroup, fieldName?: string): boolean => {
  const [testObjects] = useTestObjects();
  return testObjects.some(testObject =>
    hasLogic(testObject, severityKey, fieldName)
  );
};

export default has;
