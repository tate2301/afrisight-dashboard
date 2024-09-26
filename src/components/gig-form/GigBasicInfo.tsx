import React from 'react';
import { Paragraph, Caption } from '@/components/design-sytem/typography';
import { TextInput } from '@/pages/gigs/create_gig';
import { ErrorMessage } from '@/pages/gigs/create_gig';

interface GigBasicInfoProps {
    values: any;
    errors: any;
    touched: any;
    handleChange: (e: React.ChangeEvent<any>) => void;
    handleBlur: (e: React.FocusEvent<any>) => void;
}

export const GigBasicInfo: React.FC<GigBasicInfoProps> = ({
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
}) => {
    return (
        <>
            <div className="mb-4">
                <Paragraph weight={'semibold'}>
                    Title <span className="text-red-500">*</span>
                </Paragraph>
                <TextInput
                    name="title"
                    value={values.title}
                    onChange={handleChange}
                    onBlur={handleBlur}
                />
                {touched.title && errors.title && (
                    <ErrorMessage>{errors.title}</ErrorMessage>
                )}
                <Caption color={'tertiary'}>
                    Pay attention to the title and make sure it aligns with the goals of the client and their brand voice.
                </Caption>
            </div>
            <div className="mb-4">
                <Paragraph weight={'semibold'}>
                    Description <span className="text-red-500">*</span>
                </Paragraph>
                <TextInput
                    name="description"
                    value={values.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                />
                {touched.description && errors.description && (
                    <ErrorMessage>{errors.description}</ErrorMessage>
                )}
            </div>
        </>
    );
};