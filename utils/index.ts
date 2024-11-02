import sanitizeHtml from 'sanitize-html';

export function isEmpty(val: any): boolean {
  return val === null || val === undefined || (typeof val === 'object' && !Object.keys(val).length);
}

export function sanitizeHtmlString(html: string): string {
  return sanitizeHtml(html);
}
