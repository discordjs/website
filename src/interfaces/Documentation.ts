interface DocumentationMeta {
	generator: string;
	format: number;
	date: number;
}

export interface DocumentationClassMeta {
	line: number;
	file: string;
	path?: string;
	url?: string;
}
type DocumentationClassMethodMeta = DocumentationClassMeta;
type DocumentationClassMethodParameterMeta = DocumentationClassMeta;
type DocumentationClassMethodPropertyMeta = DocumentationClassMeta;
type DocumentationClassEventMeta = DocumentationClassMeta;
type DocumentationExternalMeta = DocumentationClassMeta;
type DocumentationTypeDefinitionMeta = DocumentationClassMeta;
type DocumentationTypeDefinitionParameterMeta = DocumentationClassMeta;

interface DocumentationParameter {
	name: string;
	description?: string;
	default: string;
	abstract?: boolean;
	deprecated?: boolean | string;
	access?: string;
	readonly?: boolean;
	optional?: boolean;
	variable?: boolean;
	nullable?: boolean;
	scope?: string;
	see?: string[];
	type: string[][][];
}
type DocumentationClassConstructorParameter = DocumentationParameter;
type DocumentationClassEventParameter = DocumentationParameter;

interface DocumentationClassMethodParameter extends DocumentationParameter {
	meta: DocumentationClassMethodParameterMeta;
}

interface DocumentationTypeDefinitionParameter extends DocumentationParameter {
	meta: DocumentationTypeDefinitionParameterMeta;
}

interface DocumentationProperty extends DocumentationParameter {}
type DocumentationTypeDefinitionProperty = DocumentationProperty;
type DocumentationClassPropertyProperty = DocumentationProperty;

export interface DocumentationClassProperty extends DocumentationProperty {
	props: DocumentationClassPropertyProperty[];
	meta: DocumentationClassMethodPropertyMeta;
}

interface DocumentationClassConstructor {
	name: string;
	params?: DocumentationClassConstructorParameter[];
}

export interface DocumentationClassMethod {
	name: string;
	description?: string;
	access?: string;
	async?: boolean;
	abstract?: boolean;
	deprecated?: boolean | string;
	inherited?: boolean;
	scope?: string;
	params?: DocumentationClassMethodParameter[];
	examples?: string[];
	returns?: any;
	returnsDescription?: string;
	throws?: string[];
	see?: string[];
	meta: DocumentationClassMethodMeta;
}

export interface DocumentationClassEvent {
	name: string;
	description: string;
	access?: string;
	deprecated?: boolean | string;
	params: DocumentationClassEventParameter[];
	see?: string[];
	meta: DocumentationClassEventMeta;
}

export interface DocumentationClass {
	name: string;
	deprecated?: string | boolean;
	description: string;
	construct: DocumentationClassConstructor;
	abstract: boolean;
	access?: string;
	extends: any;
	implements: any;
	props: DocumentationClassProperty[];
	methods: DocumentationClassMethod[];
	events: DocumentationClassEvent[];
	meta: DocumentationClassMeta;
}

export interface DocumentationCustomFile {
	name: string;
	content: string;
	type: string;
	path: string;
}

interface DocumentationCustom {
	[key: string]: {
		name: string;
		files: {
			[key: string]: DocumentationCustomFile;
		};
	};
}

interface DocumentationExternal {
	name: string;
	see: string[];
	meta: DocumentationExternalMeta;
}

type DocumentationInterface = DocumentationClass;

enum DocumentationLinkParams {
	class = 'class',
	typedef = 'typedef',
}
interface DocumentationLink {
	[key: string]:
		| {
				name: string;
				params: {
					[key in DocumentationLinkParams]: string;
				};
		  }
		| string;
}

interface DocumentationTypeDefinition {
	name: string;
	description: string;
	access?: string;
	props: DocumentationTypeDefinitionProperty[];
	params?: DocumentationTypeDefinitionParameter[];
	see?: string[];
	type: string[][][];
	returns?: any;
	returnsDescription?: string;
	meta: DocumentationTypeDefinitionMeta;
}

export type ParameterUnion =
	| DocumentationClassConstructorParameter
	| DocumentationClassMethodParameter
	| DocumentationClassEventParameter
	| DocumentationTypeDefinitionParameter;

export interface Documentation {
	classes: DocumentationClass[];
	custom: DocumentationCustom[];
	externals: DocumentationExternal[];
	functions?: DocumentationClassMethod[];
	global: string;
	interfaces: DocumentationInterface[];
	links: DocumentationLink[];
	meta: DocumentationMeta;
	id: string;
	source: string;
	tag: string;
	typedefs: DocumentationTypeDefinition[];
}
