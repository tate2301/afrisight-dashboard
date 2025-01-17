import React, {
	createContext,
	useContext,
	useState,
	ReactNode,
	useEffect,
	useCallback,
} from 'react';
import { Form, FormField } from './types';
import { createEmptyForm, deserializeForm } from './utils/formUtils';
import { DEFAULT_THEME } from './constants';

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
	const initialFormRef = React.useRef<Form | null>(null);

	const [form, setForm] = useState<Form>(() => {
		if (initialForm && !initialFormRef.current) {
			try {
				const parsedForm = deserializeForm(initialForm);
				const formWithTheme = {
					...parsedForm,
					theme: parsedForm?.theme || DEFAULT_THEME,
				};
				initialFormRef.current = formWithTheme;
				return formWithTheme;
			} catch (e) {
				console.error('Failed to parse initial form:', e);
				const emptyForm = createEmptyForm({});
				initialFormRef.current = emptyForm;
				return emptyForm;
			}
		}
		return initialFormRef.current || createEmptyForm({});
	});

	const [selectedFieldId, setSelectedFieldId] = useState<string | null>(() => {
		return form.fields && form.fields.length > 0 ? form.fields[0].id : null;
	});

	const updateForm = useCallback((updatedForm: Partial<Form>) => {
		setForm((prevForm) => {
			const newForm = {
				...prevForm,
				...updatedForm,
				fields: updatedForm.fields ?? prevForm.fields,
				theme: updatedForm.theme
					? { ...prevForm.theme, ...updatedForm.theme }
					: prevForm.theme,
			};
			return newForm;
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
					field.id === fieldId ? { ...field, ...updatedField } : field,
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
			return { ...prevForm, fields: newFields };
		});
	}, []);

	const exportForm = useCallback(() => JSON.stringify(form), [form]);

	// Notify parent component of form changes
	useEffect(() => {
		if (onFormChange) {
			onFormChange(form);
		}
	}, [onFormChange, form]);

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
