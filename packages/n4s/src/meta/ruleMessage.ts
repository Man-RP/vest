import EnforceContext from 'EnforceContext';
import optionalFunctionValue from 'optionalFunctionValue';

export default function message(value: any, msg: string | (() => string)) {
  return optionalFunctionValue(msg, [EnforceContext.unwrap(value)]);
}
