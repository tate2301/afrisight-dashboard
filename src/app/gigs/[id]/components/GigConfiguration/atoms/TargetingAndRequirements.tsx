import React from 'react';
import { TargetingAndRequirements as BaseTargeting } from '@/components/gig/create-gig-components/targeting/TargetingAndRequirements';
import FormIslandCard from './FormIslandCard';
import { Gig } from '@/utils/types';
import { FormikProps } from 'formik';
import { GigFormValues } from '@/components/gig/create-gig-components/targeting/types';
import { Location } from '@/utils/types';

interface TargetingAndRequirementsProps {
    formik: FormikProps<GigFormValues>;
    gig: Gig;
}

const TargetingAndRequirements = ({ formik, gig }: TargetingAndRequirementsProps) => {
    React.useEffect(() => {
        if (gig) {
            const location: Location = typeof gig.location === 'string'
                ? JSON.parse(gig.location)
                : gig.location;

            formik.setValues({
                ...formik.values,
                targetGender: gig.targetGender,
                targetAgeRange: gig.targetAgeRange,
                location,
                languageRequirements: gig.languageRequirements,
                educationLevel: gig.educationLevel,
            });
        }
    }, [gig, formik]);

    return (
        <div className="space-y-8">
            <FormIslandCard
                title="Demographics"
                description="Target specific demographics for this gig"
                formik={formik}>
                <BaseTargeting formik={formik} />
            </FormIslandCard>
        </div>
    );
};

export default TargetingAndRequirements; 