import { resolve as resolveURL } from 'url';

// Highlights an element with highlight.js, delaying until it's loaded
export function hljs(el) {
  if (window.hljs) {
    window.hljs.highlightBlock(el);
  } else {
    let attempts = 0;
    const interval = setInterval(() => {
      if (window.hljs) {
        window.hljs.highlightBlock(el);
        clearInterval(interval);
      } else {
        attempts++;
        if (attempts >= 50) clearInterval(interval);
      }
    }, 100);
  }
}

// Creates a full URL for a GitHub source view
export function sourceURL(url, tag, path, file, line) {
  return resolveURL(url, `${tag}/${path}/${file}#L${line}`);
}
