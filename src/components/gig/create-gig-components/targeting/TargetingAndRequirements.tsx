import { Box } from '@radix-ui/themes';
import { LocationTarget } from './location/LocationTarget';
import { DemographicsSection } from './demographics/DemographicsSection';
import { RequirementsSection } from './requirements/RequirementsSection';
import { SectionHeader } from './common/SectionHeader';
import FormDivider from '../FormDivider';
import type { FormikProps } from 'formik';
import { LocationTargetType, SelectedCity, GigFormValues } from './types';
import type { TBaseGig } from '../FormikWrapper';
import { useState } from 'react';
import { ToggleSection } from './common/ToggleSection';

interface TargetingAndRequirementsProps {
	formik: FormikProps<TBaseGig>;
}

export function TargetingAndRequirements({
	formik,
}: TargetingAndRequirementsProps) {
	const [enabledSections, setEnabledSections] = useState({
		location: true,
		demographics: false,
		requirements: false,
	});

	const toggleSection = (section: keyof typeof enabledSections) => {
		setEnabledSections((prev) => {
			const newState = { ...prev, [section]: !prev[section] };
			if (!newState[section]) {
				// Clear section data when disabled
				switch (section) {
					case 'location':
						formik.setFieldValue('location', {
							type: 'all',
							countries: [],
							cities: [],
						});
						break;
					case 'demographics':
						formik.setFieldValue('targetGender', 'All');
						formik.setFieldValue('targetAgeRange', { min: 13, max: 100 });
						break;
					case 'requirements':
						formik.setFieldValue('languageRequirements', []);
						formik.setFieldValue('educationLevel', 'highSchool');
						break;
				}
			}
			return newState;
		});
	};

	const handleLocationChange = (
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
		});
	};

	return (
		<Box className="max-w-2xl mx-auto space-y-12">
			{/* Location Section */}
			<section className="space-y-6">
				<div className="flex justify-between items-center">
					<SectionHeader
						title="Location Targeting"
						description="Choose where your gig will be available"
					/>
					<ToggleSection
						isEnabled={enabledSections.location}
						onChange={(enabled) => toggleSection('location')}
					/>
				</div>
				{enabledSections.location && (
					<LocationTarget
						value={
							typeof formik.values.location === 'string'
								? JSON.parse(formik.values.location)
								: (formik.values.location ?? {
									cities: [],
									countries: [],
								})
						}
						onChange={handleLocationChange}
					/>
				)}
			</section>

			<FormDivider />

			{/* Demographics Section */}
			<section className="space-y-6">
				<div className="flex justify-between items-center">
					<SectionHeader
						title="Demographics"
						description="Define your target audience characteristics"
					/>
					<ToggleSection
						isEnabled={enabledSections.demographics}
						onChange={(enabled) => toggleSection('demographics')}
					/>
				</div>
				{enabledSections.demographics && (
					<DemographicsSection formik={formik} />
				)}
			</section>

			<FormDivider />

			{/* Requirements Section */}
			<section className="space-y-6">
				<div className="flex justify-between items-center">
					<SectionHeader
						title="Additional Requirements"
						description="Set specific criteria for participants"
					/>
					<ToggleSection
						isEnabled={enabledSections.requirements}
						onChange={(enabled) => toggleSection('requirements')}
					/>
				</div>
				{enabledSections.requirements && (
					<RequirementsSection formik={formik} />
				)}
			</section>
		</Box>
	);
}
