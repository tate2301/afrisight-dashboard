import {Formik, FormikProps} from 'formik';
import * as Yup from 'yup';
import {PartialGig} from '../hooks/useGig';
import {SurveyGig} from '@/pages/gigs';
import {Gig} from '@/utils/types';

const validationSchema = Yup.object({
	expectedCompletionTime: Yup.number().min(
		1,
		'Minimum completion time is 1 minute',
	),
});

export const validationSchemas = {
	basicInformation: Yup.object({
		title: Yup.string().required('Title is required'),
		description: Yup.string().required('Description is required'),
		closingDate: Yup.date().required('Closing date is required'),
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
		categories: Yup.array()
			.of(Yup.string())
			.min(1, 'At least one category is required'),
		tags: Yup.array().of(Yup.string()),
	}),
	targetting: Yup.object({
		location: Yup.string().required('Location is required'),
		languageRequirements: Yup.array().of(Yup.string()),
		educationLevel: Yup.string(),
		incomeRange: Yup.object({
			min: Yup.number(),
			max: Yup.number(),
		}),
		targetGender: Yup.string().oneOf(['Male', 'Female', 'Other', 'All']),
		targetAgeRange: Yup.object({
			min: Yup.number().min(18, 'Minimum age must be at least 18'),
			max: Yup.number().max(100, 'Maximum age must be 100 or less'),
		}),
	}),
};

export type TBaseGig = Partial<
	Omit<Gig, 'rewardPolicy' | 'coverImage' | 'client'> & {
		rewardPolicy?: string;
		coverImage: File | null;
		client: string;
		title: string;
		closingDate: string;
		location: string;
		questionOrdering: 'preserve' | 'shuffle';
		difficulty: 'easy' | 'medium' | 'hard';
		duration: number;
		category: string;
		tags: string[];
		targetAgeRange: {min: number; max: number};
		targetGender: 'Male' | 'Female' | 'Other' | 'All';
		languageRequirements: string[];
		educationLevel: string;
		incomeRange: {min: number; max: number};
	}
>;

export const _initialValues = {
	basicInformation: (gig: Partial<TBaseGig>) => ({
		title: gig.name,
		description: gig.description,
		closingDate: gig.endDate,
		coverImage: null,
	}),
	behaviorAndExperience: (gig: Partial<TBaseGig>) => ({
		difficulty: gig.difficulty ?? 'easy',
		questionOrdering: gig.questionOrdering ?? 'preserve',
	}),
	targeting: (gig: Partial<TBaseGig>) => ({
		location: gig.location ?? '',
		targetGender: gig.targetGender ?? 'All',
		targetAgeRange: gig.targetAgeRange ?? {min: 18, max: 65},
		languageRequirements: gig.languageRequirements ?? [],
		educationLevel: gig.educationLevel ?? '',
		incomeRange: gig.incomeRange ?? {min: 0, max: 100000},
	}),
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
}> = ({onSubmit, children, initialValues}) => {
	return (
		<Formik
			initialValues={initialValues}
			validationSchema={validationSchema}
			onSubmit={onSubmit}>
			{children}
		</Formik>
	);
};
