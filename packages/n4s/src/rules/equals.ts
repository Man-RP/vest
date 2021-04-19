import bindNot from 'bindNot';

export function equals(value: any, arg1: any): boolean {
  return value === arg1;
}

export const notEquals = bindNot(equals);
