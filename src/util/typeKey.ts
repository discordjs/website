export function typeKey(
	type: string[][] | { description: string; types: string[][][]; variable: boolean; nullable: boolean },
) {
	if (Array.isArray(type)) {
		return typeof type === 'string' ? type : type.join('-');
	}
}
