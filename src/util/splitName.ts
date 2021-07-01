// For camelcase and pascalcase, split names into 3 types of words, using userGroupDMChannel as fictional example
// Acronyms, e.g. DM
// Capital, e.g. Group, Channel
// Lowercase, e.g. user
// If the name is in screaming snake case, split by underscore
export function splitName(name: string) {
	if (/^[_A-Z]+$/.test(name)) {
		return name.match(/[A-Z]+/g) ?? [];
	}
	return name.match(/(([A-Z]{2,})(?=[A-Z]))|[A-Z][a-z]+|[a-z]+/g) ?? [];
}
