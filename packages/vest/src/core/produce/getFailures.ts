import collectFailureMessages from 'collectFailureMessages';
import type { TSeverityGroup } from 'resultKeys';
/**
 * @param {'errors'|'warnings'} severityKey lookup severity
 * @param {string} [fieldName]
 * @returns suite or field's errors or warnings.
 */
export default function getFailures(
  severityKey: TSeverityGroup,
  fieldName?: string
) {
  return collectFailureMessages(severityKey, { fieldName });
}
