import { Documentation } from '~/interfaces/Documentation';

// Converts a JSDoc link value to an object of link information
export function parseLink(link: string, docs: Documentation) {
	const matches = /\{@link\s+(.+?)(?:\s+(.+?))?\s*\}/i.exec(link);
	if (matches) link = matches[1];
	const text = matches ? matches[2] : null;

	// Type link
	const split = link.split(/(\.|#)/);
	if (docs.links[split[0] as any]) {
		return {
			text: text ?? link,
			link:
				typeof docs.links[split[0] as any] === 'object'
					? {
							name: docs.links[split[0] as any].name,
							params: docs.links[split[0] as any].params,
							query: { scrollTo: split[1] ? `${split[1] === '.' ? 's-' : ''}${split[2]}` : undefined },
					  }
					: docs.links[split[0] as any],
		};
	}

	// Any link
	if (/^https?:\/\//i.exec(link)) {
		return {
			text: text ?? link,
			link: link,
		};
	}

	// Plain text
	return { text: text ?? link };
}
