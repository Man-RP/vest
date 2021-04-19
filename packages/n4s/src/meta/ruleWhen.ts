import EnforceContext from 'EnforceContext';
import optionalFunctionValue from 'optionalFunctionValue';

export default function when(
  value: any,
  condition: any,
  bail: (shouldBail: boolean) => void
) {
  const shouldBail: boolean = !optionalFunctionValue(
    condition,
    [EnforceContext.unwrap(value)].concat(
      EnforceContext.is(value) ? [value.key, value.obj] : []
    )
  );

  return bail(shouldBail);
}
