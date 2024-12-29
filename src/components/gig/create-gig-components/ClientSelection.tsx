import { Paragraph, Caption } from '@/components/design-sytem/typography';
import { ClientsCombobox } from './ClientsCombobox';
import AddClient from '@/components/modals/create-client';
import { Box, Flex } from '@radix-ui/themes';
import { ErrorMessage } from './extras';
import { PlusIcon } from 'lucide-react';
import Symbol from '@/components/icons/symbol';
import { Button } from '@/components/ui/aria-components/Button';

type ClientSelectionProps = {
	clientsQuery: any;
	formik: any;
	openAddClientModal: () => void;
};

export const ClientSelection = ({
	clientsQuery,
	formik,
	openAddClientModal,
}: ClientSelectionProps) => (
	<Box className="flex flex-col">
		<label className="space-y-2 mb-4">

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
		<Box>
			<AddClient
				callback={(client) => formik.setFieldValue('client', client)}
				trigger={
					<Button
						variant="primary"
						onPress={openAddClientModal}>
						<Symbol>
							add
						</Symbol>{" "}
						Add a new client?
					</Button>
				}
			/>
		</Box>
	</Box>
);
