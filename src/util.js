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

// Converts a JSDoc link value to an object of link information
export function parseLink(link, docs) {
  link = link.replace(/\{@link\s+(.+?)\s*\}/i, '$1');

  // Type link
  const split = link.split(/(\.|#)/);
  if (docs.links[split[0]]) {
    return {
      text: link,
      link: {
        name: docs.links[split[0]].name,
        params: docs.links[split[0]].params,
        query: { scrollTo: split[1] ? `${split[1] === '.' ? 's-' : ''}${split[2]}` : undefined },
      },
    };
  }

  // Any link
  if (link.match(/^https?:\/\//i)) {
    return {
      text: link,
      link: link,
    };
  }

  // Plain text
  return { text: link };
}
