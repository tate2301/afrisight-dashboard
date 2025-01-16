import { RewardPolicySelection } from "@/components/gig/create-gig-components/RewardPolicySelection";
import axiosClientInstance from '@/helpers/server/auth/axiosClientInstance';
import useDisclosure from "@/hooks/useDisclosure";
import { Gig } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";

const RewardPolicyAtom = ({ formik, gig }: { formik: any; gig: Gig }) => {
    const { onOpen: openAddRewardPolicyModal } = useDisclosure();

    const rewardPoliciesQuery = useQuery({
        queryKey: ['reward-policies'],
        queryFn: async () => {
            const res = await axiosClientInstance.get('/gamification/reward-policy');
            return res.data.docs.map((policy: any) => ({
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
        <RewardPolicySelection
            rewardPoliciesQuery={rewardPoliciesQuery}
            formik={formik}
            openAddRewardPolicyModal={openAddRewardPolicyModal}
        />
    );
};

export default RewardPolicyAtom;