export function typeKey(type: string | string[] | string[][] | { types: string[] }) {
	if (Array.isArray(type)) {
		return typeof type === 'string' ? type : type.join('-');
	}
}
