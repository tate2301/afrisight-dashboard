import React from 'react';
import {Paragraph, Caption} from '@/components/design-sytem/typography';
import {useQuery} from '@tanstack/react-query';
import axiosInstance from '@/hooks/useApiFetcher';
import {RewardPoliciesCombobox} from '../gig/create-gig-components/RewardsCombobox';
import {ErrorMessage} from '../gig/create-gig-components/extras';

interface GigRewardPolicyProps {
	values: any;
	errors: any;
	touched: any;
	setFieldValue: (field: string, value: any) => void;
}

export const GigRewardPolicy: React.FC<GigRewardPolicyProps> = ({
	values,
	errors,
	touched,
	setFieldValue,
}) => {
	const rewardPoliciesQuery = useQuery({
		queryKey: ['reward-policies'],
		queryFn: async () => {
			const res = await axiosInstance.get('/gamification/reward-policy');
			return res.map((policy: any) => ({
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
		<div className="mb-4 space-y-2">
			<Paragraph weight={'semibold'}>Reward Policy</Paragraph>
			{rewardPoliciesQuery.data && (
				<RewardPoliciesCombobox
					data={rewardPoliciesQuery.data}
					form={{setFieldValue}}
					value={values.rewardPolicy}
				/>
			)}
			{touched.rewardPolicy && errors.rewardPolicy && (
				<ErrorMessage>{errors.rewardPolicy}</ErrorMessage>
			)}
			<Caption color={'tertiary'}>Select a reward policy for this gig.</Caption>
		</div>
	);
};
