export default function (v: any): v is string {
  return String(v) === v;
}
