/**
 * Stores values and configuration passed down to compound rules.
 *
 * @param {Object} content
 */
export default class EnforceContext {
  obj?: Record<string, any>;
  key?: string | number;
  value: any;
  failFast?: boolean;

  constructor(content: {
    value: any;
    key?: string | number;
    obj?: Record<string, any>;
  }) {
    Object.assign(this, content);
  }

  /**
   * Sets an EnforceContext config `failFast`
   */
  setFailFast(failFast: boolean) {
    this.failFast = !!failFast;
    return this;
  }

  /**
   * Extracts the literal value from an EnforceContext object
   * @param {*} value
   * @return {*}
   */
  static unwrap(value: any): any {
    return EnforceContext.is(value) ? value.value : value;
  }

  /**
   * Wraps a literal value within a context.
   */
  static wrap(value: any): EnforceContext {
    return EnforceContext.is(value) ? value : new EnforceContext({ value });
  }

  /**
   * Checks whether a given value is an EnforceContext instance
   */
  static is(value: any): value is EnforceContext {
    return value instanceof EnforceContext;
  }
}
