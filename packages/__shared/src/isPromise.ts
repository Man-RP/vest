import isFunction from 'isFunction';

export default function isPromise(value: any): value is Promise<any> {
  return value && isFunction(value.then);
}
