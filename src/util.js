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
  return resolveURL(url, `${tag}/${path}${file ? `/${file}` : ''}${line ? `#L${line}` : ''}`);
}

// Converts a JSDoc link value to an object of link information
export function parseLink(link, docs) {
  const matches = link.match(/\{@link\s+(.+?)(?:\s+(.+?))?\s*\}/i);
  if (matches) link = matches[1];
  let text = matches ? matches[2] : null;

  // Type link
  const split = link.split(/(\.|#)/);
  if (docs.links[split[0]]) {
    return {
      text: text || link,
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
      text: text || link,
      link: link,
    };
  }

  // Plain text
  return { text: text || link };
}

// Converts all JSDoc links to markdown links
export function convertLinks(text, docs, router, route) {
  if (!text) return null;

  const regex = /\{@link\s+(.+?)(?:\s+(.+?))?\s*\}/gi;
  let match;
  let newText = '';
  let start = 0;

  while (match = regex.exec(text)) { // eslint-disable-line no-cond-assign
    newText += text.slice(start, match.index);

    const parsed = parseLink(match[0], docs);
    if (parsed.link) {
      let link;
      if (typeof parsed.link === 'object') {
        if (!parsed.link.params) parsed.link.params = {};
        parsed.link.params.source = route.params.source;
        parsed.link.params.tag = route.params.tag;
        link = router.resolve(parsed.link).href;
      } else {
        link = parsed.link;
      }
      newText += `[${parsed.text}](${link})`;
    } else {
      newText += parsed.text;
    }

    start = match.index + match[0].length;
  }

  if (newText) {
    newText += text.slice(start);
    return newText;
  }

  return text;
}
