import {useRouter} from 'next/router';
import {withAuth} from '@/components/withAuth';
import {
	_initialValues,
	FormikWrapper,
	TBaseGig,
	validationSchemas,
} from '../../../../components/gig/create-gig-components/FormikWrapper';
import {MultistageFormContainer} from '@/components/gig/MultistageFormContainer';
import {stages} from '@/components/gig/stages';
import {
	createCustomFormData,
	CustomFormData,
	PartialGig,
	useGig,
} from '@/components/gig/hooks/useGig';
import {CreateGigFooter} from '@/components/gig/layout/CreateGigFooter';
import {CategoryAndTags} from '@/components/gig/create-gig-components/CategoryAndTags';
import {useGigFormNavigation} from '@/components/gig/hooks/useCreateGigPagination';
import Separator from '@/components/design-sytem/separator';

const CreateGig = () => {
	const router = useRouter();
	const {_id} = router.query as {_id: string};
	const {data, mutation, cancel} = useGig(_id);
	const {saveAndContinue} = useGigFormNavigation(stages, 3);

	const onSubmit = async (formData: CustomFormData<PartialGig>) => {
		const response = await mutation.mutate(formData);
		if (!response) return;
		saveAndContinue(_id);
	};

	return (
		<MultistageFormContainer
			documentTitle="Create a gig"
			title="Category and tags"
			status="In progress"
			stages={stages.map((stage) => ({
				...stage,
				href: `${_id}/${stage.href}`,
			}))}
			currentIndex={3}
			cancel={cancel}>
			{data && (
				<FormikWrapper
					initialValues={_initialValues.category(data)}
					validationSchema={validationSchemas.category}
					onSubmit={async (values: TBaseGig) => {
						return onSubmit(createCustomFormData(values));
					}}>
					{(formik) => (
						<form
							className="space-y-8 px-4"
							onSubmit={formik.handleSubmit}>
							<CategoryAndTags formik={formik} />
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
