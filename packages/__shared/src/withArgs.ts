import setFnName from 'setFnName';

type Head<T extends any[]> = T extends [...infer Head, any] ? Head : any[];
type Tail<T extends any[]> = T extends [...any[], infer Tail] ? Tail : any[];

/**
 * ES5 Transpilation increases the size of spread arguments by a lot.
 * Wraps a function and passes its spread params as an array.
 */
export default function withArgs<CB extends (...args: any[]) => any>(
  cb: CB,
  fnName?: string
) {
  type TAllParams = Parameters<CB>;
  type TFirst = Head<TAllParams>;
  type TArgs = Tail<TAllParams>;

  // @ts-ignore
  return setFnName((...args: [...TFirst, ...TArgs]): ReturnType<CB> => {
    const right = args.splice(cb.length - 1);
    return cb.apply(null, args.concat([right]));
  }, fnName || cb.name);
}
