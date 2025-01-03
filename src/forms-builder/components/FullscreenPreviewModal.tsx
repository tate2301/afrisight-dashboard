import React from 'react';
import { Form } from '../types';
import { renderField } from '../utils/fieldRenderer';
import { H2, Paragraph } from '@/components/design-sytem/typography';
import Button from '@/components/design-sytem/button';
import Box from '@/components/design-sytem/box';

interface FullscreenPreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    form: Form;
}

export function FullscreenPreviewModal({ isOpen, onClose, form }: FullscreenPreviewModalProps) {
    if (!isOpen) return null;

    return (
        <Box
            css={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000,
            }}
        >
            <Box
                css={{
                    backgroundColor: '$white',
                    padding: '32px',
                    borderRadius: '8px',
                    maxWidth: '600px',
                    width: '100%',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                }}
            >
                <H2 className="tracking-tight mb-2">{form.title}</H2>
                {form.description && <Paragraph className="mb-6">{form.description}</Paragraph>}
                <form>
                    {form.fields?.map((field) => (
                        <Box key={field.id} css={{ marginBottom: '16px' }}>
                            {renderField(field)}
                        </Box>
                    ))}
                </form>
                <Button onClick={onClose} css={{ marginTop: '16px' }}>
                    Close Preview
                </Button>
            </Box>
        </Box>
    );
}