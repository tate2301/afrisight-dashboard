import React from 'react';
import { useFormContext } from '../context';
import { renderField } from '../utils/fieldRenderer';
import { H2, Paragraph } from '@/components/design-sytem/typography';
import Box from '@/components/design-sytem/box';
import { cn } from '@/lib/utils';

export function FormPreview() {
    const { form, selectedFieldId } = useFormContext();

    return (
        <div className="p-6 rounded min-h-full">
            <H2 className="tracking-tight mb-2">{form.title}</H2>
            {form.description && <Paragraph className="mb-6">{form.description}</Paragraph>}
            <form>
                {form.fields.map((field) => (
                    <Box
                        key={field.id}
                        css={{
                            marginBottom: '16px',
                            padding: '16px',
                            borderRadius: '12px',
                            backgroundColor: field.id === selectedFieldId ? '$white' : '$white',
                            transition: 'all 0.2s ease-in-out',


                        }}
                        className={cn(field.id === selectedFieldId && 'shadow ring-2 ring-primary')}
                    >
                        {renderField(field)}
                    </Box>
                ))}
            </form>
        </div>
    );
}