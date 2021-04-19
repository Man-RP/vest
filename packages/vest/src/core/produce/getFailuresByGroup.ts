import collectFailureMessages from 'collectFailureMessages';
import type { TSeverityGroup } from 'resultKeys';
import throwError from 'throwError';

const getByGroup = (
  severityKey: TSeverityGroup,
  group: string,
  fieldName?: string
) => {
  if (!group) {
    throwError(
      `get${severityKey[0].toUpperCase()}${severityKey.slice(
        1
      )}ByGroup requires a group name. Received \`${group}\` instead.`
    );
  }

  return collectFailureMessages(severityKey, { group, fieldName });
};

export default getByGroup;
