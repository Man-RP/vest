import hasOwnProperty from 'hasOwnProperty';

import { isBoolean } from 'isBoolean';
import { isEmpty } from 'isEmpty';
import { isNull } from 'isNull';
import { isUndefined } from 'isUndefined';
import { HAS_WARNINGS, HAS_ERRORS } from 'sharedKeys';

export default class RuleResult {
  isArray: boolean = false;
  warn: boolean = false;
  hasWarnings: boolean = false;
  failed: boolean = false;
  hasErrors: boolean = false;
  children: void | Record<string, RuleResult> = undefined;
  /**
   * Stores a rule result in an easy to inspect and manipulate structure.
   */
  constructor(ruleRunResult?: boolean | RuleResult) {
    if (isUndefined(ruleRunResult)) {
      return;
    }

    if (isBoolean(ruleRunResult)) {
      this.setFailed(!ruleRunResult);
    } else {
      this.extend(ruleRunResult);
    }
  }

  /**
   * Determines whether a given value is a RuleResult instance
   */
  static is(res: any): res is RuleResult {
    return res instanceof RuleResult;
  }
  /**
   * Marks the current result object as an array
   */
  asArray() {
    this.isArray = true;
    return this;
  }

  setAttribute(key: string, value: any) {
    // @ts-ignore
    this[key] = value;
    return this;
  }

  setFailed(failed: boolean) {
    this.setAttribute(this.warn ? HAS_WARNINGS : HAS_ERRORS, failed);
    return this.setAttribute('failed', failed);
  }

  /**
   * Adds a nested result object
   */
  setChild(key: string, child: RuleResult) {
    if (isNull(child)) {
      return null;
    }

    const isWarning =
      this[HAS_WARNINGS] || child[HAS_WARNINGS] || child.warn || this.warn;
    this.setAttribute(HAS_WARNINGS, (isWarning && child.failed) || false);
    this.setAttribute(
      HAS_ERRORS,
      this[HAS_ERRORS] ||
        child[HAS_ERRORS] ||
        (!isWarning && child.failed) ||
        false
    );
    this.setFailed(this.failed || child.failed);
    this.children = this.children || {};
    this.children[key] = child;
    return child;
  }

  /**
   * Retrieves a child by its key
   */
  getChild(key: string) {
    return (this.children || {})[key];
  }

  /**
   * Extends current instance with a new provided result
   */
  extend(newRes?: boolean | RuleResult) {
    if (isNull(newRes)) {
      return this;
    }

    const res = RuleResult.is(newRes)
      ? newRes
      : new RuleResult().setAttribute('warn', !!this.warn).setFailed(!newRes);

    const failed = this.failed || res.failed;

    const children = mergeChildren(res, this).children;

    Object.assign(this, res);
    if (!isEmpty(children)) {
      this.children = children;
    }

    this.setFailed(failed);
    this.setAttribute(
      HAS_WARNINGS,
      !!(this[HAS_WARNINGS] || res[HAS_WARNINGS])
    );
    this.setAttribute(HAS_ERRORS, !!(this[HAS_ERRORS] || res[HAS_ERRORS]));
  }

  get pass() {
    return !this.failed;
  }
}

/**
 * Deeply merge the nested children of compound rules
 */
function mergeChildren(base?: RuleResult, add?: RuleResult): RuleResult {
  const isRuleResultBase = RuleResult.is(base);
  const isRuleResultAdd = RuleResult.is(add);

  // If both base and add are result objects
  if (isRuleResultBase && isRuleResultAdd) {
    // Use failed if either is failing
    base!.setFailed(base!.failed || add!.failed);

    // If neither has a children object, or the children object is
    if (isEmpty(base!.children) && isEmpty(add!.children)) {
      return base as RuleResult;
    }
    // If both have a children object
    if (base!.children && add!.children) {
      // Merge all the "right side" children back to base
      for (const key in base!.children) {
        mergeChildren(base!.children[key], add!.children[key]);
      }

      // If a child exists in "add" but not in "base", just copy the child as is
      for (const key in add!.children) {
        if (!hasOwnProperty(base!.children, key)) {
          base!.setChild(key, add!.children[key]);
        }
      }

      // Return the modified base object
      return base as RuleResult;

      // If base has no children (but add does)
    } else if (!base!.children) {
      // Use add's children
      base!.children = add!.children;

      // If add has no children
    } else if (!add!.children) {
      // return base as is
      return base as RuleResult;
    }
    // If only base is `RuleResult`
  } else if (isRuleResultBase) {
    // Return base as is
    return base as RuleResult;

    // If only add is RuleResult
  } else if (isRuleResultAdd) {
    // Return add as is
    return add as RuleResult;
  }

  // That's a weird case. Let's fail. Very unlikely.
  return new RuleResult(false);
}
