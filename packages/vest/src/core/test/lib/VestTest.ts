import id from 'genId';
import { removePending } from 'pending';
import removeTestFromState from 'removeTestFromState';

export type TTestCallbackType = () => void | boolean | Promise<string | void>;

class VestTest {
  fieldName: string;
  statement: string | void;
  testFn: TTestCallbackType;
  failed: boolean;
  isWarning: boolean;
  id: string;
  groupName: string | void;
  canceled: boolean;
  asyncTest?: Promise<void | string> | void;

  constructor({
    fieldName,
    statement,
    testFn,
    group,
  }: {
    fieldName: string;
    statement?: string;
    testFn: TTestCallbackType;
    group?: string;
  }) {
    this.failed = false;
    this.fieldName = fieldName;
    this.id = id();
    this.isWarning = false;
    this.statement = statement;
    this.testFn = testFn;
    this.canceled = false;

    if (group) {
      this.groupName = group;
    }
  }

  /**
   * @returns {Boolean} Current validity status of a test.
   */
  valueOf() {
    return this.failed !== true;
  }

  /**
   * Sets a test to failed.
   */
  fail() {
    this.failed = true;
  }

  /**
   * Sets a current test's `isWarning` to true.
   */
  warn() {
    this.isWarning = true;
  }

  /**
   * Marks a test as canceled, removes it from the state.
   * This function needs to be called within a stateRef context.
   */
  cancel() {
    this.canceled = true;
    removePending(this);
    removeTestFromState(this);
  }
}

export default VestTest;
