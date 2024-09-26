import React from 'react';
import { useFormContext } from '../context';
import { renderField } from '../utils/fieldRenderer';
import { H2, Paragraph } from '@/components/design-sytem/typography';

export function FormPreview() {
    const { form } = useFormContext();

    return (
        <div className="bg-white p-6 rounded shadow-md min-h-full">
            <H2 className="tracking-tight mb-2">{form.title}</H2>
            {form.description && <Paragraph className="mb-6">{form.description}</Paragraph>}
            <form>
                {form.fields.map((field) => (
                    <div key={field.id} className="mb-4">
                        {renderField(field)}
                    </div>
                ))}
            </form>
        </div>
    );
}