export function longerThanOrEquals(
  value: string | any[],
  arg1: string | number
): boolean {
  return value.length >= Number(arg1);
}
