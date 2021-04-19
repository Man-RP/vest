export default function isBoolean(value: any): value is boolean {
  return !!value === value;
}
