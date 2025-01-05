import {Paragraph, Caption} from '@/components/design-sytem/typography';
import AddRewardPolicy from '@/components/modals/create-reward-policy';
import {Box, Flex} from '@radix-ui/themes';
import {RewardPoliciesCombobox} from './RewardsCombobox';
import {ErrorMessage} from './extras';
import {PlusIcon} from 'lucide-react';
import {Button} from '@/components/ui/aria-components/Button';
import Symbol from '@/components/icons/symbol';

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
	<Box className="space-y-4 flex flex-col gap-4 items-start">
		<label className="space-y-2">
			<p>
				Reward policy <span className="text-red-500">*</span>
			</p>
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
					<Button onPress={openAddRewardPolicyModal}>
						<Symbol>add</Symbol>
						Add a new reward policy?
					</Button>
				}
			/>
		</Box>
	</Box>
);
