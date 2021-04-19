import ctx from 'ctx';

// @ts-ignore
const getStateRef = () => ctx.use().stateRef;

export function usePending() {
  // @ts-ignore
  return getStateRef().pending();
}
export function useSuiteId() {
  // @ts-ignore
  return getStateRef().suiteId();
}
export function useTestCallbacks() {
  // @ts-ignore
  return getStateRef().testCallbacks();
}
export function useTestObjects() {
  // @ts-ignore
  return getStateRef().testObjects();
}
export function useSkippedTests() {
  // @ts-ignore
  return getStateRef().skippedTests();
}
export function useOptionalFields() {
  // @ts-ignore
  return getStateRef().optionalFields();
}
