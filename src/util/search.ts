import { computed } from 'vue';

import { store } from '~/store';
import { isShowPrivates } from '~/util/showPrivates';

export class SearchTerm {
	public name: string;

	public related: Set<number>;

	public constructor(name: string, related: number) {
		this.name = name.toLowerCase();
		this.related = new Set([related]);
	}

	public addRelated(item: number): void {
		this.related.add(item);
	}

	public matches(input: string): boolean {
		return input.includes(this.name);
	}
}

export enum DocumentType {
	Class,
	Method,
	Property,
	Events,
	Typedefs,
}

export class DocumentLink {
	public computedName: string;
	public nameLowerCase: string;
	public cleanedComputedName: string;

	public constructor(
		public name: string,
		public type: DocumentType,
		public parentName?: string,
		public parentType?: DocumentType,
		public access?: string,
		public scope?: string,
	) {
		switch (type) {
			case DocumentType.Class:
			case DocumentType.Typedefs: {
				this.computedName = name;
				break;
			}

			case DocumentType.Method: {
				this.computedName = `${parentName ?? ''}.${name}()`;
				break;
			}

			case DocumentType.Property: {
				this.computedName = `${parentName ?? ''}.${name}`;
				break;
			}

			case DocumentType.Events: {
				this.computedName = `${parentName ?? ''}#${name}`;
				break;
			}
		}

		this.nameLowerCase = name.toLowerCase();
		this.cleanedComputedName = this.computedName.replace(/[().#]/, '').toLowerCase();
	}

	public get isPriority() {
		return this.type === DocumentType.Class || this.type === DocumentType.Typedefs;
	}

	// Helper function to generate router path
	public getLinkPath() {
		if (this.type === DocumentType.Typedefs || this.parentType === DocumentType.Typedefs) {
			return {
				name: 'docs-source-tag-typedef-typedef',
				params: { typedef: this.parentName ?? this.name },
			};
		}

		const linkPath: { name: string; params: { class: string }; query?: { scrollTo: string } } = {
			name: 'docs-source-tag-class-class',
			params: { class: this.parentName ?? this.name },
		};

		if (this.type === DocumentType.Method || this.type === DocumentType.Property) {
			linkPath.query = { scrollTo: this.name };
		}

		if (this.type === DocumentType.Events) {
			linkPath.query = { scrollTo: `e-${this.name}` };
		}

		return linkPath;
	}
}

const searchIndex = computed(() => store.state.searchIndex);
const searchRef = computed(() => store.state.searchRef);

export function search(input: string): DocumentLink[] {
	const formattedInput = input.replace(/[\s().#]/g, '').toLowerCase();

	if (formattedInput === '') {
		return [];
	}

	interface MatchContext {
		numMatches: number;
		lengthMatches: number;
	}

	// Build scores based on index matching
	let result = searchIndex.value.reduce((acc: Map<number, MatchContext>, s) => {
		if (formattedInput.includes(s.name)) {
			for (const r of s.related) {
				const obj = acc.get(r);
				if (obj) {
					obj.numMatches += 1;
					obj.lengthMatches += s.name.length;
				} else {
					acc.set(r, { numMatches: 1, lengthMatches: s.name.length });
				}
			}
		}
		return acc;
	}, new Map());

	// Fallback if input is too short for matches
	if (result.size === 0 && formattedInput.length < 10) {
		result = searchIndex.value.reduce((acc: Map<number, MatchContext>, s) => {
			if (s.name.includes(formattedInput)) {
				for (const r of s.related) {
					const obj = acc.get(r);
					if (obj) {
						obj.numMatches += 1;
						obj.lengthMatches += s.name.length;
					} else {
						acc.set(r, { numMatches: 1, lengthMatches: s.name.length });
					}
				}
			}
			return acc;
		}, new Map());
	}

	const sortedResults = Array.from(result.entries())
		.map(([ref, ctx]): [DocumentLink, MatchContext] => [searchRef.value[ref], ctx])
		.filter(([ref]) => (ref.access === 'private' ? isShowPrivates.value : true))
		.sort(([aRef, aCtx], [bRef, bCtx]) => {
			let weight = 0;

			// Give extra weight when an exact match is found
			// If it is a class or typedef, give it even higher priority
			if (aRef.nameLowerCase === formattedInput) {
				weight += aRef.isPriority ? -10 : -4;
			} else if (bRef.nameLowerCase === formattedInput) {
				weight += bRef.isPriority ? 10 : 4;
			}

			// If your input is this long and it is a substring match of the name,
			// we can assume you know precisely what you're looking for, so weigh these very heavily.
			if (formattedInput.length >= 7) {
				if (aRef.cleanedComputedName.includes(formattedInput)) {
					weight -= 30;
				}

				if (bRef.cleanedComputedName.includes(formattedInput)) {
					weight += 30;
				}
			}

			if (aCtx.numMatches === bCtx.numMatches) {
				// if the counter is the same but not the names, then give extra weight to ones that are classes and typedefs
				if (aRef.isPriority) {
					weight -= 6;
				}
				if (bRef.isPriority) {
					weight += 6;
				}

				// In the case that there are more than two index matches, sort them by how close their length is to the input
				if (aCtx.numMatches > 1) {
					weight +=
						Math.abs(formattedInput.length - aRef.computedName.length) -
						Math.abs(formattedInput.length - bRef.computedName.length);
				}

				// Factor in the length of the match so that longer matches get a bit of priority.
				// This prevents short words matches like 'at' or 'id' from being too high up in a search when a better match could be found
				weight += bCtx.lengthMatches - aCtx.lengthMatches;
			}
			return bCtx.numMatches - aCtx.numMatches + weight;
		});

	return sortedResults.map(([ref, _]) => ref);
}
