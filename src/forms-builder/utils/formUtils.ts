import {Form, FormField} from '../types';
import {predefinedThemes} from './themeUtils';

export const createEmptyForm = (params: {
	id?: string;
	title?: string;
	description?: string;
}): Form => ({
	id: params.id || `form_${Date.now()}`,
	title: params.title || 'Untitled Form',
	description: params.description || '',
	theme: predefinedThemes[2],
	fields: [],
});

export const createField = (
	type: FormField['type'],
	params: Partial<FormField> = {},
): FormField => {
	const baseField: FormField = {
		id: `field_${Date.now()}`,
		type,
		label: getDefaultLabelForType(type),
		required: false,
		properties: getDefaultPropertiesForType(type),
	};

	return {...baseField, ...params};
};

const getDefaultLabelForType = (type: FormField['type']): string => {
	const labels: Record<FormField['type'], string> = {
		shortAnswer: 'Short Answer',
		longAnswer: 'Long Answer',
		email: 'Email',
		date: 'Date',
		multipleChoice: 'Multiple Choice',
		yesNo: 'Yes/No Question',
		npsRating: 'NPS Rating',
		fileUpload: 'File Upload',
		likertScale: 'Likert Scale',
	};
	return labels[type];
};

const getDefaultPropertiesForType = (type: FormField['type']) => {
	const defaults: Record<FormField['type'], any> = {
		shortAnswer: {minLength: 0, maxLength: 255},
		longAnswer: {minLength: 0, maxLength: 1000},
		email: {},
		date: {},
		multipleChoice: {choices: ['Option 1', 'Option 2', 'Option 3']},
		yesNo: {},
		npsRating: {npsMaxRating: 10},
		fileUpload: {maxFileSize: 10, allowedFileTypes: ['.pdf', '.doc', '.docx']},
		likertScale: {scalePoints: 5},
	};
	return defaults[type];
};

export const validateForm = (form: Form): boolean => {
	// Check required fields
	const hasTitle = !!form.title.trim();
	const hasValidTheme =
		form.theme &&
		typeof form.theme.colors.primary === 'string' &&
		typeof form.theme.colors.primary === 'string' &&
		typeof form.theme.colors.primary === 'string';

	// Validate each field
	const hasValidFields = form.fields.every(
		(field) =>
			field.id &&
			field.type &&
			field.label &&
			typeof field.required === 'boolean',
	);

	return hasTitle && hasValidTheme && hasValidFields;
};

export const serializeForm = (form: Form): string => {
	return JSON.stringify(form);
};

export const deserializeForm = (formString: string): Form => {
	try {
		return JSON.parse(formString);
	} catch (error) {
		console.error('Error deserializing form:', error);
		return createEmptyForm({});
	}
};
