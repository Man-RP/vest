export default function bindNot<T extends Function>(
  fn: T
  // @ts-ignore
): (...args: Parameters<T>) => boolean {
  // @ts-ignore
  return function () {
    // @ts-ignore
    return !fn.apply(this, arguments);
  };
}
