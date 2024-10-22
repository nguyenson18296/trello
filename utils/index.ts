export function isEmpty(val: any): boolean {
  return val === null || val === undefined || (typeof val === 'object' && !Object.keys(val).length);
}

