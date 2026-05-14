/**
 * Preprocesses markdown string to convert common LaTeX delimiters to $ and $$
 * which remark-math understands better by default.
 */
export function preprocessMarkdown(text: string): string {
  if (!text) return '';
  
  return text
    // Replace \[ ... \] with $$ ... $$
    .replace(/\\\[([\s\S]*?)\\\]/g, '$$$$$1$$$$')
    // Replace \( ... \) with $ ... $
    .replace(/\\\(([\s\S]*?)\\\)/g, '$$$1$$')
    // Fix common issues with escaped underscores in math
    .replace(/(\$|\\\[)([\s\S]*?)(\$|\\\])/g, (match) => {
      return match.replace(/\\_/g, '_');
    });
}

/**
 * Ensures image URLs are absolute from the root if they are stored in the uploads folder
 */
export function fixImageUrls(url: string): string {
  if (!url) return '';
  if (url.startsWith('uploads/')) return `/${url}`;
  return url;
}
