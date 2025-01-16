import React from 'react';
import { TargetingAndRequirements as BaseTargeting } from '@/components/gig/create-gig-components/targeting/TargetingAndRequirements';
import FormIslandCard from './FormIslandCard';
import { Gig } from '@/utils/types';
import { FormikProps } from 'formik';
import { GigFormValues } from '../../types';
import { Location } from '@/utils/types';
import { UseMutationResult } from '@tanstack/react-query';

interface TargetingAndRequirementsProps {
    formik: FormikProps<GigFormValues>;
    gig: Gig;
    updateGigMutation: UseMutationResult<any, Error, Partial<GigFormValues>>;
}

const TargetingAndRequirements = ({ formik, gig, updateGigMutation }: TargetingAndRequirementsProps) => {
    React.useEffect(() => {
        if (gig && !formik.values.targetGender) {
            const location: Location = typeof gig.location === 'string'
                ? JSON.parse(gig.location)
                : gig.location;

            formik.setValues({
                ...formik.values,
                targetGender: gig.targetGender || 'All',
                targetAgeRange: gig.targetAgeRange || { min: 13, max: 100 },
                location: location || { type: 'all', countries: [], cities: [] },
                languageRequirements: gig.languageRequirements || [],
                educationLevel: gig.educationLevel || 'highSchool',
            }, false);
        }
    }, [gig._id]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (formik.isValid) {
            try {
                await updateGigMutation.mutateAsync({
                    targetGender: formik.values.targetGender,
                    targetAgeRange: formik.values.targetAgeRange,
                    location: formik.values.location,
                    languageRequirements: formik.values.languageRequirements,
                    educationLevel: formik.values.educationLevel,
                });
            } catch (error) {
                console.error('Submit error:', error);
            }
        }
    };

    return (
        <div className="space-y-8 overflow-y-auto">
            <FormIslandCard
                title="Demographics"
                description="Target specific demographics for this gig"
                formik={formik}
                onSubmit={handleSubmit}>
                <BaseTargeting formik={formik} />
            </FormIslandCard>
        </div>
    );
};

export default React.memo(TargetingAndRequirements); 