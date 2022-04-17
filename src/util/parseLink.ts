import { Documentation } from '~/interfaces/Documentation';

// Converts a JSDoc link value to an object of link information
export function parseLink(link: string, docs: Documentation) {
	const matches = /\{@link\s+(.+?)(?:\s+(.+?))?\s*\}/i.exec(link);
	if (matches) link = matches[1];
	const text = matches ? matches[2] : null;

	// Type link
	const split = link.split(/(\.|#)/);
	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
	if (docs.links[split[0] as any]) {
		if (split[2]?.startsWith('event:')) {
			split[2] = split[2].replace('event:', 'e-');
			link = link.replace('event:', '');
		}

		return {
			text: text ?? link,
			link:
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
				typeof docs.links[split[0] as any] === 'object'
					? {
							// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
							name: docs.links[split[0] as any].name,
							// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
							params: docs.links[split[0] as any].params,
							query: { scrollTo: split[1] ? `${split[1] === '.' ? 's-' : ''}${split[2]}` : undefined },
					  }
					: // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
					  docs.links[split[0] as any],
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
