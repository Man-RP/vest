import run from 'runAnyoneMethods';
import withArgs from 'withArgs';

/**
 * Checks that at least one passed argument evaluates to a truthy value.
 */
const any = (args: any[]): boolean => args.some(run);

export default withArgs(any);
