import { Paragraph, Caption } from '@/components/design-sytem/typography';
import AddRewardPolicy from '@/components/modals/create-reward-policy';
import { Box, Flex } from '@radix-ui/themes';
import { RewardPoliciesCombobox } from './RewardsCombobox';
import { ErrorMessage } from './extras';

type AdditionalInfoProps = {
    formik: any;
    rewardPoliciesQuery: any;
    openAddRewardPolicyModal: () => void;
}

export const AdditionalInfo = ({ formik, rewardPoliciesQuery, openAddRewardPolicyModal }: AdditionalInfoProps) => (
    <Box className='space-y-2'>
        <label className="space-y-2">
            <Paragraph weight="semibold">
                Reward policy <span className="text-red-500">*</span>
            </Paragraph>
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
        <Flex>
            <Caption color="secondary">
                Select a reward policy to associate with this gig.
            </Caption>
            <AddRewardPolicy
                callback={(rewardPolicy) => formik.setFieldValue('rewardPolicy', rewardPolicy)}
                trigger={
                    <Caption
                        as="button"
                        weight="bold"
                        color="primary"
                        onClick={openAddRewardPolicyModal}
                    >
                        Add a new reward policy?
                    </Caption>
                }
            />
        </Flex>
    </Box>
);
