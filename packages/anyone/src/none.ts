import run from 'runAnyoneMethods';
import withArgs from 'withArgs';

/**
 * Checks that at none of the passed arguments evaluate to a truthy value.
 */
const none = (args: any[]): boolean => args.every(arg => !run(arg));

export default withArgs(none);
