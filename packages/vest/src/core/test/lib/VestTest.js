import id from 'genId';
import { removePending } from 'pending';
import removeTestFromState from 'removeTestFromState';
import * as testStatuses from 'testStatuses';

/**
 * Describes a test call inside a Vest suite.
 * @param {String} fieldName            Name of the field being tested.
 * @param {String} statement            The message returned when failing.
 * @param {Promise|Function} testFn     The actual test callback or promise.
 * @param {string} [group]              The group in which the test runs.
 */

function VestTest({ fieldName, statement, testFn, group }) {
  const testObject = {
    cancel,
    fail,
    fieldName,
    id: id(),
    isWarning: false,
    setStatus,
    statement,
    status: testStatuses.UNTESTED,
    testFn,
    valueOf,
    warn,
  };

  if (group) {
    testObject.groupName = group;
  }

  return testObject;

  /**
   * @returns {Boolean} Current validity status of a test.
   */
  function valueOf() {
    return testObject.status !== testStatuses.FAILED;
  }

  /**
   * Sets a test to failed.
   */
  function fail() {
    setStatus(testStatuses.FAILED);
  }

  /**
   * Sets a current test's `isWarning` to true.
   */
  function warn() {
    testObject.isWarning = true;
  }

  /**
   * Marks a test as canceled, removes it from the state.
   * This function needs to be called within a stateRef context.
   */
  function cancel() {
    setStatus(testStatuses.CANCELLED);
    removePending(testObject);
    removeTestFromState(testObject);
  }

  function setStatus(status) {
    // cancelled and failed are terminal statuses
    if (
      testObject.status === testStatuses.CANCELLED ||
      testObject.status === testStatuses.FAILED
    ) {
      return;
    }

    testObject.status = status;
  }
}

export default VestTest;
