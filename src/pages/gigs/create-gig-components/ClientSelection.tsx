import { Paragraph, Caption } from '@/components/design-sytem/typography';
import { ClientsCombobox } from './ClientsCombobox';
import AddClient from '@/components/modals/create-client';
import { Box, Flex } from '@radix-ui/themes';
import { ErrorMessage } from './extras';

type ClientSelectionProps = {
    clientsQuery: any;
    formik: any;
    openAddClientModal: () => void;
}

export const ClientSelection = ({ clientsQuery, formik, openAddClientModal }: ClientSelectionProps) => (
    <Box className='space-y-2'>
        <label className="space-y-2">
            <Paragraph weight="semibold">
                Client <span className="text-red-500">*</span>
            </Paragraph>
            {clientsQuery.data && (
                <ClientsCombobox
                    data={clientsQuery.data}
                    form={formik}
                    value={formik.values.client}
                />
            )}
            {formik.touched.client && formik.errors.client && (
                <ErrorMessage>{formik.errors.client}</ErrorMessage>
            )}
        </label>
        <Flex>
            <Caption color="secondary">
                Select a client to associate this gig with.
            </Caption>
            <AddClient
                callback={(client) => formik.setFieldValue('client', client)}
                trigger={
                    <Caption
                        as="button"
                        weight="bold"
                        color="primary"
                        onClick={openAddClientModal}
                    >
                        Add a new client?
                    </Caption>
                }
            />
        </Flex>
    </Box>
);
