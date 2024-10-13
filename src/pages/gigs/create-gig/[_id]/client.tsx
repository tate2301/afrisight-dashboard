import {useRouter} from 'next/router';
import {useQuery} from '@tanstack/react-query';
import axiosInstance from '@/hooks/useApiFetcher';
import {withAuth} from '@/components/withAuth';
import useDisclosure from '@/hooks/useDisclosure';
import {
	_initialValues,
	FormikWrapper,
	validationSchemas,
} from '../../../../components/gig/create-gig-components/FormikWrapper';
import {ClientSelection} from '../../../../components/gig/create-gig-components/ClientSelection';
import Separator from '@/components/design-sytem/separator';
import {MultistageFormContainer} from '@/components/gig/MultistageFormContainer';
import {stages} from '@/components/gig/stages';
import {
	createCustomFormData,
	CustomFormData,
	PartialGig,
	useGig,
} from '@/components/gig/hooks/useGig';
import {CreateGigFooter} from '@/components/gig/layout/CreateGigFooter';
import {RewardPolicySelection} from '@/components/gig/create-gig-components/RewardPolicySelection';
import {useGigFormNavigation} from '@/components/gig/hooks/useCreateGigPagination';

const CreateGig = () => {
	const router = useRouter();
	const {_id} = router.query as {_id: string};
	const {data, mutation, cancel} = useGig(_id);
	const {saveAndContinue} = useGigFormNavigation(stages, 1);

	const {onOpen: openAddClientModal} = useDisclosure();
	const {onOpen: openAddRewardPolicyModal} = useDisclosure();

	const onSubmit = async (formData: CustomFormData<PartialGig>) => {
		const response = await mutation.mutate(formData);
		if (!response) return;
		saveAndContinue(_id);
	};

	const clientsQuery = useQuery({
		queryKey: ['clients'],
		queryFn: async () => {
			const res = await axiosInstance.get('/admin/client');
			return res.docs.map((doc: any) => ({
				data: {
					name: doc.firstname,
					email: doc.user.email,
					profilePic: doc.profilePic,
					_id: doc.user._id,
				},
				label: doc.firstname,
				value: doc.user._id,
			}));
		},
	});

	const rewardPoliciesQuery = useQuery({
		queryKey: ['reward-policies'],
		queryFn: async () => {
			const res = await axiosInstance.get('/gamification/reward-policy');
			return res.docs.map((policy: any) => ({
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
		},
	});

	return (
		<MultistageFormContainer
			documentTitle="Create a gig"
			title="Add client and set up a reward policy"
			status="In progress"
			stages={stages.map((stage) => ({
				...stage,
				href: `${_id}/${stage.href}`,
			}))}
			currentIndex={1}
			cancel={cancel}>
			{data && (
				<FormikWrapper
					initialValues={_initialValues.clientAndRewards(data)}
					validationSchema={validationSchemas.clientAndRewards}
					onSubmit={async (values) => {
						return onSubmit(createCustomFormData(values));
					}}>
					{(formik) => (
						<form
							className="space-y-8 px-4"
							onSubmit={formik.handleSubmit}>
							<ClientSelection
								clientsQuery={clientsQuery}
								formik={formik}
								openAddClientModal={openAddClientModal}
							/>

							<RewardPolicySelection
								formik={formik}
								rewardPoliciesQuery={rewardPoliciesQuery}
								openAddRewardPolicyModal={openAddRewardPolicyModal}
							/>

							<Separator />
							<CreateGigFooter
								isPending={mutation.isPending}
								disabled={!formik.isValid || mutation.isPending}
								error={mutation.error?.message}
								hasBack
							/>
						</form>
					)}
				</FormikWrapper>
			)}
		</MultistageFormContainer>
	);
};

export default withAuth(CreateGig);
