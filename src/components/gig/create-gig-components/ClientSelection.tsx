import {Paragraph, Caption} from '@/components/design-sytem/typography';
import {ClientsCombobox} from './ClientsCombobox';
import AddClient from '@/components/modals/create-client';
import {Box, Button, Flex} from '@radix-ui/themes';
import {ErrorMessage} from './extras';
import {PlusIcon} from 'lucide-react';

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
	<Box className="space-y-4 p-4 rounded-xl bg-white pressable-shadow">
		<label className="space-y-2">
			<Paragraph weight="semibold">
				Client <span className="text-red-500">*</span>
			</Paragraph>
			<Caption color="secondary">
				Select a client to associate this gig with.
			</Caption>
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
						size={'2'}
						variant="ghost"
						color="blue"
						radius="full"
						style={{
							fontWeight: 500,
							color: 'var(--colors-primary)',
							fontSize: '14px',
						}}
						onClick={openAddClientModal}>
						<PlusIcon className="size-4" />
						Add a new client?
					</Button>
				}
			/>
		</Box>
	</Box>
);
