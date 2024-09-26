import React from 'react';
import { Paragraph, Caption } from '@/components/design-sytem/typography';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/hooks/useApiFetcher';
import { ClientsCombobox, ErrorMessage } from '@/pages/gigs/create_gig';

interface GigClientInfoProps {
    values: any;
    errors: any;
    touched: any;
    setFieldValue: (field: string, value: any) => void;
}

export const GigClientInfo: React.FC<GigClientInfoProps> = ({
    values,
    errors,
    touched,
    setFieldValue,
}) => {
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

    return (
        <div className="space-y-2">
            <Paragraph weight={'semibold'}>
                Client <span className="text-red-500">*</span>
            </Paragraph>
            {clientsQuery.data && (
                <ClientsCombobox
                    value={values.client}
                    data={clientsQuery.data}
                    form={{ setFieldValue }}
                />
            )}
            {touched.client && errors.client && (
                <ErrorMessage>{errors.client}</ErrorMessage>
            )}
            <Caption color={'tertiary'}>
                Select a client to associate this gig with.
            </Caption>
        </div>
    );
};