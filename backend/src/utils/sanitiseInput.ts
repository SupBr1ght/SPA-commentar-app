import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

export function sanitizeHTML(input: string): string {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ['a', 'code', 'i', 'strong'],
    ALLOWED_ATTR: ['href', 'title'],
    // щоб не додавало зайвих тегів
    RETURN_DOM: false,
    // Якщо хочеш, можна додати FORBID_TAGS, FORBID_ATTR
  });
}