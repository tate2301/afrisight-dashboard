import { Gig, Profile, User } from '@/utils/types';
import { UseMutateFunction, UseMutationResult } from '@tanstack/react-query';
import { LocationData } from '@/components/gig/create-gig-components/FormikWrapper';
import { FormikProps } from 'formik';
import { Location } from '@/utils/types';

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
    formik: FormikProps<GigFormValues>;
    gig: Gig;
    updateGigMutation: UseMutationResult<any, Error, Partial<GigFormValues>>;
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

export interface GigFormValues {
    name: string;
    description: string;
    targetGender: 'Male' | 'Female' | 'Other' | 'All';
    targetAgeRange: {
        min: number;
        max: number;
    };
    location: Location;
    languageRequirements: string[];
    educationLevel: string;
    questionOrdering: 'preserve' | 'shuffle';
    difficulty: 'easy' | 'medium' | 'hard';
    client: string;
    rewardPolicy: string;
}

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
