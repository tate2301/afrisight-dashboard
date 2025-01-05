import {useRouter} from 'next/router';
import {withAuth} from '@/components/withAuth';
import {
	_initialValues,
	FormikWrapper,
	TBaseGig,
	validationSchemas,
} from '../../../../components/gig/create-gig-components/FormikWrapper';
import {GigDetails} from '../../../../components/gig/create-gig-components/GigDetails';
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
	const {data, cancel, mutation} = useGig(_id);
	const {saveAndContinue} = useGigFormNavigation(stages, 0);

	const onSubmit = async (formData: CustomFormData<PartialGig>) => {
		const response = await mutation.mutate(formData);
		if (!response) return;
		saveAndContinue(_id);
	};

	return (
		data && (
			<FormikWrapper
				initialValues={_initialValues.basicInformation(data)}
				validationSchema={validationSchemas.basicInformation}
				onSubmit={async (values: TBaseGig) => {
					return onSubmit(createCustomFormData(values));
				}}>
				{(formik) => {
					return (
						<MultistageFormContainer
							documentTitle="Create a gig"
							title="Basic gig information"
							status="In progress"
							stages={stages.map((stage) => ({
								...stage,
								href: `${_id}/${stage.href}`,
							}))}
							currentIndex={0}
							cancel={cancel}>
							<form
								className="flex flex-col space-y-8 px-4"
								onSubmit={formik.handleSubmit}>
								<GigDetails formik={formik} />

								<CreateGigFooter
									isPending={mutation.isPending}
									disabled={!formik.isValid || mutation.isPending}
									error={mutation.error?.message}
								/>
							</form>
						</MultistageFormContainer>
					);
				}}
			</FormikWrapper>
		)
	);
};

export default withAuth(CreateGig);
