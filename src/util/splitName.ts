// Split names into 3 types of words, using userGroupDMChannel as fictional example
// Acronyms, e.g. DM
// Capital, e.g. Group, Channel
// Lowercase, e.g. user
export function splitName(name: string) {
	return name.match(/(([A-Z]{2,})(?=[A-Z]))|[A-Z][a-z]+|[a-z]+/g) ?? [];
}
