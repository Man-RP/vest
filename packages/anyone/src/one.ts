import run from 'runAnyoneMethods';
import withArgs from 'withArgs';
/**
 * Checks that at only one passed argument evaluates to a truthy value.
 */
const one = (args: any[]): boolean => {
  let count = 0;

  for (let i = 0; i < args.length; i++) {
    if (run(args[i])) {
      count++;
    }

    if (count > 1) {
      return false;
    }
  }

  if (count !== 1) {
    return false;
  }

  return true;
};

export default withArgs(one);
