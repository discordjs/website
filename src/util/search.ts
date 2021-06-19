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
	const formattedInput = input.trim().toLowerCase();

	if (formattedInput === '') {
		return [];
	}

	// Build scores based on index matching
	let result = searchIndex.value.reduce((acc: { [index: number]: number }, s) => {
		if (formattedInput.includes(s.name)) {
			for (const r of s.related) {
				if (acc[r]) {
					acc[r]++;
				} else {
					acc[r] = 1;
				}
			}
		}
		return acc;
	}, {});

	// Fallback if input is too short for matches
	if (Object.keys(result).length === 0 && formattedInput.length < 10) {
		result = searchIndex.value.reduce((acc: { [index: number]: number }, s) => {
			if (s.name.includes(formattedInput)) {
				for (const r of s.related) {
					if (acc[r]) {
						acc[r]++;
					} else {
						acc[r] = 1;
					}
				}
			}
			return acc;
		}, {});
	}

	const sortedResults = Object.entries(result)
		.map(([ref, counter]): [DocumentLink, number] => [searchRef.value[parseInt(ref, 10)], counter])
		.filter(([ref]) => (ref.access === 'private' ? isShowPrivates.value : true))
		.sort(([aref, a], [bref, b]) => {
			let weight = 0;

			// Give extra weight when an exact match is found
			// if it is a class or typedef, give it even higher priority
			if (aref.nameLowerCase === formattedInput) {
				weight += aref.isPriority ? -10 : -4;
			} else if (bref.nameLowerCase === formattedInput) {
				weight += bref.isPriority ? 10 : 4;
			}

			if (a === b) {
				// if the counter is the same but not the names, then give extra weight to ones that are classes and typedefs
				if (aref.isPriority) {
					weight -= 6;
				}
				if (bref.isPriority) {
					weight += 6;
				}

				// in the case that there are more than two index matches, sort them by how close their length is to the input
				if (a > 1) {
					weight +=
						Math.abs(formattedInput.length - aref.computedName.length) -
						Math.abs(formattedInput.length - bref.computedName.length);
				}
			}

			return b - a + weight;
		});

	return sortedResults.map(([ref, _]) => ref);
}
