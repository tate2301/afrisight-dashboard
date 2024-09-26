import React from 'react';
import { withFormState } from './withFormState';
import { GigClientInfo } from './GigClientInfo';
import { GigBasicInfo } from './GigBasicInfo';
import { GigDateInfo } from './GigDateInfo';
import { GigCoverImage } from './GigCoverImage';
import { GigRewardPolicy } from './GigRewardPolicy';
import { GigLocation } from './GigLocation';
import { Button } from '@/components/ui/button';
import { H2, Paragraph } from '@/components/design-sytem/typography';
import Separator from '../design-sytem/separator';

interface GigFormProps {
    formik: any;
    onSubmit?: (values: any) => void;
}

const GigForm: React.FC<GigFormProps> = ({ formik, onSubmit }) => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        formik.handleSubmit();
        if (onSubmit) {
            onSubmit(formik.values);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <H2 className="mb-2">Add a new gig</H2>
            <Paragraph className="mb-4">Create a gig to start collecting responses.</Paragraph>
            <Separator className="mb-6" />

            <GigClientInfo
                values={formik.values}
                errors={formik.errors}
                touched={formik.touched}
                setFieldValue={formik.setFieldValue}
            />
            <Separator className="my-4" />

            <GigBasicInfo
                values={formik.values}
                errors={formik.errors}
                touched={formik.touched}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
            />

            <GigDateInfo
                values={formik.values}
                errors={formik.errors}
                touched={formik.touched}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
            />

            <GigCoverImage
                handleImageChange={(event) => {
                    formik.setFieldValue('coverImage', event.target.files?.[0] || null);
                }}
                coverImage={formik.values.coverImage}
            />
            <Separator className="my-4" />

            <GigRewardPolicy
                values={formik.values}
                errors={formik.errors}
                touched={formik.touched}
                setFieldValue={formik.setFieldValue}
            />

            <GigLocation
                values={formik.values}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
            />
            <Separator className="my-4" />

            <Button type="submit" disabled={!formik.isValid || formik.isSubmitting}>
                {formik.isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
        </form>
    );
};

export default withFormState(GigForm);