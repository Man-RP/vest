import isMatchingSeverityProfile from 'isMatchingSeverityProfile';
import type { TSeverityGroup } from 'resultKeys';
import { useTestObjects } from 'stateHooks';

type TFieldMessages = string[];
type TAllFailures = Record<string, TFieldMessages>;

const collectFailureMessages = (
  severity: TSeverityGroup,
  options: { group?: string; fieldName?: string }
) => {
  const [testObjects] = useTestObjects();
  const { group, fieldName } = options || {};
  const res = testObjects.reduce((collector, testObject) => {
    if (group && testObject.groupName !== group) {
      return collector;
    }

    if (fieldName && testObject.fieldName !== fieldName) {
      return collector;
    }

    if (!testObject.failed) {
      return collector;
    }

    if (isMatchingSeverityProfile(severity, testObject)) {
      return collector;
    }

    collector[testObject.fieldName] = (
      collector[testObject.fieldName] || []
    ).concat(testObject.statement as string);

    return collector;
  }, {} as TAllFailures);

  if (fieldName) {
    return res[fieldName] || [];
  } else {
    return res;
  }
};

export default collectFailureMessages;
