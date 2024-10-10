import Box from '@/components/design-sytem/box';
import Flex from '@/components/design-sytem/flex';
import Separator from '@/components/design-sytem/separator';
import styled from '@/components/design-sytem/theme';
import {Caption, H2, H3, Paragraph} from '@/components/design-sytem/typography';
import Breadcrumbs from '@/components/ui/breadcrumbs';
import GeneralLayout from '@/layout/GeneralLayout';
import {CameraIcon} from '@heroicons/react/24/outline';
import {Avatar, Button, Card, RadioCards, TextField} from '@radix-ui/themes';
import {Formik, useFormik} from 'formik';
import {useMemo, useState} from 'react';
import Image from 'next/image';
import * as Yup from 'yup';
import {useMutation, useQuery} from '@tanstack/react-query';
import axiosInstance from '@/hooks/useApiFetcher';
import {Combobox, ComboboxItem} from '@/components/ui/combobox';
import {CommandItem} from '@/components/ui/command';
import {formatDate} from '@/utils/strings';
import {Check} from 'lucide-react';
import {cn} from '@/lib/utils';
import {SURVEY_ROUTES} from '@/lib/api-routes';
import {useRouter} from 'next/router';
import {AxiosRequestHeaders} from 'axios';
import {withAuth} from '@/components/withAuth';
import Spinner from '@/components/spinner/Spinner';
import useDisclosure from '@/hooks/useDisclosure';
import AddClient from '@/components/modals/create-client';
import AddRewardPolicy from '@/components/modals/create-reward-policy';

const SkeletonBox = styled('div', {
	backgroundColor: '$gray3',
	borderRadius: '4px',
	animation: 'pulse 1.5s ease-in-out infinite',
});

const SkeletonText = styled(SkeletonBox, {
	height: '1em',
	marginBottom: '0.5em',
});

const SkeletonInput = styled(SkeletonBox, {
	height: '2.5em',
	width: '100%',
	marginBottom: '1em',
});

const SkeletonButton = styled(SkeletonBox, {
	height: '2.5em',
	width: '8em',
});

export const TextInput = styled(TextField.Root, {
	maxWidth: 512,
	minWidth: 400,
});

const RequiredAsterisk = styled('span', {
	color: '$danger',
	marginLeft: '2px',
});

export const ErrorMessage = styled(Caption, {
	color: '$danger',
	marginTop: '4px',
});

const validationSchema = Yup.object({
	client: Yup.string().required('Client is required'),
	title: Yup.string().required('Title is required'),
	description: Yup.string().required('Description is required'),
	closingDate: Yup.date().required('Closing date is required'),
	rewardPolicy: Yup.string(),
	location: Yup.string(),
	questionOrdering: Yup.string().oneOf(['preserve', 'shuffle']),
	difficulty: Yup.string().oneOf(['easy', 'hard', 'extreme']),
});

type ClientItem = {
	_id: string;
	name: string;
	email: string;
	profilePic: string;
};

export const ClientsCombobox = (props: {
	data: any[];
	form: any;
	value: string;
}) => {
	const renderVoucherItem = (
		item: ComboboxItem<ClientItem>,
		isSelected: boolean,
		handleSelect: (value: string) => void,
	) => {
		return (
			<CommandItem
				onSelect={handleSelect}
				key={item.value}
				value={item.value}
				className="flex">
				<Check
					className={cn(
						'mr-2 h-4 w-4',
						isSelected ? 'opacity-100' : 'opacity-0',
					)}
				/>
				<Flex alignItems={'center'}>
					<Box className="relative">
						<Avatar
							fallback={item.data.email.substring(0, 1)}
							src={item.data.profilePic}
							className="mr-4 rounded-full"
							style={{height: 48, width: 48}}
						/>
					</Box>
					<Flex
						direction={'column'}
						justifyContent={'between'}
						className="flex-1">
						<Paragraph className="truncate">{item.label}</Paragraph>
						<Caption>{item.data.email}</Caption>
					</Flex>
				</Flex>
			</CommandItem>
		);
	};

	return (
		<Combobox<ClientItem>
			onChange={(value) => props.form.setFieldValue('client', value)}
			items={props.data}
			renderItem={renderVoucherItem}
			placeholder="Select a client"
			emptyMessage="No clients found"
			footerAction={null}
			value={props.value}
		/>
	);
};

type RewardPolicyItem = {
	_id: string;
	name: string;
	dollarValue: number;
	pointsValue: number;
	voucher: string | null;
	createdAt: string;
};

export const RewardPoliciesCombobox = (props: {
	data: any[];
	form: any;
	value: string;
}) => {
	const renderRewardPolicyItem = (
		item: ComboboxItem<RewardPolicyItem>,
		isSelected: boolean,
		handleSelect: (value: string) => void,
	) => {
		return (
			<CommandItem
				onSelect={handleSelect}
				key={item.value}
				value={item.value}
				className="flex">
				<Check
					className={cn(
						'mr-2 h-4 w-4',
						isSelected ? 'opacity-100' : 'opacity-0',
					)}
				/>
				<Flex
					direction={'column'}
					className="flex-1">
					<Paragraph
						className="truncate"
						weight={'semibold'}
						color={'primary'}>
						{item.label}
					</Paragraph>
					<Caption>
						${item.data.dollarValue} &bull; {item.data.pointsValue} XP
						{item.data.voucher && <> &bull; Includes voucher</>}
					</Caption>
					<Caption color="secondary">
						Created: {formatDate(item.data.createdAt)}
					</Caption>
				</Flex>
			</CommandItem>
		);
	};

	return (
		<Combobox<RewardPolicyItem>
			onChange={(value) => props.form.setFieldValue('rewardPolicy', value)}
			items={props.data}
			renderItem={renderRewardPolicyItem}
			placeholder="Select a reward policy"
			emptyMessage="No reward policies found"
			footerAction={null}
			value={props.value}
		/>
	);
};

const CreateGig = () => {
	const router = useRouter();
	const [previewImage, setPreviewImage] = useState('/gig-placeholder.png');
	const {
		isOpen: isAddClientModalOpen,
		onClose: closeAddClientModal,
		onOpen: openAddClientModal,
	} = useDisclosure();
	const {
		isOpen: isAddRewardPolicyModalOpen,
		onClose: closeAddRewardPolicyModal,
		onOpen: openAddRewardPolicyModal,
	} = useDisclosure();

	const formik = useFormik({
		initialValues: {
			client: '',
			title: '',
			description: '',
			closingDate: '',
			coverImage: null,
			rewardPolicy: '',
			location: '',
			questionOrdering: 'preserve',
			difficulty: 'easy',
			category: 'default',
			duration: 5,
		},
		validationSchema,
		onSubmit: async (values) => {
			// put into multipart/form-data
			const safeValues = {
				name: values.title,
				description: values.description,
				difficulty: values.difficulty,
				client: values.client,
				duration: values.duration,
				coverImage: values.coverImage,
				rewardPolicy: values.rewardPolicy,
				location: values.location,
				endDate: values.closingDate,
				category: values.category,
			};

			const formData = new FormData();
			Object.keys(safeValues).forEach((key) => {
				formData.append(key, (safeValues as any)[key as any]);
			});
			return gigMutation.mutate(formData);
		},
	});

	const gigMutation = useMutation({
		mutationKey: ['gigs'],
		mutationFn: async (formData: FormData) => {
			const response = await axiosInstance.post(
				SURVEY_ROUTES.CREATE_SURVEY,
				formData,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
					} as AxiosRequestHeaders,
				},
			);

			router.push(`/gigs/${response._id}`);
		},
	});

	const clientsQuery = useQuery({
		queryKey: ['clients'],
		queryFn: async () => {
			const res = await axiosInstance.get('/admin/client');
			const data = res.docs.map((doc: any) => ({
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

	const rewardPoliciesQuery = useQuery({
		queryKey: ['reward-policies'],
		queryFn: async () => {
			const res = await axiosInstance.get('/gamification/reward-policy');

			const data = res.map((policy: any) => ({
				data: {
					name: policy.name,
					dollarValue: policy.dollarValue,
					pointsValue: policy.pointsValue,
					voucher: policy.voucher,
					createdAt: policy.createdAt,
					_id: policy._id,
				},
				label: policy.name,
				value: policy._id,
			}));
			console.log({res, data});

			return data;
		},
	});

	const selectedClient = useMemo(() => {
		if (!formik.values.client) return null;
		return clientsQuery.data?.find(
			(client: any) => client.value === formik.values.client,
		);
	}, [formik.values.client, clientsQuery.data]);

	const selectedRewardPolicy = useMemo(() => {
		if (!rewardPoliciesQuery.data) return null;
		const policy = rewardPoliciesQuery.data.find(
			(item: any) => item.value === formik.values.rewardPolicy,
		);
		return policy ?? null;
	}, [formik.values.rewardPolicy, rewardPoliciesQuery.data]);

	const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			formik.setFieldValue('coverImage', file);
			setPreviewImage(URL.createObjectURL(file));
		}
	};

	const addClientModalCallback = (client: string) =>
		formik.setFieldValue('client', client);
	const addRewardPolicyModalCallback = (rewardPolicy: string) =>
		formik.setFieldValue('rewardPolicy', rewardPolicy);

	return (
		<GeneralLayout>
			<Box className="p-4 pb-16 grid grid-cols-4 container mx-auto gap-8">
				<Box className="col-span-3 h-full ">
					<div className="h-full ">
						<div className="flex flex-col h-full">
							<Box className="px-2 mb-4">
								<Breadcrumbs items={['Dashboard', 'Gigs', 'Create gig']} />
							</Box>
							<Box className="px-4 mb-8">
								<H2 className="tracking-tight">Add a new gig</H2>
								<Paragraph>
									Create a gig to start collecting responses.
								</Paragraph>
								<Separator className="my-2" />
								<Caption>
									<em>
										Required fields are marked with an asterisk (
										<RequiredAsterisk>*</RequiredAsterisk>).
									</em>
								</Caption>
							</Box>

							<form onSubmit={formik.handleSubmit}>
								<Flex
									direction={'column'}
									alignItems={'start'}
									className="px-4 space-y-6">
									<Box>
										<label className="space-y-2">
											<Paragraph weight={'semibold'}>
												Client <RequiredAsterisk>*</RequiredAsterisk>
											</Paragraph>
											{clientsQuery.data && (
												<ClientsCombobox
													data={clientsQuery.data}
													form={formik}
													value={formik.values.client}
												/>
											)}
											{formik.touched.client && formik.errors.client && (
												<ErrorMessage>{formik.errors.client}</ErrorMessage>
											)}
										</label>
										<Flex>
											<Caption color={'secondary'}>
												Select a client to associate this gig with.
											</Caption>
											<AddClient
												callback={addClientModalCallback}
												trigger={
													<Caption
														as={'button'}
														weight={'bold'}
														color={'primary'}>
														Add a new client?
													</Caption>
												}
											/>
										</Flex>
									</Box>
									<Separator />
									<label className="space-y-2">
										<Paragraph weight={'semibold'}>
											Title <RequiredAsterisk>*</RequiredAsterisk>
										</Paragraph>
										<TextInput
											className="mb-2"
											name="title"
											value={formik.values.title}
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
										/>
										{formik.touched.title && formik.errors.title && (
											<ErrorMessage>{formik.errors.title}</ErrorMessage>
										)}
										<Caption color={'secondary'}>
											Pay attention to the title and make sure it aligns with
											the goals of the client and their brand voice.
										</Caption>
									</label>
									<label className="space-y-2">
										<Paragraph weight={'semibold'}>
											Description <RequiredAsterisk>*</RequiredAsterisk>
										</Paragraph>
										<TextInput
											className="mb-2"
											name="description"
											value={formik.values.description}
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
										/>
										{formik.touched.description &&
											formik.errors.description && (
												<ErrorMessage>{formik.errors.description}</ErrorMessage>
											)}
									</label>
									<label className="space-y-2">
										<Paragraph weight={'semibold'}>
											Closing date <RequiredAsterisk>*</RequiredAsterisk>
										</Paragraph>
										<TextInput
											className="mb-2"
											name="closingDate"
											type="date"
											value={formik.values.closingDate}
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
										/>
										{formik.touched.closingDate &&
											formik.errors.closingDate && (
												<ErrorMessage>{formik.errors.closingDate}</ErrorMessage>
											)}
										<Caption color={'secondary'}>
											The closing date is the last date by which the gig can be
											completed.
										</Caption>
									</label>

									<label className="space-y-2">
										<Paragraph weight={'semibold'}>
											Estimated duration <RequiredAsterisk>*</RequiredAsterisk>
										</Paragraph>
										<TextInput
											className="mb-2"
											name="duration"
											type="number"
											value={formik.values.duration}
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
										/>
										{formik.touched.closingDate && formik.errors.duration && (
											<ErrorMessage>{formik.errors.duration}</ErrorMessage>
										)}
										<Caption color={'secondary'}>
											The closing date is the last date by which the gig can be
											completed.
										</Caption>
									</label>
									<label className="space-y-2">
										<Paragraph weight={'semibold'}>Cover image</Paragraph>
										<Card
											style={{
												minWidth: 400,
												maxWidth: 512,
												alignItems: 'center',
												display: 'flex',
												justifyContent: 'center',
												flexDirection: 'column',
												zIndex: 0,
											}}
											className="py-4 relative z-0 cursor-pointer">
											<CameraIcon className="size-4" />
											<Paragraph
												weight={'medium'}
												className="flex items-center gap-2">
												Click to select an image
											</Paragraph>
											<Caption color={'secondary'}>
												Only image files are supported. (PNG, JPG, JPEG)
											</Caption>
										</Card>
										<input
											id="coverImage"
											className="hidden"
											type="file"
											accept="image/*"
											onChange={handleImageChange}
										/>
										{formik.values.coverImage && (
											<Caption
												className="mt-2"
												color={'secondary'}
												weight={'bold'}>
												{(formik.values.coverImage as File).name}
											</Caption>
										)}
									</label>
									<Separator />
									<H3
										color={'primary'}
										className="mb-2">
										Additional information
									</H3>
									<Box className="space-y-2">
										<label className="space-y-2">
											<Paragraph weight={'semibold'}>Reward Policy</Paragraph>
											{rewardPoliciesQuery.data && (
												<RewardPoliciesCombobox
													data={rewardPoliciesQuery.data}
													form={formik}
													value={formik.values.rewardPolicy}
												/>
											)}
											{formik.touched.rewardPolicy &&
												formik.errors.rewardPolicy && (
													<ErrorMessage>
														{formik.errors.rewardPolicy}
													</ErrorMessage>
												)}
										</label>
										<Flex>
											<Caption color={'secondary'}>
												Select a reward policy for this gig.
											</Caption>
											<AddRewardPolicy
												callback={addRewardPolicyModalCallback}
												trigger={
													<Caption
														as={'button'}
														onClick={openAddRewardPolicyModal}
														weight={'bold'}
														color={'primary'}>
														Create new reward policy?
													</Caption>
												}
											/>
										</Flex>
									</Box>
									<label className="space-y-2">
										<Paragraph weight={'semibold'}>Location</Paragraph>
										<TextInput
											className="mb-2"
											name="location"
											value={formik.values.location}
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
										/>
									</label>
									<Separator />
									<H3 className="mb-2">Gig behaviour and options</H3>
									<Box
										className="mb-6"
										css={{maxWidth: 800}}>
										<Paragraph
											weight={'medium'}
											color={'primary'}>
											Question ordering
										</Paragraph>
										<Paragraph className="mb-4">
											Configure how questions are presented to participants of
											this gig.
										</Paragraph>
										<RadioCards.Root
											name="questionOrdering"
											value={formik.values.questionOrdering}
											onValueChange={(value) =>
												formik.setFieldValue('questionOrdering', value)
											}
											defaultValue="preserve"
											columns={{initial: '1', sm: '3'}}>
											<RadioCards.Item value="preserve">
												<Flex direction="column">
													<Paragraph
														weight="bold"
														color={'primary'}>
														Preserve order
													</Paragraph>
													<Paragraph>
														Questions will be presented in the order they were
														added.
													</Paragraph>
												</Flex>
											</RadioCards.Item>
											<RadioCards.Item value="shuffle">
												<Flex direction="column">
													<Paragraph
														weight="bold"
														color={'primary'}>
														Shuffle mode
													</Paragraph>
													<Paragraph>
														Shuffle the questions every time they're presented.
													</Paragraph>
												</Flex>
											</RadioCards.Item>
										</RadioCards.Root>
									</Box>
									<Box css={{maxWidth: 800}}>
										<Paragraph
											weight={'bold'}
											color={'primary'}>
											Difficulty
										</Paragraph>
										<Paragraph className="mb-4">
											How difficult is it to complete this gig for an average
											person
										</Paragraph>
										<RadioCards.Root
											name="difficulty"
											value={formik.values.difficulty}
											onValueChange={(value) =>
												formik.setFieldValue('difficulty', value)
											}
											defaultValue="easy"
											columns={{initial: '1', sm: '3'}}>
											<RadioCards.Item value="easy">
												<Flex direction="column">
													<Paragraph
														weight="bold"
														color={'primary'}>
														Easy
													</Paragraph>
													<Paragraph>
														Pretty straightforward, no domain experience
														required.
													</Paragraph>
												</Flex>
											</RadioCards.Item>
											<RadioCards.Item value="hard">
												<Flex direction="column">
													<Paragraph
														weight="bold"
														color={'primary'}>
														Hard
													</Paragraph>
													<Paragraph>
														Domain experience might be required, but at the
														general level
													</Paragraph>
												</Flex>
											</RadioCards.Item>
											<RadioCards.Item value="extreme">
												<Flex direction="column">
													<Paragraph
														weight="bold"
														color={'primary'}>
														Extreme
													</Paragraph>
													<Paragraph>
														Requires in-depth knowledge of the subject-matter.
													</Paragraph>
												</Flex>
											</RadioCards.Item>
										</RadioCards.Root>
									</Box>
									<Separator />
									<Flex className="space-y-2">
										<Button
											type="submit"
											color={gigMutation.isPending ? 'blue' : 'indigo'}
											disabled={!formik.isValid || gigMutation.isPending}>
											{gigMutation.isPending ? (
												<>
													<Spinner /> Creating...
												</>
											) : (
												'Create gig'
											)}
										</Button>
									</Flex>
									<Flex className="space-y-2">
										{gigMutation.isError && (
											<ErrorMessage>
												{(gigMutation.data as any)?.message ??
													gigMutation.error?.message}
											</ErrorMessage>
										)}
									</Flex>
								</Flex>
							</form>
						</div>
					</div>
				</Box>
				<GigPreview
					selectedClient={selectedClient}
					previewImage={previewImage}
					formik={formik}
					selectedRewardPolicy={selectedRewardPolicy}
				/>
			</Box>
		</GeneralLayout>
	);
};

const ClientSkeleton = () => (
	<Flex
		alignItems="center"
		css={{gap: 16}}>
		<SkeletonBox css={{width: '48px', height: '48px', borderRadius: '50%'}} />
		<Box>
			<SkeletonText css={{width: '100px'}} />
			<SkeletonText css={{width: '150px'}} />
		</Box>
	</Flex>
);

const GigSkeleton = () => (
	<>
		<SkeletonBox css={{width: '100%', height: '400px', borderRadius: '16px'}} />
		<Box>
			<SkeletonText css={{width: '80%'}} />
			<SkeletonText css={{width: '100%'}} />
			<SkeletonText css={{width: '60%'}} />
		</Box>
	</>
);

export default withAuth(CreateGig);

function GigPreview({
	selectedClient,
	selectedRewardPolicy,
	formik,
	previewImage,
}: {
	selectedClient: any;
	previewImage: string;
	formik: any;
	selectedRewardPolicy: any;
}) {
	return (
		<Box className="col-span-1 h-fit sticky top-[48px] space-y-4 py-8">
			{selectedClient?.data ? (
				<Flex
					alignItems={'center'}
					css={{gap: 16}}>
					<Avatar
						radius={'full'}
						fallback={'C'}
						src={selectedClient.data.profilePic}
					/>
					<Box>
						<Paragraph
							weight={'bold'}
							color={'primary'}>
							{selectedClient.data.name || 'No name'}
						</Paragraph>
						<Caption>{selectedClient.data.email}</Caption>
					</Box>
				</Flex>
			) : (
				<ClientSkeleton />
			)}
			{previewImage ? (
				<Box
					css={{
						backgroundColor: '$gray1',
						borderRadius: 16,
						height: 400,
						overflow: 'hidden',
						position: 'relative',
					}}
					className="pressable-shadow">
					<Image
						src={previewImage}
						alt="Gig preview"
						fill
					/>
				</Box>
			) : (
				<SkeletonBox
					css={{width: '100%', height: '400px', borderRadius: '16px'}}
				/>
			)}
			<Box>
				{formik.values.title ? (
					<Paragraph
						weight={'bold'}
						color="primary"
						className="mb-2">
						{formik.values.title || 'Gig Title'}
					</Paragraph>
				) : (
					<SkeletonText css={{width: '80%'}} />
				)}
				{formik.values.description ? (
					<Paragraph className="mb-2">
						{formik.values.description || 'Gig description will appear here.'}
					</Paragraph>
				) : (
					<SkeletonText css={{width: '100%'}} />
				)}
				<Flex>
					{selectedRewardPolicy ? (
						<Paragraph color={'primary'}>
							US$ {selectedRewardPolicy.data.dollarValue}
						</Paragraph>
					) : (
						<SkeletonText css={{width: '60%'}} />
					)}
					{selectedRewardPolicy && <Paragraph>&bull;</Paragraph>}
					{selectedRewardPolicy ? (
						<Paragraph color={'primary'}>
							{selectedRewardPolicy.data.pointsValue}XP
							{selectedRewardPolicy.data.voucher && <> &bull; Plus Voucher</>}
						</Paragraph>
					) : (
						<SkeletonText css={{width: '60%'}} />
					)}
				</Flex>
			</Box>
		</Box>
	);
}
