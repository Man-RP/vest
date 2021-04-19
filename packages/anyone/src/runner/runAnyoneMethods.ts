import isFunction from 'isFunction';

const run = (arg: any): boolean => {
  if (isFunction(arg)) {
    try {
      return check(arg());
    } catch (err) {
      return false;
    }
  }

  return check(arg);
};

const check = (value: any): boolean =>
  Array.isArray(value) ? true : value != false && Boolean(value); // eslint-disable-line

export default run;
