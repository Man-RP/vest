import EnforceContext from 'EnforceContext';
import type RuleResult from 'RuleResult';

/**
 * Determines whether we should bail out of an enforcement.
 */
export default function shouldFailFast(
  ctx: EnforceContext,
  result: RuleResult
): boolean {
  if (result.pass || result.warn) {
    return false;
  }

  return !!EnforceContext.is(ctx) && ctx.failFast === true;
}
