import React, {
	createContext,
	useContext,
	useState,
	ReactNode,
	useEffect,
	useCallback,
} from 'react';
import { Form, FormField } from './types';

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
	const hydrateForm = (json: string): Form => JSON.parse(json);

	const [form, setForm] = useState<Form>(() => {
		if (initialForm) {
			return hydrateForm(initialForm);
		}
		return {
			id: '',
			title: '',
			description: '',
			theme: {
				primaryColor: '#3b82f6',
				backgroundColor: '#ffffff',
				fontFamily: 'Inter, sans-serif',
			},
			fields: [],
		};
	});

	const [selectedFieldId, setSelectedFieldId] = useState<string | null>(
		form.fields ? form.fields[0]?.id : null,
	);

	const updateForm = useCallback((updatedForm: Partial<Form>) => {
		setForm((prevForm) => {
			const hasChanges =
				(updatedForm.id && updatedForm.id !== prevForm.id) ||
				(updatedForm.title && updatedForm.title !== prevForm.title) ||
				(updatedForm.description &&
					updatedForm.description !== prevForm.description) ||
				(updatedForm.theme && updatedForm.theme !== prevForm.theme) ||
				(Array.isArray(updatedForm.fields) &&
					updatedForm.fields !== prevForm.fields);

			if (!hasChanges) return prevForm;
			return { ...prevForm, ...updatedForm };
		});
	}, []);

	const addField = useCallback((field: FormField) => {
		setForm((prevForm) => ({
			...prevForm,
			fields: [...(prevForm.fields ?? []), field],
		}));
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

	const removeField = useCallback((fieldId: string) => {
		setForm((prevForm) => ({
			...(prevForm ?? []),
			fields: prevForm.fields?.filter((field) => field.id !== fieldId),
		}));
	}, []);

	const reorderFields = useCallback((startIndex: number, endIndex: number) => {
		setForm((prevForm) => {
			const newFields = Array.from(prevForm.fields);
			const [reorderedItem] = newFields.splice(startIndex, 1);
			newFields.splice(endIndex, 0, reorderedItem);
			return { ...prevForm, fields: newFields };
		});
	}, []);

	const exportForm = useCallback(() => JSON.stringify(form), [form]);

	// Stay in sync with first field as default selection
	useEffect(() => {
		const firstFieldId = form.fields ? form.fields[0]?.id : null;
		setSelectedFieldId((prev) => (prev !== firstFieldId ? firstFieldId : prev));
	}, [form.fields]);

	// Notify parent component of form changes
	useEffect(() => {
		if (onFormChange) {
			onFormChange(form);
		}
	}, [onFormChange, form]);

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
