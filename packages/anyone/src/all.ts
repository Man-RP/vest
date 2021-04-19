import run from 'runAnyoneMethods';
import withArgs from 'withArgs';

/**
 * Checks that at all the passed argument evaluate to a truthy value.
 */
const all = (args: any[]): boolean => args.every(run);

export default withArgs(all);
