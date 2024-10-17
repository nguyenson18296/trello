export function isEmpty(obj: Record<string, unknown> | null | undefined): boolean {
  // Check if the object is null or undefined
  if (obj == null) return true;

  // Check if the object has no keys
  return Object.keys(obj).length === 0;
}
