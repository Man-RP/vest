import bindNot from 'bindNot';

export function isTruthy(value: any): boolean {
  return !!value;
}

export const isFalsy = bindNot(isTruthy);
