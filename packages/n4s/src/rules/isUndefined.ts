import bindNot from 'bindNot';

export function isUndefined(value: any): boolean {
  return value === undefined;
}

export const isNotUndefined = bindNot(isUndefined);
