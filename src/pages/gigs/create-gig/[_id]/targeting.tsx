import {useRouter} from 'next/router';
import {withAuth} from '@/components/withAuth';
import {
	_initialValues,
	FormikWrapper,
	validationSchemas,
} from '../../../../components/gig/create-gig-components/FormikWrapper';
import Separator from '@/components/design-sytem/separator';
import {TargetingAndRequirements} from '../../../../components/gig/create-gig-components/TargetingAndRequirements';
import {MultistageFormContainer} from '@/components/gig/MultistageFormContainer';
import {stages} from '@/components/gig/stages';
import {
	createCustomFormData,
	CustomFormData,
	PartialGig,
	useGig,
} from '@/components/gig/hooks/useGig';
import {CreateGigFooter} from '@/components/gig/layout/CreateGigFooter';
import {useGigFormNavigation} from '@/components/gig/hooks/useCreateGigPagination';

const CreateGig = () => {
	const router = useRouter();
	const {_id} = router.query as {_id: string};
	const {data, query, mutation} = useGig(_id);
	const {saveAndContinue} = useGigFormNavigation(stages, 4);

	const onSubmit = async (formData: CustomFormData<PartialGig>) => {
		const response = await mutation.mutate(formData);
		if (!response) return;
		saveAndContinue(_id);
	};

	return (
		<MultistageFormContainer
			documentTitle="Create a gig"
			title="Let's narrow down the participants"
			status="In progress"
			stages={stages.map((stage) => ({
				...stage,
				href: `${_id}/${stage.href}`,
			}))}
			currentIndex={4}>
			{data && (
				<FormikWrapper
					initialValues={_initialValues.targeting(data)}
					validationSchema={validationSchemas.targetting}
					onSubmit={async (values) => {
						return onSubmit(createCustomFormData(values));
					}}>
					{(formik) => (
						<form
							className="space-y-8 px-4"
							onSubmit={formik.handleSubmit}>
							<TargetingAndRequirements formik={formik} />
							<Separator />
							<CreateGigFooter
								text={'Submit and finalize gig'}
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
