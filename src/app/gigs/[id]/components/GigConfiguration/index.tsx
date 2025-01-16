import { Caption, H2 } from '@/components/design-sytem/typography';

import { Paragraph } from '@/components/design-sytem/typography';

import { Flex } from '@radix-ui/themes';

import { Section } from '@radix-ui/themes';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BasicInfoValues, TabProps, GigFormValues } from '../types';
import { ClientsCombobox } from '@/components/gig/create-gig-components/ClientsCombobox';
import {
	ErrorMessage,
	TextInput,
} from '@/components/gig/create-gig-components/extras';
import FormBottomBar from '../ui/FormBottomBar';
import axiosServerInstance from '@/helpers/server/auth/axiosServerInstance';
import axiosClientInstance from '@/helpers/server/auth/axiosClientInstance';
import {
	Tabs,
	Tab,
	TabList,
	TabPanel,
} from '@/components/ui/aria-components/Tabs';
import Symbol from '@/components/icons/symbol';
import { Separator } from '@/components/ui/aria-components/Separator';
import QuestionOrderingSection from './atoms/QuestionOrdering';
import DifficultySection from './atoms/DifficultySection';
import GigRewardPolicyConfig from './GigRewards';
import GigClientConfig from './GigClient';
import { Card } from '@/components/ui/card';
import FormIslandCard from './atoms/FormIslandCard';
import apiClient from '@/hooks/useApiFetcher';
import { toast } from 'sonner';
import TargetingAndRequirements from './atoms/TargetingAndRequirements';
import * as Yup from 'yup';

const GigConfig = ({
	_id,
	client,
	description,
	name,
	mutate,
	isPending,
	formik,
	gig,
}: TabProps & BasicInfoValues) => {
	const queryClient = useQueryClient();

	const updateGigMutation = useMutation<any, Error, Partial<GigFormValues>>({
		mutationFn: async (values) => {
			const cleanedValues = Object.fromEntries(
				Object.entries(values).filter(([_, v]) => v !== undefined)
			);

			const response = await axiosClientInstance.put(`/survey/${_id}`, cleanedValues);
			return response.data;
		},
		onSuccess: () => {
			toast.success('Gig updated successfully');
			queryClient.invalidateQueries({ queryKey: ['gig', _id] });
			formik.resetForm({ values: formik.values });
		},
		onError: (error) => {
			toast.error('Failed to update gig');
			console.error('Update error:', error);
		},
	});

	const handleBasicInfoSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (formik.isValid) {
			try {
				await updateGigMutation.mutateAsync({
					name: formik.values.name,
					description: formik.values.description,
				});
			} catch (error) {
				console.error('Submit error:', error);
			}
		}
	};

	const { values, errors, touched, handleChange, handleBlur, setFieldValue } =
		formik;
	const clientsQuery = useQuery({
		queryKey: ['clients'],
		queryFn: async () => {
			const res = await axiosClientInstance.get('/admin/client');
			const data = res.data.docs.map((doc: any) => ({
				data: {
					name: doc.firstname,
					email: doc.user.email,
					profilePic: doc.profilePic,
					_id: doc.user._id,
				},
				label: doc.firstname,
				value: doc.user._id,
			}));

			return data;
		},
	});

	const validationSchema = Yup.object({
		targetGender: Yup.string().oneOf(['Male', 'Female', 'Other', 'All']).required(),
		targetAgeRange: Yup.object({
			min: Yup.number().min(13).required(),
			max: Yup.number().max(100).required()
		}),
		location: Yup.object({
			type: Yup.string().oneOf(['all', 'country', 'city']).required(),
			countries: Yup.array().of(Yup.string()),
			cities: Yup.array().of(
				Yup.object({
					country: Yup.string().required(),
					_id: Yup.string().required()
				})
			)
		}),
		languageRequirements: Yup.array().of(Yup.string()),
		educationLevel: Yup.string().oneOf(['highSchool', 'bachelors', 'masters', 'phd'])
	});

	return (
		<>
			<Separator />
			<Tabs className={'h-full'}>
				<div className="flex space-x-4 w-full h-full relative">
					<TabList className="flex flex-col w-[280px] sticky top-0 p-4">
						<Tab
							id="basic-information"
							className="px-2 py-1.5 rounded-xl flex items-center gap-2">
							<Symbol>description</Symbol>
							Basic Information
						</Tab>
						<Tab
							id="targeting"
							className="px-2 py-1.5 rounded-xl flex items-center gap-2">
							<Symbol>target</Symbol>
							Targeting & Behaviour
						</Tab>
						<Tab
							id="client"
							className="px-2 py-1.5 rounded-xl flex items-center gap-2">
							<Symbol>storefront</Symbol>
							Client
						</Tab>
						<Tab
							id="reward-policy"
							className="px-2 py-1.5 rounded-xl flex items-center gap-2">
							<Symbol>award_star</Symbol>
							Reward Policy
						</Tab>
					</TabList>
					<div className="bg-white px-8 py-4 shadow h-full flex-1 overflow-y-auto pb-40">
						<TabPanel id="basic-information" className="max-w-2xl">
							<FormIslandCard
								formik={formik}
								title="Basic Information"
								onSubmit={handleBasicInfoSubmit}>
								<div className="flex flex-col space-y-4">
									<label className="mb-4">
										<Paragraph weight={'bold'}>
											Title <span className="text-red-500">*</span>
										</Paragraph>
										<TextInput
											name="name"
											value={values.name}
											onChange={(value) => setFieldValue('name', value)}
											onBlur={handleBlur}
										/>
										{touched.name && errors.name && (
											<ErrorMessage>{errors.name}</ErrorMessage>
										)}
										<Caption
											color={'secondary'}
											className="mt-2">
											Pay attention to the title and make sure it aligns with
											the goals of the client and their brand voice.
										</Caption>
									</label>

									<label className="mb-4">
										<Paragraph weight={'bold'}>
											Description <span className="text-red-500">*</span>
										</Paragraph>
										<TextInput
											name="description"
											value={values.description}
											onChange={(value) => setFieldValue('description', value)}
											onBlur={handleBlur}
										/>
										{touched.description && errors.description && (
											<ErrorMessage>{errors.description}</ErrorMessage>
										)}
									</label>
								</div>
							</FormIslandCard>
						</TabPanel>
						<TabPanel id="targeting" className={'max-w-2xl pb-40'}>
							<FormIslandCard
								formik={formik}
								title="Targeting and Requirements"
								onSubmit={async (e) => {
									e.preventDefault();
									if (formik.isValid) {
										await updateGigMutation.mutateAsync({
											targetGender: formik.values.targetGender,
											targetAgeRange: formik.values.targetAgeRange,
											location: formik.values.location,
											languageRequirements: formik.values.languageRequirements,
											educationLevel: formik.values.educationLevel,
										});
									}
								}}>
								<TargetingAndRequirements
									formik={formik}
									gig={gig}
									updateGigMutation={updateGigMutation}
								/>
							</FormIslandCard>
						</TabPanel>
						<TabPanel
							id="client"
							className={'max-w-2xl'}>
							<GigClientConfig
								_id={_id as string}
								gig={gig}
								formik={formik}
								mutate={mutate}
								isPending={isPending}
								rewardPolicy={gig.rewardPolicy?._id}
								updateGigMutation={updateGigMutation}
							/>
						</TabPanel>
						<TabPanel
							id="reward-policy"
							className={'max-w-2xl'}>
							<GigRewardPolicyConfig
								_id={_id as string}
								gig={gig}
								formik={formik}
								mutate={mutate}
								isPending={isPending}
								rewardPolicy={gig.rewardPolicy?._id}
								updateGigMutation={updateGigMutation}
							/>
						</TabPanel>
					</div>
				</div>
			</Tabs>
		</>
	);
};

export default GigConfig;
