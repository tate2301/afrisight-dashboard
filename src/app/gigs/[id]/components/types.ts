import { Gig, Profile, User } from '@/utils/types';
import { UseMutateFunction } from '@tanstack/react-query';

type FormState = Partial<Omit<Gig, 'rewardPolicy'> & { rewardPolicy?: string }>;

type FormBuilderHeaderProps = {
    save: (form: any) => void;
    publish: (form: any) => void;
    status: string;
    isPublishing: boolean;
    isSaving: boolean;
    gig: Gig
};

type RewardPolicy = {
    _id: string;
    name: string;
    description: string;
    dollarValue: number;
    pointsValue: number;
};

type TabProps = {
    _id: string;
    mutate: UseMutateFunction<void, Error, FormState, unknown>;
    isPending: boolean;
    formik: any;
    gig: Gig;
};

type GigBasicInfoProps = {
    values: any;
    errors: any;
    touched: any;
    handleChange: (e: React.ChangeEvent<any>) => void;
    handleBlur: (e: React.FocusEvent<any>) => void;
    setFieldValue: (field: string, value: any) => void;
};

type Response = {
    _id: string;
    email: string;
    createdAt: string;
    user: User & {
        profile: Profile
    };
    status?: 'pending' | 'approved' | 'rejected';
    isStarred?: boolean;
    responses: Array<{
        question: string;
        value: string;
    }>;
};

type BehaviorTabValues = Pick<FormState, 'questionOrdering' | 'difficulty'>;
type RewardPolicyValues = Pick<FormState, 'rewardPolicy'>;
type BasicInfoValues = Pick<Gig, 'name' | 'description' | 'client'>;

export type {
    FormState,
    FormBuilderHeaderProps,
    BehaviorTabValues,
    Response,
    RewardPolicy,
    RewardPolicyValues,
    BasicInfoValues,
    GigBasicInfoProps,
    TabProps,
};
