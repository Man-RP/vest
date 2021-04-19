import bindNot from 'bindNot';

export function isNull(value: any): boolean {
  return value === null;
}

export const isNotNull = bindNot(isNull);
