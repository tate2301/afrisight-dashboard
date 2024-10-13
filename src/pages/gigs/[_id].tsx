import {useRouter} from 'next/router';
import {Suspense, useCallback, useEffect, useMemo, useState} from 'react';
import {Card, CardContent, CardHeader} from '@/components/ui/card';
import {Skeleton} from '@/components/ui/skeleton';
import GeneralLayout from '@/layout/GeneralLayout';
import axiosInstance from '@/hooks/useApiFetcher';
import {SURVEY_ROUTES} from '@/lib/api-routes';
import {Save} from 'lucide-react';
import {
	Badge,
	Button,
	Checkbox,
	RadioCards,
	Section,
	Tabs,
	Text,
} from '@radix-ui/themes';
import {FormBuilder} from '@/forms-builder/components/FormBuilder';
import {FormProvider, useFormContext} from '@/forms-builder/context';
import Flex from '@/components/design-sytem/flex';
import Box from '@/components/design-sytem/box';
import {ColumnDef, getCoreRowModel, useReactTable} from '@tanstack/react-table';
import {useFormik} from 'formik';
import {
	Caption,
	H1,
	H2,
	H3,
	Paragraph,
} from '@/components/design-sytem/typography';
import Separator from '@/components/design-sytem/separator';
import apiClient from '@/hooks/useApiFetcher';
import {
	keepPreviousData,
	UseMutateFunction,
	useMutation,
	useQuery,
	useQueryClient,
} from '@tanstack/react-query';
import Spinner from '@/components/ui/spinner';
import {GigClientInfo} from '@/components/gig-form/GigClientInfo';
import {withFormState} from '@/components/gig-form/withFormState';
import {GigDateInfo} from '@/components/gig-form/GigDateInfo';
import {GigRewardPolicy} from '@/components/gig-form/GigRewardPolicy';
import {DataTable} from '@/components/ui/datatable';
import {TABLE_ACTIONS_HEIGHT} from '@/components/shells/TablePageHeader';
import {ClientsCombobox} from '../../components/gig/create-gig-components/ClientsCombobox';
import {
	ErrorMessage,
	TextInput,
} from '../../components/gig/create-gig-components/extras';
import TableLink from '@/components/ui/datatable/Link';
import {Gig} from '@/utils/types';

type User = {
	role: 'CLIENT';
	status: 'ACTIVE' | 'INACTIVE';
	email: string;
	username: string;
	isEmailVerified: boolean;
	isPhoneVerified: boolean;
	isSocialConnectedUser: boolean;
	emailVerificationToken: string | null;
	emailVerificationTokenExpires: string | null;
	password: string;
	refreshTokens: string[];
	resetPasswordExpires: string | null;
	resetPasswordToken: string | null;
	createdAt: string;
	updatedAt: string;
	lastLogin: string;
	_id: string;
	__v: number;
};

type RewardPolicy = {
	_id: string;
	name: string;
	description: string;
	dollarValue: number;
	pointsValue: number;
};

const PATCH_GIG = (id: string) => `/survey/${id}`;

const patchGig = async (_id: string, data: FormState) =>
	apiClient.put(PATCH_GIG(_id), data);

type TabProps = {
	_id: string;
	mutate: UseMutateFunction<void, Error, FormState, unknown>;
	isPending: boolean;
	formik: any;
};
type BehaviorTabValues = Pick<FormState, 'questionOrdering' | 'difficulty'>;
type RewardPolicyValues = Pick<FormState, 'rewardPolicy'>;
interface GigBasicInfoProps {
	values: any;
	errors: any;
	touched: any;
	handleChange: (e: React.ChangeEvent<any>) => void;
	handleBlur: (e: React.FocusEvent<any>) => void;
	setFieldValue: (field: string, value: any) => void;
}

type Response = {
	_id: string;
	email: string;
	createdAt: string;
	[key: string]: string | number;
};
type BasicInfoValues = Pick<Gig, 'name' | 'description' | 'client'>;

interface FormBuilderHeaderProps {
	save: (form: any) => void;
	publish: (form: any) => void;
	status: string;
	isPublishing: boolean;
	isSaving: boolean;
}

type FormState = Partial<Omit<Gig, 'rewardPolicy'> & {rewardPolicy?: string}>;

export default function GigPage() {
	const router = useRouter();
	const queryClient = useQueryClient();
	const {_id: id} = router.query;
	const queryKey = `gig-${id}`;

	const fetchGigData = async (id: string) => {
		const gigResponse = await axiosInstance.get(
			SURVEY_ROUTES.GET_SURVEY_BY_ID(id),
		);

		return gigResponse;
	};

	const gig = useQuery({
		queryKey: [queryKey],
		queryFn: async () => {
			return fetchGigData(id as string);
		},
		enabled: !!id,
	});

	const survey: Gig | undefined = useMemo(() => gig?.data ?? undefined, [gig]);

	const {mutate, isPending} = useMutation({
		mutationFn: async (values: FormState) => {
			await patchGig(id as string, values);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({queryKey: [queryKey]});
		},
	});

	const publishMutation = useMutation({
		mutationFn: async () => {
			await apiClient.post(`/survey/${id as string}/publish/toggle`);
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({queryKey: [queryKey]});
		},
	});

	const saveGigChanges = useCallback(
		(form: string) => {
			if (!survey) return;

			if (survey) {
				const values = {...(survey as Gig), form: form} as unknown as FormState;
				mutate(values);
			}
		},
		[survey],
	);

	const publishGig = useCallback(
		(form: any) => {
			publishMutation.mutate();
		},
		[saveGigChanges],
	);

	if (!survey) {
		return (
			<GeneralLayout>
				<GigSkeleton />
			</GeneralLayout>
		);
	}

	return (
		<GigPresenter
			{...{
				survey,
				mutate,
				isPending,
				saveGigChanges,
				publishGig,
				isPublishing: publishMutation.isPending,
			}}
		/>
	);
}

function GigPresenter(props: {
	survey: Gig;
	mutate: UseMutateFunction<void, Error, FormState, unknown>;
	isPending: boolean;
	saveGigChanges: (form: any) => void;
	publishGig: (form: any) => void;
	isPublishing: boolean;
}) {
	const {survey, mutate, isPending, saveGigChanges, publishGig} = props;
	const {_id: id} = survey;

	const formik = useFormik({
		initialValues: {
			...survey,
			rewardPolicy: survey.rewardPolicy?._id,
		} as Partial<Omit<Gig, 'rewardPolicy'> & {rewardPolicy?: string}>,
		onSubmit: (values: FormState) => mutate(values),
	});

	return (
		<GeneralLayout>
			<Suspense fallback={<GigSkeleton />}>
				{survey && (
					<FormProvider initialForm={survey?.form}>
						<Tabs.Root defaultValue="responses">
							<Tabs.List className="flex justify-between gap-2 sticky top-0 h-[48px] z-[2000] bg-white">
								<Flex className="h-full items-end">
									<Tabs.Trigger value="responses">Responses</Tabs.Trigger>
									<Tabs.Trigger value="questions">Questions</Tabs.Trigger>
									{/* <Tabs.Trigger value="basic-info">Settings</Tabs.Trigger>
                  <Tabs.Trigger value="additional">Additional information</Tabs.Trigger>
                  <Tabs.Trigger value="reward-policy">Reward Policy</Tabs.Trigger> */}
								</Flex>
								<NavActions
									save={saveGigChanges}
									publish={publishGig}
									isPublishing={props.isPublishing}
									isSaving={props.isPending}
									status={survey?.status}
								/>
							</Tabs.List>
							<ResponsesTab _id={id as string} />
							<QuestionsTab
								_id={id as string}
								description={survey.description}
								name={survey.name}
								form={survey.form}
							/>
							{survey && (
								<BasicInfoTab
									formik={formik}
									{...survey}
									mutate={mutate}
									isPending={isPending}
								/>
							)}
							<BehaviorTab
								_id={id as string}
								formik={formik}
								mutate={mutate}
								isPending={isPending}
							/>
							<Tabs.Content value="reward-policy">
								<RewardPolicyTab
									_id={id as string}
									formik={formik}
									mutate={mutate}
									isPending={isPending}
									rewardPolicy={survey.rewardPolicy?._id}
								/>
							</Tabs.Content>
						</Tabs.Root>
					</FormProvider>
				)}
			</Suspense>
		</GeneralLayout>
	);
}

function GigSkeleton() {
	return (
		<Card className="mx-auto mt-8">
			<CardHeader>
				<Skeleton className="h-8 w-3/4" />
			</CardHeader>
			<CardContent>
				<Skeleton
					className="h-4 w-full mb-2"
					count={3}
				/>
				<Skeleton className="h-6 w-1/4 mb-4" />
				<Skeleton className="h-10 w-32" />
			</CardContent>
		</Card>
	);
}

const NavActions = ({
	save,
	publish,
	isSaving,
	isPublishing,
	status,
}: FormBuilderHeaderProps) => {
	const {form, exportForm} = useFormContext();
	const onSaveChanges = () => save(exportForm());
	const onPublish = () => publish(form);
	return (
		<Flex
			alignItems="center"
			className="px-4"
			css={{gap: '8px'}}>
			<Badge
				style={{fontWeight: '500'}}
				color={
					status === 'DRAFT' ? 'blue' : status === 'ACTIVE' ? 'green' : 'red'
				}>
				{status}
			</Badge>
			<Button
				color={
					status === 'DRAFT' ? 'blue' : status === 'ACTIVE' ? 'red' : 'green'
				}
				loading={isPublishing}
				onClick={onPublish}>
				{status === 'DRAFT'
					? 'Enable submissions'
					: status === 'PAUSED'
						? 'Resume submissions'
						: 'Pause submissions'}
			</Button>
			<Button
				variant="outline"
				color="blue"
				loading={isSaving}
				onClick={onSaveChanges}>
				<Save className="size-4 mr-2" />
				Save changes
			</Button>
		</Flex>
	);
};

const FormTabBottomBar = ({
	dirty,
	loading,
}: {
	dirty: boolean;
	loading: boolean;
}) => (
	<>
		<Separator className="my-6" />
		<Flex css={{marginTop: 20}}>
			<Button
				type={'submit'}
				disabled={!dirty || loading}
				loading={loading}>
				{loading ? <Spinner /> : 'Save changes'}
			</Button>
		</Flex>
	</>
);

/** Forms */

const ClientInfo = withFormState(({formik}: {formik: any}) => (
	<form onSubmit={formik.handleSubmit}>
		<GigClientInfo
			values={formik.values}
			errors={formik.errors}
			touched={formik.touched}
			setFieldValue={formik.setFieldValue}
		/>
		{/* <GigBasicInfo
      values={formik.values}
      errors={formik.errors}
      touched={formik.touched}
      handleChange={formik.handleChange}
      handleBlur={formik.handleBlur}
    /> */}
		<Button
			type="submit"
			disabled={!formik.isValid || formik.isSubmitting}>
			Save Changes
		</Button>
	</form>
));

const DateInfo = ({formik}: {formik: any}) => (
	<GigDateInfo
		values={formik.values}
		errors={formik.errors}
		touched={formik.touched}
		handleChange={formik.handleChange}
		handleBlur={formik.handleBlur}
	/>
);

const RewardPolicy = ({formik}: {formik: any}) => {
	console.log({formik});
	return (
		<GigRewardPolicy
			values={formik.values}
			errors={formik.errors}
			touched={formik.touched}
			setFieldValue={formik.setFieldValue}
		/>
	);
};

const QuestionOrderingSection = ({formik}: {formik: any}) => (
	<Box
		className="mb-6"
		css={{maxWidth: 800}}>
		<Paragraph
			weight={'bold'}
			color={'primary'}>
			Question ordering
		</Paragraph>
		<Paragraph className="mb-4">
			Configure how questions are presented to participants of this gig.
		</Paragraph>
		<RadioCards.Root
			name="questionOrdering"
			value={formik.values.questionOrdering}
			onValueChange={(value) => formik.setFieldValue('questionOrdering', value)}
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
						Questions will be presented in the order they were added.
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
);

const DifficultySection = ({formik}: {formik: any}) => (
	<Box css={{maxWidth: 800}}>
		<Paragraph
			weight={'bold'}
			color={'primary'}>
			Difficulty
		</Paragraph>
		<Paragraph className="mb-4">
			How difficult is it to complete this gig for an average person
		</Paragraph>
		<RadioCards.Root
			name="difficulty"
			value={formik.values.difficulty}
			onValueChange={(value) => formik.setFieldValue('difficulty', value)}
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
						Pretty straightforward, no domain experience required.
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
						Domain experience might be required, but at the general level
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
);

export const GigBasicInfo: React.FC<GigBasicInfoProps> = ({
	values,
	errors,
	touched,
	handleChange,
	handleBlur,
	setFieldValue,
}) => {
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

	return (
		<>
			<label className="space-y-2">
				<Paragraph weight={'semibold'}>
					Client <span className="text-red-500">*</span>
				</Paragraph>
				<ClientsCombobox
					value={values.client}
					form={{setFieldValue}}
					data={clientsQuery.data ?? []}
				/>
				{touched.client && errors.client && (
					<ErrorMessage>{errors.client}</ErrorMessage>
				)}
			</label>

			<label className="mb-4">
				<Paragraph weight={'semibold'}>
					Title <span className="text-red-500">*</span>
				</Paragraph>
				<TextInput
					name="name"
					value={values.name}
					onChange={handleChange}
					onBlur={handleBlur}
				/>
				{touched.name && errors.name && (
					<ErrorMessage>{errors.name}</ErrorMessage>
				)}
				<Caption
					color={'secondary'}
					className="mt-2">
					Pay attention to the title and make sure it aligns with the goals of
					the client and their brand voice.
				</Caption>
			</label>

			<label className="mb-4">
				<Paragraph weight={'semibold'}>
					Description <span className="text-red-500">*</span>
				</Paragraph>
				<TextInput
					name="description"
					value={values.description}
					onChange={handleChange}
					onBlur={handleBlur}
				/>
				{touched.description && errors.description && (
					<ErrorMessage>{errors.description}</ErrorMessage>
				)}
			</label>

			{/* Add other basic info fields here */}
		</>
	);
};
/** End Forms */

/** Tabs */
const QuestionsTab = ({
	_id,
	name,
	description,
	form,
}: {_id: string} & Pick<Gig, 'description' | 'name' | 'form'>) => {
	return (
		<Tabs.Content value="questions">
			<FormBuilder
				gig_id={_id}
				formDescription={description}
				formName={name}
			/>
		</Tabs.Content>
	);
};
const BehaviorTab = ({_id, mutate, isPending, formik}: TabProps) => {
	return (
		<Tabs.Content value="additional">
			<Section className="container mx-auto">
				<form onSubmit={formik.handleSubmit}>
					<H1
						color={'primary'}
						className="mb-6">
						Gig behaviour and options
					</H1>
					<QuestionOrderingSection formik={formik} />
					<DifficultySection formik={formik} />
					<FormTabBottomBar
						dirty={formik.dirty}
						loading={isPending}
					/>
				</form>
			</Section>
		</Tabs.Content>
	);
};

const RewardPolicyTab = ({
	isPending,
	formik,
}: TabProps & RewardPolicyValues) => {
	return (
		<Tabs.Content value="reward-policy">
			<Section className="container mx-auto">
				<form onSubmit={formik.handleSubmit}>
					<H3
						weight={'semibold'}
						color={'primary'}
						className="mb-6">
						Reward Policy
					</H3>
					<RewardPolicy formik={formik} />
					<FormTabBottomBar
						dirty={formik.dirty}
						loading={isPending}
					/>
				</form>
			</Section>
		</Tabs.Content>
	);
};

const BasicInfoTab = ({
	_id,
	client,
	description,
	name,
	mutate,
	isPending,
	formik,
}: TabProps & BasicInfoValues) => {
	return (
		<Tabs.Content value={'basic-info'}>
			<Section className="container mx-auto">
				<form onSubmit={formik.handleSubmit}>
					<H2
						weight={'semibold'}
						color={'primary'}
						className="mb-6">
						Gig Settings
					</H2>
					<Paragraph className="mb-4">
						This information will be publicly available to participants
					</Paragraph>
					<Flex className="space-y-4 flex-col">
						<GigBasicInfo {...formik} />
					</Flex>
					<FormTabBottomBar
						dirty={formik.dirty}
						loading={isPending}
					/>
				</form>
			</Section>
		</Tabs.Content>
	);
};
/** End Tabs */

const responsesColumns: ColumnDef<Response>[] = [
	{
		id: 'select',
		header: ({table}) => (
			<Checkbox
				checked={
					table.getIsAllPageRowsSelected() ||
					(table.getIsSomePageRowsSelected() && 'indeterminate')
				}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				aria-label="Select all"
			/>
		),
		cell: ({row}) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label="Select row"
			/>
		),
		enableSorting: false,
		size: 40,
	},
	{
		id: 'email',
		accessorKey: 'email',
		header: 'Email',
		size: 400,
	},
];

interface IResponse {
	fieldType: 'string' | 'number' | 'date' | 'image' | 'file';
	value: any;
	question: string;
}

const isLink = (value: string) =>
	value.startsWith('http') || value.startsWith('file:');

const isEmail = (value: string) => value.includes('@');

const ResponsesTab = ({_id}: {_id: string}) => {
	const [columns, setColumns] =
		useState<ColumnDef<any, any>[]>(responsesColumns);
	const {form} = useFormContext();

	const gigResponses = useQuery({
		queryKey: ['responses', _id],
		queryFn: async () => {
			const res = await axiosInstance.get(`/admin/gigs/${_id}/responses`);
			return res.docs;
		},
		enabled: !!_id,
		placeholderData: keepPreviousData,
	});

	const questionsAsColumns = useMemo(() => {
		if (!form) return [];
		const questions = form.fields ?? [];
		console.log('Form Questions:', questions);
		return questions.map((question) => ({
			accessorKey: question.id,
			header: () => <Text className="line-clamp-1">{question.label}</Text>,
			cell: ({row}: any) => {
				const value = row.original[question.id] ?? '-';

				if (isLink(value) || isEmail(value)) {
					return (
						<TableLink
							style={{display: '-webkit-box'}}
							className="line-clamp-1 text-wrap truncate text-ellipsis inline-flex lowercase"
							href={isEmail(value) ? `mailto:${value}` : value}>
							{value}
						</TableLink>
					);
				}

				if (!isNaN(parseInt(value))) {
					return <Text className={'text-right w-full'}>{value}</Text>;
				}

				return value;
			},
			size: 320,
		}));
	}, [form]);

	useEffect(() => {
		const newColumns = [...responsesColumns, ...questionsAsColumns];
		setColumns(newColumns);
	}, [questionsAsColumns]);

	const data = useMemo(() => {
		const docs = gigResponses?.data ?? [];
		console.log({docs});
		return docs.map((doc: any) => {
			const baseData = {
				_id: doc._id,
				email: doc.email,
				createdAt: doc.createdAt,
			};
			const responses = doc.responses.reduce((acc: any, response: any) => {
				acc[response.question] = response.value;
				return acc;
			}, {});
			return {...baseData, ...responses};
		});
	}, [gigResponses]);

	return (
		<Tabs.Content value={'responses'}>
			<DataTable
				top={0}
				columns={columns}
				data={data}
				selectedItems={[]}
				onSelect={() => {}}
				tableActions={<></>}
			/>
		</Tabs.Content>
	);
};
