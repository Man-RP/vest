import hasOwnProperty from 'hasOwnProperty';

import type VestTest from 'VestTest';
import asArray from 'asArray';
import context from 'ctx';
import { ERROR_HOOK_CALLED_OUTSIDE } from 'hookErrors';
import isFunction from 'isFunction';
import isStringValue from 'isStringValue';
import {
  EXCLUSION_ITEM_TYPE_TESTS,
  EXCLUSION_ITEM_TYPE_GROUPS,
} from 'runnableTypes';
import throwError from 'throwError';

type TExclusionItem = string | string[];

/**
 * Adds a field or multiple fields to inclusion group.
 * @param {String[]|String} item Item to be added to inclusion group.
 */
export function only(item: TExclusionItem) {
  return addTo(EXCLUSION_GROUP_NAME_ONLY, EXCLUSION_ITEM_TYPE_TESTS, item);
}

only.group = (item: TExclusionItem) =>
  addTo(EXCLUSION_GROUP_NAME_ONLY, EXCLUSION_ITEM_TYPE_GROUPS, item);

/**
 * Adds a field or multiple fields to exclusion group.
 * @param {String[]|String} item Item to be added to exclusion group.
 */
export function skip(item: TExclusionItem) {
  return addTo(EXCLUSION_GROUP_NAME_SKIP, EXCLUSION_ITEM_TYPE_TESTS, item);
}

skip.group = (item: TExclusionItem) =>
  addTo(EXCLUSION_GROUP_NAME_SKIP, EXCLUSION_ITEM_TYPE_GROUPS, item);

/**
 * Conditionally skips nested test callbacks
 * @param {boolean} shouldSkip
 * @param {Function} callback
 */
export function skipWhen(shouldSkip: boolean, callback: () => void) {
  if (isFunction(callback)) {
    context.run({ skip: !!shouldSkip }, () => callback());
  }
}

/**
 * Checks whether a certain test profile excluded by any of the exclusion groups.
 * @param {String} fieldName    Field name to test.
 * @param {VestTest}            Test Object reference.
 * @returns {Boolean}
 */
export function isExcluded(testObject: VestTest): boolean {
  const { fieldName, groupName } = testObject;

  const ctx = context.use();

  if (!ctx || !ctx.exclusion) {
    return false;
  }

  const keyTests = ctx.exclusion[EXCLUSION_ITEM_TYPE_TESTS];
  const testValue = keyTests[fieldName];

  // if test is skipped
  // no need to proceed
  if (testValue === false) {
    return true;
  }

  const isTestIncluded = testValue === true;

  // If inside a group
  if (groupName) {
    if (isGroupExcluded(groupName)) {
      return true; // field excluded by group

      // if group is `only`ed
    } else if (ctx.exclusion[EXCLUSION_ITEM_TYPE_GROUPS][groupName] === true) {
      if (isTestIncluded) {
        return false;
      }

      // If there is _ANY_ `only`ed test (and we already know this one isn't)
      if (hasIncludedTests(keyTests)) {
        return true; // Excluded implicitly
      }

      return keyTests[fieldName] === false;
    }
  }

  // if field is only'ed
  if (isTestIncluded) {
    return false;
  }

  // If there is _ANY_ `only`ed test (and we already know this one isn't) return true
  // Otherwise return false
  return hasIncludedTests(keyTests);
}

/**
 * Checks whether a given group is excluded from running.
 * @param {String} groupName
 * @return {Boolean}
 */
export function isGroupExcluded(groupName: string): boolean {
  const ctx = context.use();

  if (!ctx || !ctx.exclusion) {
    return false;
  }

  const keyGroups = ctx.exclusion[EXCLUSION_ITEM_TYPE_GROUPS];

  const groupPresent = hasOwnProperty(keyGroups, groupName);

  // When group is either only'ed or skipped
  if (groupPresent) {
    // Return true if group is skipped and false if only'ed
    return keyGroups[groupName] === false;
  }

  // Group is not present
  for (const group in keyGroups) {
    // If any other group is only'ed
    if (keyGroups[group] === true) {
      return true;
    }
  }

  return false;
}

/**
 * @type {String} Exclusion group name: only.
 */
const EXCLUSION_GROUP_NAME_ONLY = 'only';

/**
 * @type {String} Exclusion group name: skip.
 */
const EXCLUSION_GROUP_NAME_SKIP = 'skip';

/**
 * Adds fields to a specified exclusion group.
 * @param {String} exclusionGroup   To add the fields to.
 * @param {String} itemType         Whether the item is a group or a test.
 * @param {String[]|String} item    A field name or a list of field names.
 */
const addTo = (
  exclusionGroup: string,
  itemType: 'tests' | 'groups',
  item?: TExclusionItem
): void => {
  const ctx = context.use();
  if (!item) {
    return;
  }

  if (!ctx) {
    throwError(`${exclusionGroup} ${ERROR_HOOK_CALLED_OUTSIDE}`);
    return;
  }

  asArray(item).forEach(itemName => {
    if (!isStringValue(itemName) || !ctx.exclusion) {
      return null;
    }

    if (!ctx || !ctx.exclusion) {
      return;
    }

    ctx.exclusion[itemType][itemName] =
      exclusionGroup === EXCLUSION_GROUP_NAME_ONLY;
  });
};

/**
 * Checks if context has included tests
 * @param {Object} keyTests Object containing included and excluded tests
 * @returns {boolean}
 */
const hasIncludedTests = (keyTests: Record<string, boolean>): boolean => {
  for (const test in keyTests) {
    if (keyTests[test] === true) {
      return true; // excluded implicitly
    }
  }
  return false;
};
