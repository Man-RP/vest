import type { TTestCallbackType } from 'VestTest';
import type VestTest from 'VestTest';
import asArray from 'asArray';
import optionalFunctionValue from 'optionalFunctionValue';
import throwError from 'throwError';
import withArgs from 'withArgs';
import TestFunction from 'test';

export default function bindTestEach(test: typeof TestFunction) {
  function each(table: any[]) {
    if (!Array.isArray(table)) {
      throwError('test.each: Expected table to be an array.');
    }

    return;
    (
      fieldName: string,
      args: [TTestCallbackType] | [string, TTestCallbackType]
    ): VestTest[] => {
      const [testFn, statement] = args.reverse() as [TTestCallbackType, string];

      return table.map(
        (item): VestTest => {
          item = asArray(item);
          return test(
            optionalFunctionValue(fieldName, item),
            optionalFunctionValue(statement, item),
            () => testFn.apply(null, item)
          );
        }
      );
    };
  }

  // @ts-ignore
  test.each = withArgs(each);
}
