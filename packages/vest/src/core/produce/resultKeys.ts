export const SEVERITY_GROUP_WARN = 'warnings';
export const SEVERITY_COUNT_WARN = 'warnCount';
export const SEVERITY_GROUP_ERROR = 'errors';
export const SEVERITY_COUNT_ERROR = 'errorCount';
export const TEST_COUNT = 'testCount';

export type TSeverityGroup =
  | typeof SEVERITY_GROUP_ERROR
  | typeof SEVERITY_GROUP_WARN;
