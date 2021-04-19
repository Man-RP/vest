import bindNot from 'bindNot';
import isString from 'isStringValue';

export function endsWith(value: any, arg1: any): boolean {
  return isString(value) && isString(arg1) && value.endsWith(arg1);
}

export const doesNotEndWith = bindNot(endsWith);
