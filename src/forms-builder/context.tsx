import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Form, FormField } from './types';

interface FormContextType {
    form: Form;
    updateForm: (updatedForm: Partial<Form>) => void;
    addField: (field: FormField) => void;
    updateField: (fieldId: string, updatedField: Partial<FormField>) => void;
    removeField: (fieldId: string) => void;
    reorderFields: (startIndex: number, endIndex: number) => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export function FormProvider({ children }: { children: ReactNode }) {
    const [form, setForm] = useState<Form>({
        id: '',
        title: 'Untitled Form',
        description: '',
        theme: {
            primaryColor: '#3b82f6',
            backgroundColor: '#ffffff',
            fontFamily: 'Inter, sans-serif',
        },
        fields: [],
    });

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

    return (
        <FormContext.Provider
            value={{ form, updateForm, addField, updateField, removeField, reorderFields }}
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
