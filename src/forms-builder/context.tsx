import React, {
	createContext,
	useContext,
	useState,
	ReactNode,
	useEffect,
	useCallback,
} from 'react';
import {Form, FormField} from './types';
import {createEmptyForm, deserializeForm} from './utils/formUtils';
import {DEFAULT_THEME} from './constants';

interface FormContextType {
	form: Form;
	selectedFieldId: string | null;
	exportForm: () => string;
	updateForm: (updatedForm: Partial<Form>) => void;
	addField: (field: FormField) => void;
	updateField: (fieldId: string, updatedField: Partial<FormField>) => void;
	removeField: (fieldId: string) => void;
	reorderFields: (startIndex: number, endIndex: number) => void;
	setSelectedFieldId: (fieldId: string | null) => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

interface FormProviderProps {
	children: ReactNode;
	initialForm?: string;
	onFormChange?: (form: Form) => void;
}

export function FormProvider({
	children,
	initialForm,
	onFormChange,
}: FormProviderProps) {
	const [form, setForm] = useState<Form>(() => {
		if (initialForm) {
			try {
				const form = deserializeForm(initialForm);
				return {
					...form,
					theme: form?.theme || DEFAULT_THEME,
				};
			} catch (e) {
				console.error('Failed to parse initial form:', e);
				return createEmptyForm({});
			}
		}
		return createEmptyForm({});
	});

	// Initialize selectedFieldId only once on mount
	const [selectedFieldId, setSelectedFieldId] = useState<string | null>(() => {
		return form.fields && form.fields.length > 0 ? form.fields[0].id : null;
	});

	const updateForm = useCallback((updatedForm: Partial<Form>) => {
		setForm((prevForm) => {
			// Deep compare theme changes
			const hasThemeChanges =
				updatedForm.theme &&
				JSON.stringify(updatedForm.theme) === JSON.stringify(prevForm.theme);

			const hasChanges =
				(updatedForm.id && updatedForm.id !== prevForm.id) ||
				(updatedForm.title && updatedForm.title !== prevForm.title) ||
				(updatedForm.description &&
					updatedForm.description !== prevForm.description) ||
				hasThemeChanges ||
				(Array.isArray(updatedForm.fields) &&
					JSON.stringify(updatedForm.fields) !==
						JSON.stringify(prevForm.fields));

			if (!hasChanges) return prevForm;
			return {...prevForm, ...updatedForm};
		});
	}, []);

	const addField = useCallback((field: FormField) => {
		setForm((prevForm) => ({
			...prevForm,
			fields: [...(prevForm.fields ?? []), field],
		}));
		setSelectedFieldId(field.id); // Automatically select newly added field
	}, []);

	const updateField = useCallback(
		(fieldId: string, updatedField: Partial<FormField>) => {
			setForm((prevForm) => ({
				...(prevForm ?? []),
				fields: prevForm.fields?.map((field) =>
					field.id === fieldId ? {...field, ...updatedField} : field,
				),
			}));
		},
		[],
	);

	const removeField = useCallback(
		(fieldId: string) => {
			setForm((prevForm) => {
				const fieldIndex = prevForm.fields.findIndex((f) => f.id === fieldId);
				const newFields = prevForm.fields.filter(
					(field) => field.id !== fieldId,
				);

				// Update selection when removing the selected field
				if (fieldId === selectedFieldId) {
					const newSelectedIndex = Math.max(0, fieldIndex - 1);
					setSelectedFieldId(newFields[newSelectedIndex]?.id ?? null);
				}

				return {
					...prevForm,
					fields: newFields,
				};
			});
		},
		[selectedFieldId],
	);

	const reorderFields = useCallback((startIndex: number, endIndex: number) => {
		setForm((prevForm) => {
			const newFields = Array.from(prevForm.fields);
			const [reorderedItem] = newFields.splice(startIndex, 1);
			newFields.splice(endIndex, 0, reorderedItem);
			return {...prevForm, fields: newFields};
		});
	}, []);

	const exportForm = useCallback(() => JSON.stringify(form), [form]);

	// Notify parent component of form changes
	useEffect(() => {
		if (onFormChange) {
			onFormChange(form);
		}
	}, [onFormChange, form]);

	// Clean up effect
	useEffect(() => {
		return () => {
			// Cleanup any pending state updates
			setForm(createEmptyForm({}));
			setSelectedFieldId(null);
		};
	}, []);

	console.log('Rerendered form provider', initialForm);

	return (
		<FormContext.Provider
			value={{
				form,
				selectedFieldId,
				exportForm,
				updateForm,
				addField,
				updateField,
				removeField,
				reorderFields,
				setSelectedFieldId,
			}}>
			{children}
		</FormContext.Provider>
	);
}

export function useFormContext() {
	const context = useContext(FormContext);
	if (!context) {
		throw new Error('useFormContext must be used within a FormProvider');
	}
	return context;
}
