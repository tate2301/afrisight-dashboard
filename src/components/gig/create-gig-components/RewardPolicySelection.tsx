import {Paragraph, Caption} from '@/components/design-sytem/typography';
import AddRewardPolicy from '@/components/modals/create-reward-policy';
import {Box, Button, Flex} from '@radix-ui/themes';
import {RewardPoliciesCombobox} from './RewardsCombobox';
import {ErrorMessage} from './extras';
import {PlusIcon} from 'lucide-react';

type AdditionalInfoProps = {
	formik: any;
	rewardPoliciesQuery: any;
	openAddRewardPolicyModal: () => void;
};

export const RewardPolicySelection = ({
	formik,
	rewardPoliciesQuery,
	openAddRewardPolicyModal,
}: AdditionalInfoProps) => (
	<Box className="space-y-4 p-4 rounded-xl bg-white pressable-shadow">
		<label className="space-y-2">
			<Paragraph weight="semibold">
				Reward policy <span className="text-red-500">*</span>
			</Paragraph>
			<Caption color="secondary">
				Select a reward policy to associate with this gig.
			</Caption>
			{rewardPoliciesQuery.data && (
				<RewardPoliciesCombobox
					data={rewardPoliciesQuery.data}
					form={formik}
					value={formik.values.rewardPolicy}
				/>
			)}
			{formik.touched.rewardPolicy && formik.errors.rewardPolicy && (
				<ErrorMessage>{formik.errors.rewardPolicy}</ErrorMessage>
			)}
		</label>
		<Box>
			<AddRewardPolicy
				callback={(rewardPolicy) =>
					formik.setFieldValue('rewardPolicy', rewardPolicy)
				}
				trigger={
					<Button
						size={'2'}
						variant="ghost"
						color="blue"
						radius="full"
						style={{
							fontWeight: 500,
							color: 'var(--colors-primary)',
							fontSize: '14px',
						}}
						onClick={openAddRewardPolicyModal}>
						<PlusIcon className="size-4" />
						Add a new reward policy?
					</Button>
				}
			/>
		</Box>
	</Box>
);
