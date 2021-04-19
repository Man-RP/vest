import { isNumeric } from 'isNumeric';

export function greaterThanOrEquals(value: any, arg1: any): boolean {
  return isNumeric(value) && isNumeric(arg1) && Number(value) >= Number(arg1);
}
