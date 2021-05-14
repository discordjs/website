import { DocumentationClassMethod, DocumentationClassProperty } from '~/interfaces/Documentation';

export function scopedName(item: DocumentationClassProperty | DocumentationClassMethod) {
	return `${item.scope === 'static' ? 's-' : ''}${item.name}`;
}
