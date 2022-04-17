import { RouteLocationNormalizedLoaded, Router } from 'vue-router';
import { parseLink } from './parseLink';
import { Documentation } from '~/interfaces/Documentation';

// Converts all JSDoc links to markdown links
export function convertLinks(text: string, docs: Documentation, router: Router, route: RouteLocationNormalizedLoaded) {
	if (!text) return null;

	const regex = /\{@link\s+(.+?)(?:\s+(.+?))?\s*\}/gi;
	let match;
	let newText = '';
	let start = 0;

	while ((match = regex.exec(text))) {
		newText += text.slice(start, match.index);

		const parsed = parseLink(match[0], docs);
		if (parsed.link) {
			let link;
			if (typeof parsed.link === 'object') {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
				if (!parsed.link.params) parsed.link.params = {} as any;
				// @ts-expect-error
				parsed.link.params.source = route.params.source;
				// @ts-expect-error
				parsed.link.params.tag = route.params.tag;
				// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
				link = router.resolve(parsed.link as any).href;
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
