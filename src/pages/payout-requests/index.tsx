import {useGetCurrentTabFromQuery} from '@/components/shells';
import TablePageHeader from '@/components/shells/TablePageHeader';
import {DataTable} from '@/components/ui/datatable';
import GeneralLayout from '@/layout/GeneralLayout';
import {Button, Checkbox, Flex} from '@radix-ui/themes';
import {ColumnDef} from '@tanstack/react-table';

const tabs = ['All', 'Pending', 'Completed', 'Rejected'];

type Participant = {
	_id: string;
	fullName: string;
	email: string;
	status: 'pending' | 'completed' | 'rejected';
	amount: number;
	balance: number;
	createdAt: string;
};

const clientsColumns: ColumnDef<Participant>[] = [
	{
		id: 'select',
		header: ({table}) => (
			<Checkbox
				checked={
					table.getIsAllPageRowsSelected() ||
					(table.getIsSomePageRowsSelected() && 'indeterminate')
				}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				aria-label="Select all"
			/>
		),
	},
	{
		id: 'fullName',
		accessorKey: 'fullName',
		header: 'Full Name',
	},
	{
		id: 'email',
		accessorKey: 'email',
		header: 'Email',
	},
	{
		id: 'status',
		accessorKey: 'status',
		header: 'Status',
	},
	{
		id: 'amount',
		accessorKey: 'amount',
		header: 'Amount',
	},
	{
		id: 'balance',
		accessorKey: 'balance',
		header: 'Balance',
	},
	{
		id: 'createdAt',
		accessorKey: 'createdAt',
		header: 'Requested At',
	},
	{
		id: 'actions',
		header: 'Actions',
		cell: ({row}) => (
			<Flex gap="2">
				<Button variant="soft">View</Button>
				<Button variant="soft">Approve</Button>
				<Button
					variant="soft"
					color="red">
					Reject
				</Button>
			</Flex>
		),
	},
];

export default function PayoutRequests() {
	const currentTab = useGetCurrentTabFromQuery(tabs);
	return (
		<GeneralLayout>
			<></>
		</GeneralLayout>
	);
}
