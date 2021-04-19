import { hasLogic } from 'hasFailures';
import type { TSeverityGroup } from 'resultKeys';
import { useTestObjects } from 'stateHooks';
/**
 * Checks whether there are failures in a given group.
 * @param {'warn'|'error'} severityKey    Severity filter.
 * @param {string} group                  Group name.
 * @param {string} [fieldName]            Field name.
 * @return {boolean}
 */
const hasByGroup = (
  severityKey: TSeverityGroup,
  group: string,
  fieldName?: string
): boolean => {
  const [testObjects] = useTestObjects();
  return testObjects.some(testObject => {
    if (group !== testObject.groupName) {
      return false;
    }
    return hasLogic(testObject, severityKey, fieldName);
  });
};

export default hasByGroup;
