import isFunction from 'isFunction';

/**
 * Takes a value. If it is a function, runs it and returns the result.
 * Otherwise, returns the value as is.
 *
 */
export default function optionalFunctionValue(value: any, args?: any[]): any {
  return isFunction(value) ? value.apply(null, args) : value;
}
