'use client';

import apiClient from '@/hooks/useApiFetcher';
import { Gig } from '@/utils/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { FormState } from './types';
import axiosServerInstance from '@/helpers/server/auth/axiosServerInstance';
import GigPageShell from './GigPageShell';
import { patchGig } from './utils';
import axiosClientInstance from '@/helpers/server/auth/axiosClientInstance';

export default function GigPage({ gig }: { gig: Gig }) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const queryKey = `gig-${gig._id}`;

    const { mutate, isPending } = useMutation({
        mutationFn: async (values: FormState) => {
            await patchGig(gig._id as string, values);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [queryKey] });
        },
    });

    const publishMutation = useMutation({
        mutationFn: async () => {
            await axiosClientInstance.post(
                `/survey/${gig._id as string}/publish/toggle`,
            );
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: [queryKey] });
        },
    });

    const saveGigChanges = useCallback(
        (form: string) => {
            if (!gig) return;

            if (gig) {
                const values = { ...(gig as Gig), form: form } as unknown as FormState;
                mutate(values);
            }
        },
        [gig],
    );

    const publishGig = useCallback(
        (form: any) => {
            publishMutation.mutate();
        },
        [saveGigChanges],
    );

    if (!gig) return null;

    return (
        <GigPageShell
            {...{
                survey: gig,
                mutate,
                isPending,
                saveGigChanges,
                publishGig,
                isPublishing: publishMutation.isPending,
            }}
        />
    );
}
