import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { Form, FormField } from './types';

interface FormContextType {
    form: Form;
    selectedFieldId: string | null;
    exportForm: () => string
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

export function FormProvider({ children, initialForm, onFormChange }: FormProviderProps) {
    const hydrateForm = (form: string): Form => JSON.parse(form)

    const [form, setForm] = useState<Form>(() => {
        if (initialForm) {
            return hydrateForm(initialForm);
        }

        const initialShortAnswerField: FormField = {
            id: `field_${Date.now()}`,
            type: 'shortAnswer',
            label: 'Short Answer',
            required: false,
            properties: {},
        };

        return {
            id: '',
            title: '',
            description: '',
            theme: {
                primaryColor: '#3b82f6',
                backgroundColor: '#ffffff',
                fontFamily: 'Inter, sans-serif',
            },
            fields: [initialShortAnswerField],
        };
    });

    const [selectedFieldId, setSelectedFieldId] = useState<string | null>(form.fields[0]?.id || null);

    const updateForm = (updatedForm: Partial<Form>) => {
        setForm((prevForm) => ({ ...prevForm, ...updatedForm }));
    };

    const addField = (field: FormField) => {
        setForm((prevForm) => ({
            ...prevForm,
            fields: [...prevForm.fields, field],
        }));
    };

    const updateField = (fieldId: string, updatedField: Partial<FormField>) => {
        setForm((prevForm) => ({
            ...prevForm,
            fields: prevForm.fields.map((field) =>
                field.id === fieldId ? { ...field, ...updatedField } : field
            ),
        }));
    };

    const removeField = (fieldId: string) => {
        setForm((prevForm) => ({
            ...prevForm,
            fields: prevForm.fields.filter((field) => field.id !== fieldId),
        }));
    };

    const reorderFields = (startIndex: number, endIndex: number) => {
        setForm((prevForm) => {
            const newFields = Array.from(prevForm.fields);
            const [reorderedItem] = newFields.splice(startIndex, 1);
            newFields.splice(endIndex, 0, reorderedItem);
            return { ...prevForm, fields: newFields };
        });
    };

    const dumpForm = useCallback(() => JSON.stringify(form), [form])


    useEffect(() => {
        if (initialForm) {
            setForm(hydrateForm(initialForm));
        }
    }, [initialForm]);

    // Notify parent component of form changes
    useEffect(() => {
        if (onFormChange) {
            onFormChange(form);
        }
    }, [form, onFormChange]);



    return (
        <FormContext.Provider
            value={{
                form,
                selectedFieldId,
                updateForm,
                addField,
                updateField,
                removeField,
                reorderFields,
                setSelectedFieldId,
                exportForm: dumpForm
            }}
        >
            {children}
        </FormContext.Provider>
    );
}

export function useFormContext() {
    const context = useContext(FormContext);
    if (context === undefined) {
        throw new Error('useFormContext must be used within a FormProvider');
    }
    return context;
}
