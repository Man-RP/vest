import { isNumeric } from 'isNumeric';

export function greaterThan(value: any, arg1: any): boolean {
  return isNumeric(value) && isNumeric(arg1) && Number(value) > Number(arg1);
}
