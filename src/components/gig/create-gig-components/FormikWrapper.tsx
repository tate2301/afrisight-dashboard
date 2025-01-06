import {Formik, FormikProps} from 'formik';
import * as Yup from 'yup';
import {Gig} from '@/utils/types';
import {LocationTargetType} from './targeting/types';

// Define the location structure as it will be saved to the server
export interface LocationData {
	type: LocationTargetType;
	countries: string[]; // country names
	cities: {
		country: string;
		_id: string; // city _id from MongoDB
	}[];
}

// Update TBaseGig to use LocationData type
export type TBaseGig = Partial<
	Omit<Gig, 'rewardPolicy' | 'coverImage' | 'client' | 'location'> & {
		rewardPolicy?: string;
		coverImage: File | null;
		client: string;
		endDate: string;
		location: LocationData; // Use LocationData type directly
		questionOrdering: 'preserve' | 'shuffle';
		difficulty: 'easy' | 'medium' | 'hard';
		duration: number;
		category: string;
		tags: string[];
		targetAgeRange: {min: number; max: number};
		targetGender: 'Male' | 'Female' | 'Other' | 'All';
		languageRequirements: string[];
		educationLevel: 'highSchool' | 'bachelors' | 'masters' | 'phd';
	}
>;

export const validationSchemas = {
	basicInformation: Yup.object({
		name: Yup.string().required('Title is required'),
		description: Yup.string().required('Description is required'),
		endDate: Yup.date().required('Closing date is required'),
		duration: Yup.number().required('Duration estimation is required'),
	}),
	behaviorAndExperience: Yup.object({
		questionOrdering: Yup.string().oneOf(['preserve', 'shuffle']),
		difficulty: Yup.string().oneOf(['easy', 'hard', 'extreme']),
	}),
	clientAndRewards: Yup.object({
		client: Yup.string().required('Client is required'),
		rewardPolicy: Yup.string().required('A reward policy is required'),
	}),
	category: Yup.object({
		categories: Yup.string(),
		tags: Yup.array().of(Yup.string()),
	}),
	targetting: Yup.object({
		location: Yup.object({
			type: Yup.string()
				.oneOf(['all', 'country', 'city'], 'Invalid location type')
				.required('Location type is required'),
			countries: Yup.array().when('type', {
				is: (type: string) => type !== 'all',
				then: (schema) =>
					schema
						.of(Yup.string())
						.min(1, 'At least one country must be selected'),
				otherwise: (schema) => schema.of(Yup.string()),
			}),
			cities: Yup.array().of(
				Yup.object({
					country: Yup.string().required('Country is required'),
					_id: Yup.string().required('City ID is required'),
				}),
			),
		}).test(
			'location-validation',
			'Invalid location configuration',
			function (value) {
				if (value.type === 'all') return true;
				if (!value.countries?.length) {
					return this.createError({
						message: 'Please select at least one country',
					});
				}
				return true;
			},
		),
		languageRequirements: Yup.array()
			.of(Yup.string())
			.min(1, 'At least one language is required'),
		educationLevel: Yup.string()
			.oneOf(['highSchool', 'bachelors', 'masters', 'phd'])
			.required('Education level is required'),
		targetGender: Yup.string()
			.oneOf(['Male', 'Female', 'Other', 'All'])
			.required('Target gender is required'),
		targetAgeRange: Yup.object({
			min: Yup.number()
				.min(13, 'Minimum age must be at least 13')
				.required('Minimum age is required'),
			max: Yup.number()
				.max(100, 'Maximum age must be 100 or less')
				.moreThan(
					Yup.ref('min'),
					'Maximum age must be greater than minimum age',
				)
				.required('Maximum age is required'),
		}).required('Age range is required'),
	}),
};

export const _initialValues = {
	basicInformation: (gig: Partial<TBaseGig>) => ({
		name: gig.name,
		description: gig.description,
		endDate: gig.endDate,
		coverImage: null,
		duration: gig.duration ?? 5,
	}),
	behaviorAndExperience: (gig: Partial<TBaseGig>) => ({
		difficulty: gig.difficulty ?? 'easy',
		questionOrdering: gig.questionOrdering ?? 'preserve',
	}),
	targeting: (gig: Partial<TBaseGig>) => {
		const defaultLocation: LocationData = {
			type: 'all',
			countries: [],
			cities: [],
		};

		// Ensure we're working with LocationData type
		const location: LocationData = gig.location || defaultLocation;

		return {
			location,
			targetGender: gig.targetGender ?? 'All',
			targetAgeRange: gig.targetAgeRange ?? {min: 13, max: 100},
			languageRequirements: gig.languageRequirements ?? [],
			educationLevel: gig.educationLevel ?? 'highSchool',
		};
	},
	category: (gig: Partial<TBaseGig>) => ({
		categories: gig.category ?? '',
		tags: gig.tags ?? [],
	}),
	clientAndRewards: (gig: Partial<TBaseGig>) => ({
		client: gig.client,
		rewardPolicy: gig.rewardPolicy,
	}),
};

export const FormikWrapper: React.FC<{
	initialValues: Partial<TBaseGig>;
	onSubmit: (values: Partial<TBaseGig>) => Promise<void>;
	validationSchema: Yup.ObjectSchema<any>;
	children: (formik: FormikProps<Partial<TBaseGig>>) => React.ReactNode;
}> = ({validationSchema, onSubmit, children, initialValues}) => {
	return (
		<Formik
			initialValues={initialValues}
			validationSchema={validationSchema}
			onSubmit={onSubmit}>
			{children}
		</Formik>
	);
};
