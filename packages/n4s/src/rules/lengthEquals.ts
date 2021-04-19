import bindNot from 'bindNot';

export function lengthEquals(value: any, arg1: any): boolean {
  return value.length === Number(arg1);
}

export const lengthNotEquals = bindNot(lengthEquals);
