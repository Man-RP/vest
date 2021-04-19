export default function isFunction(f: any): f is Function {
  return typeof f === 'function';
}
