import AlertMessage from '@/components/alerts/AlertMessage';
import Box from '@/components/design-sytem/box';
import Button from '@/components/design-sytem/button';
import {Caption, Paragraph} from '@/components/design-sytem/typography';
import {CheckFill} from '@/components/icons/check.fill';
import {EnvelopeBadge} from '@/components/icons/envelope.badge';
import AddClient, {Client} from '@/components/modals/create-client';
import Pill from '@/components/pill';
import {useGetCurrentTabFromQuery} from '@/components/shells';
import PageWithTableShell from '@/components/shells/table-shell';
import Spinner from '@/components/spinner/Spinner';
import {DataTable} from '@/components/ui/datatable';
import axiosInstance from '@/hooks/useApiFetcher';
import GeneralLayout from '@/layout/GeneralLayout';
import {formatDate} from '@/utils/strings';
import {CameraIcon, PlusIcon} from '@heroicons/react/24/outline';
import {
	Checkbox,
	Flex,
	Text,
	TextField,
	Dialog,
	Avatar,
} from '@radix-ui/themes';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {ColumnDef} from '@tanstack/react-table';
import {Field, Form, Formik} from 'formik';
import {MoreHorizontalIcon} from 'lucide-react';
import {useRef} from 'react';

const tabs = ['All', 'With ongoing Gigs', ''];

const clientsColumns: ColumnDef<Client>[] = [
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
		id: 'client',
		accessorKey: 'profilePic',
		header: 'Client',
		size: 40,
		cell: ({row}) => {
			return (
				<Flex
					align={'center'}
					gap={'4'}>
					<Avatar
						size={'4'}
						radius="full"
						fallback={row.original.email.substring(0, 1)}
						src={row.original.profilePic}
						alt={'client profile'}
					/>
					<Box>
						<Paragraph
							color={'primary'}
							weight={'semibold'}>
							{row.original.fullName}
						</Paragraph>
						<Paragraph color={'secondary'}>{row.original.email}</Paragraph>
					</Box>
				</Flex>
			);
		},
	},

	{
		id: 'isEmailVerified',
		accessorKey: 'isEmailVerified',
		header: 'Email Verified',
		cell: ({row, column}) => (
			<Pill colorScheme={row.original.isEmailVerified ? 'primary' : 'surface'}>
				{row.original.isEmailVerified ? (
					<>
						<CheckFill className="size-5" />
						Verified
					</>
				) : (
					<>
						<EnvelopeBadge className="size-5" />
						Verification email sent
					</>
				)}
			</Pill>
		),
	},
	{
		id: 'createdAt',
		accessorKey: 'createdAt',
		header: 'Joined',
	},
	{
		id: 'gigs',
		accessorKey: 'gigs',
		header: 'Gigs',
	},
	{
		id: 'actions',
		header: '',
		cell: ({row}) => (
			<Flex>
				<Button
					variant="ghost"
					colorScheme={'surface'}
					size={'icon'}>
					<MoreHorizontalIcon className="size-5" />
				</Button>
			</Flex>
		),
	},
];

export default function Clients() {
	const currentTab = useGetCurrentTabFromQuery(tabs);
	const {data, isLoading, isError} = useQuery({
		queryKey: ['clients'],
		queryFn: async () => {
			const res = await axiosInstance.get('/admin/client');
			const data = res;
			data.docs = data.docs.map((doc: any) => ({
				_id: doc._id,
				fullName: `${doc.firstname} ${doc.lastName ?? ''}`,
				email: doc.user.email,
				createdAt: formatDate(doc.createdAt),
				gigs: doc.gigs,
				profilePic: doc.profilePic,
				isEmailVerified: doc.user.isEmailVerified,
				lastLogin: doc.user.lastLogin,
			}));
			return res;
		},
	});

	return (
		<GeneralLayout>
			<PageWithTableShell
				actions={<AddClient />}
				title="Clients"
				activeTab={currentTab}
				tabs={tabs}
				total={data?.totalDocs}
				currentPage={data?.currentPage}
				pageSize={20}
				fetchSurveys={() => Promise.resolve()}>
				{data && (
					<DataTable
						columns={clientsColumns}
						data={data?.docs}
					/>
				)}
			</PageWithTableShell>
		</GeneralLayout>
	);
}
