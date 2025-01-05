import {Box} from '@radix-ui/themes';
import {LocationTarget} from './location/LocationTarget';
import {DemographicsSection} from './demographics/DemographicsSection';
import {RequirementsSection} from './requirements/RequirementsSection';
import {SectionHeader} from './common/SectionHeader';
import FormDivider from '../FormDivider';
import type {FormikProps} from 'formik';
import {LocationTargetType, SelectedCity} from './types';
import type {TBaseGig} from '../FormikWrapper';

interface TargetingAndRequirementsProps {
	formik: FormikProps<TBaseGig>;
}

export function TargetingAndRequirements({
	formik,
}: TargetingAndRequirementsProps) {
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
			<section
				className="space-y-6"
				aria-labelledby="location-targeting">
				<SectionHeader
					title="Location Targeting"
					description="Choose where your gig will be available"
				/>
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
					error={formik.touched.location && (formik.errors.location as string)}
				/>
			</section>

			<FormDivider />

			{/* Demographics Section */}
			<DemographicsSection formik={formik} />

			<FormDivider />

			{/* Requirements Section */}
			<RequirementsSection formik={formik} />
		</Box>
	);
}
