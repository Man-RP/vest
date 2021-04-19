import hasOwnProperty from 'hasOwnProperty';

import isFunction from 'isFunction';
import isRule from 'isRule';
import proxySupported from 'proxySupported';
import runtimeRules from 'runtimeRules';

// Creates a proxy object that has access to all the rules
export default function genRuleProxy<
  T extends Record<string, Function> | (Function & Record<string, Function>)
>(target: T, output: (ruleName: string) => T) {
  if (proxySupported()) {
    return new Proxy(target, {
      get: (target: T, fnName: string) => {
        // A faster bailout when we access `run` and `test`
        if (hasOwnProperty(target, fnName)) {
          return target[fnName];
        }
        if (isRule(fnName)) {
          return output(fnName);
        }

        return target[fnName] as any;
      },
    });
  } else {
    /**
     * This method is REALLY not recommended as it is slow and iterates over
     * all the rules for each direct enforce reference. We only use it as a
     * lightweight alternative for the much faster proxy interface
     */
    for (const fnName in runtimeRules) {
      if (!isFunction(target[fnName])) {
        Object.defineProperties(target, {
          [fnName]: { get: () => output(fnName) },
        });
      }
    }
    return target;
  }
}
