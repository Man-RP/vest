import type VestTest from 'VestTest';

import { SEVERITY_GROUP_WARN } from 'resultKeys';
import type { TSeverityGroup } from 'resultKeys';

/**
 * Checks that a given test object matches the currently specified severity level
 * @param {string} severity       Represents severity level
 * @param {VestTest} testObject   VestTest instance
 * @returns {boolean}
 */
export default function isMatchingSeverityProfile(
  severity: TSeverityGroup,
  testObject: VestTest
): boolean {
  return (
    (severity !== SEVERITY_GROUP_WARN && testObject.isWarning) ||
    (severity === SEVERITY_GROUP_WARN && !testObject.isWarning)
  );
}
