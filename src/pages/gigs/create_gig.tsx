import { useState } from 'react';
import { useRouter } from 'next/router';
import { useMutation, useQuery } from '@tanstack/react-query';
import { H2, Paragraph, Caption } from '@/components/design-sytem/typography';
import Breadcrumbs from '@/components/ui/breadcrumbs';
import GeneralLayout from '@/layout/GeneralLayout';
import { Box, Button, Flex } from '@radix-ui/themes';
import axiosInstance from '@/hooks/useApiFetcher';
import { SURVEY_ROUTES } from '@/lib/api-routes';
import { withAuth } from '@/components/withAuth';
import Spinner from '@/components/spinner/Spinner';
import useDisclosure from '@/hooks/useDisclosure';
import { FormikWrapper } from './create-gig-components/FormikWrapper';
import { ClientSelection } from './create-gig-components/ClientSelection';
import { GigDetails } from './create-gig-components/GigDetails';
import { AdditionalInfo } from './create-gig-components/AdditionalInfo';
import { GigBehavior } from './create-gig-components/GigBehavior';
import { GigPreview } from './create-gig-components/GigPreview';
import Separator from '@/components/design-sytem/separator';
import { ErrorMessage } from './create-gig-components/extras';
import { AxiosRequestHeaders } from 'axios';

const CreateGig = () => {
	const router = useRouter();
	const [previewImage, setPreviewImage] = useState('/gig-placeholder.png');
	const { isOpen: isAddClientModalOpen, onClose: closeAddClientModal, onOpen: openAddClientModal } = useDisclosure();
	const { isOpen: isAddRewardPolicyModalOpen, onClose: closeAddRewardPolicyModal, onOpen: openAddRewardPolicyModal } = useDisclosure();

	const gigMutation = useMutation({
		mutationKey: ['gigs'],
		mutationFn: async (formData: FormData) => {
			const response = await axiosInstance.post(SURVEY_ROUTES.CREATE_SURVEY, formData, {
				headers: { 'Content-Type': 'multipart/form-data' } as AxiosRequestHeaders,
			});
			router.push(`/gigs/${response._id}`);
		},
	});

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
		<GeneralLayout>
			<Box className="p-4 pb-16  container mx-auto gap-8">
				<div className="flex flex-col h-full">
					<Box className="px-2 mb-4">
						<Breadcrumbs items={['Dashboard', 'Gigs', 'Create gig']} />
					</Box>
					<Box className="px-4 mb-8">
						<H2 className="tracking-tight">Add a new gig</H2>
						<Paragraph>Create a gig to start collecting responses.</Paragraph>
						<Separator className="my-2" />
						<Caption>
							<em>Required fields are marked with an asterisk (*).</em>
						</Caption>
					</Box>

					<FormikWrapper
						onSubmit={async (values) => {
							const formData = new FormData();
							Object.entries(values).forEach(([key, value]) => {
								formData.append(key, value as string | Blob);
							});
							return gigMutation.mutate(formData);
						}}
					>
						{(formik) => (
							<div className="grid grid-cols-4 gap-8">
								<form className="col-span-3" onSubmit={formik.handleSubmit}>
									<Flex direction="column" gap="3" className="px-4">
										<ClientSelection
											clientsQuery={clientsQuery}
											formik={formik}
											openAddClientModal={openAddClientModal}
										/>
										<Separator />
										<GigDetails
											formik={formik}
											setPreviewImage={setPreviewImage}
										/>
										<Separator />
										<AdditionalInfo
											formik={formik}
											rewardPoliciesQuery={rewardPoliciesQuery}
											openAddRewardPolicyModal={openAddRewardPolicyModal}
										/>
										<Separator />
										<GigBehavior formik={formik} />
										<Separator />
										<Flex direction="column" gap="2">
											<Button
												type="submit"
												disabled={!formik.isValid || gigMutation.isPending}
											>
												{gigMutation.isPending ? (
													<>
														<Spinner /> Creating...
													</>
												) : (
													'Create gig'
												)}
											</Button>
											{gigMutation.isError && (
												<ErrorMessage>
													{(gigMutation.error as any)?.message ?? 'An error occurred'}
												</ErrorMessage>
											)}
										</Flex>
									</Flex>
								</form>
								<GigPreview
									clientsQuery={clientsQuery}
									rewardPoliciesQuery={rewardPoliciesQuery}
									previewImage={previewImage}
									formValues={formik.values}
								/>
							</div>
						)}
					</FormikWrapper>
				</div>
			</Box>
		</GeneralLayout>
	);
};

export default withAuth(CreateGig);
