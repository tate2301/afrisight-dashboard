import React from 'react';
import { Box } from '@radix-ui/themes';
import { LocationTarget } from './location/LocationTarget';
import { DemographicsSection } from './demographics/DemographicsSection';
import { RequirementsSection } from './requirements/RequirementsSection';
import { SectionHeader } from './common/SectionHeader';
import FormDivider from '../FormDivider';
import type { FormikProps } from 'formik';
import { LocationTargetType, SelectedCity } from './types';
import { GigFormValues } from '@/app/gigs/[id]/components/types';
import { useState, useCallback } from 'react';
import { TBaseGig } from '../FormikWrapper';

interface TargetingAndRequirementsProps {
	formik: FormikProps<GigFormValues>;
}

export const TargetingAndRequirements = React.memo(({
	formik,
}: TargetingAndRequirementsProps) => {
	const [enabledSections, setEnabledSections] = useState({
		location: true,
		demographics: false,
		requirements: false,
	});

	const toggleSection = useCallback((section: keyof typeof enabledSections) => {
		setEnabledSections(prev => {
			const newState = { ...prev, [section]: !prev[section] };
			if (!newState[section]) {
				// Clear section data when disabled
				const resetValues: Partial<GigFormValues> = {};
				switch (section) {
					case 'location':
						resetValues.location = {
							type: 'all',
							countries: [],
							cities: [],
						};
						break;
					case 'demographics':
						resetValues.targetGender = 'All';
						resetValues.targetAgeRange = { min: 13, max: 100 };
						break;
					case 'requirements':
						resetValues.languageRequirements = [];
						resetValues.educationLevel = 'highSchool';
						break;
				}
				formik.setValues({ ...formik.values, ...resetValues }, false);
			}
			return newState;
		});
	}, [formik]);

	const handleLocationChange = useCallback((
		type: LocationTargetType,
		countries: string[],
		cities: SelectedCity[],
	) => {
		formik.setFieldValue('location', {
			type,
			countries,
			cities: cities.map((city) => ({
				country: city.country,
				_id: city.id,
			})),
		}, false);
	}, [formik]);

	return (
		<Box className="max-w-2xl mx-auto space-y-12">
			<section className="space-y-6">
				<div>
					<SectionHeader
						title="Location Targeting"
						description="Choose where your gig will be available"
						isEnabled={enabledSections.location}
						onChange={() => toggleSection('location')}
					/>
					
					
				</div>
				{enabledSections.location && (
					<LocationTarget
						value={formik.values.location}
						onChange={handleLocationChange}
					/>
				)}
			</section>

			<FormDivider />

			{/* Demographics Section */}
			<section className="space-y-6">
				<div>
					<SectionHeader
						title="Demographics"
						description="Define your target audience characteristics"
						isEnabled={enabledSections.demographics}
						onChange={() => toggleSection('demographics')}
					/>
					
						
				</div>
				{enabledSections.demographics && (
					<DemographicsSection showHeader={false} formik={formik as FormikProps<TBaseGig>} />
				)}
			</section>

			<FormDivider />

			{/* Requirements Section */}
			<section className="space-y-6">
				<div>
					<SectionHeader
						title="Additional Requirements"
						description="Set specific criteria for participants"
						isEnabled={enabledSections.requirements}
						onChange={() => toggleSection('requirements')}
					/>
					
				</div>
				{enabledSections.requirements && (
					<RequirementsSection showHeader={false} formik={formik as FormikProps<TBaseGig>} />
				)}
			</section>
		</Box>
	);
});

TargetingAndRequirements.displayName = 'TargetingAndRequirements';
