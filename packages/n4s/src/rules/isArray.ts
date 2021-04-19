import bindNot from 'bindNot';

export function isArray(value: any): value is Array<any> {
  return Boolean(Array.isArray(value));
}

export const isNotArray = bindNot(isArray);
