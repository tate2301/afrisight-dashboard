import {CheckFill} from '@/components/icons/check.fill';
import {LockFill} from '@/components/icons/lock.fill';
import {SlashFill} from '@/components/icons/slash.fill';
import {XFill} from '@/components/icons/x.fill';
import {AddModalProp} from '@/components/modals/create-client';
import AddUser from '@/components/modals/create-user';
import Pill from '@/components/pill';
import {useGetCurrentTabFromQuery} from '@/components/shells';
import PageWithTableShell from '@/components/shells/gig';
import {DataTable} from '@/components/ui/datatable';
import {Dropdown} from '@/components/ui/dropdown';
import apiClient from '@/hooks/useApiFetcher';
import axiosInstance from '@/hooks/useApiFetcher';
import GeneralLayout from '@/layout/GeneralLayout';
import {formatDate} from '@/utils/strings';
import {PaginatedResponse} from '@/utils/types';
import {EllipsisHorizontalIcon} from '@heroicons/react/24/outline';
import {AlertDialog, Button, Checkbox, Flex} from '@radix-ui/themes';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {ColumnDef, Row} from '@tanstack/react-table';
import {ReactNode, useCallback, useEffect, useMemo, useState} from 'react';

const tabs = ['All', 'Active', 'Suspended'];

type Participant = {
	_id: string;
	fullName: string;
	email: string;
	lastLogin: string;
	status: 'active' | 'suspended';
	createdAt: string;
};

const UserActionsAlertDialog = ({
	callback,
	trigger,
	title,
	description,
	actionLabel,
	isLoading,
	color,
}: {
	title: string;
	description: string;
	actionLabel: string;
	callback: () => Promise<void>;
	isLoading?: boolean;
	trigger: ReactNode;
	color: 'green' | 'red' | 'blue';
}) => {
	const [isOpen, setIsOpen] = useState(false);

	const onSubmit = async () => {
		callback();
	};

	useEffect(() => {
		if (!isLoading && isOpen) {
			setIsOpen(false);
		}
	}, [isLoading]);

	return (
		<AlertDialog.Root
			open={isOpen}
			onOpenChange={setIsOpen}>
			<AlertDialog.Trigger>{trigger}</AlertDialog.Trigger>
			<AlertDialog.Content maxWidth="450px">
				<AlertDialog.Title>{title}</AlertDialog.Title>
				<AlertDialog.Description size="2">
					{description}
				</AlertDialog.Description>

				<Flex
					gap="3"
					mt="4"
					justify="end">
					<AlertDialog.Cancel>
						<Button
							variant="soft"
							color="gray">
							Cancel
						</Button>
					</AlertDialog.Cancel>
					<Button
						onClick={onSubmit}
						disabled={isLoading}
						loading={isLoading}
						variant="solid"
						color={color}>
						{actionLabel}
					</Button>
				</Flex>
			</AlertDialog.Content>
		</AlertDialog.Root>
	);
};

const UserActions = (row: Row<Participant>) => {
	const queryClient = useQueryClient();
	const _id = useMemo(() => row.original._id, [row]);

	const invalidateQueries = (_id: string) =>
		queryClient.invalidateQueries({queryKey: ['users']});

	const suspendMutation = useMutation({
		mutationKey: [row.original._id, 'users'],
		mutationFn: async (data: any) => {
			await apiClient
				.delete(`/admin/user/${data._id}`)
				.then(() => invalidateQueries(_id));
		},
		onSuccess: () => {},
	});

	const resetPasswordMutation = useMutation({
		mutationKey: [row.original._id, 'users'],
		mutationFn: async (data: any) => {
			await apiClient
				.post(`/admin/user/${data._id}/reset-password`)
				.then(() => invalidateQueries(_id));
		},
		onSuccess: () => {},
	});

	const enableAccountMutation = useMutation({
		mutationKey: [row.original._id, 'users'],
		mutationFn: async (data: any) => {
			await apiClient
				.post(`/admin/user/${data._id}/enable`)
				.then(() => invalidateQueries(_id));
		},
		onSuccess: () => {
			invalidateQueries(_id);
		},
	});

	const suspendUser = useCallback(async () => {
		await suspendMutation.mutate({_id});
	}, [suspendMutation, _id]);

	const resetPassword = useCallback(async () => {
		await resetPasswordMutation.mutate({_id});
	}, [resetPasswordMutation, _id]);

	const enableAccount = useCallback(async () => {
		await enableAccountMutation.mutate({_id});
	}, [enableAccountMutation, _id]);

	return (
		<Flex gap="3">
			<UserActionsAlertDialog
				title="Reset password"
				description="A password reset email will be sent to the email address associated with this account. Please check inbox for the password reset email."
				actionLabel="Reset password"
				color="red"
				isLoading={resetPasswordMutation.isPending}
				trigger={
					<Button
						size={'1'}
						className="flex items-center gap-2 outline-none rounded-lg"
						color={'gray'}>
						<LockFill className="size-5" /> Reset password
					</Button>
				}
				callback={resetPassword}
			/>
			{row.original.status.toLowerCase() === 'active' && (
				<UserActionsAlertDialog
					title="Revoke access"
					actionLabel="Revoke access"
					description="This team member will immediately lose access to the CX Mappers platform. Are you sure you want to revoke access?"
					color="red"
					isLoading={suspendMutation.isPending}
					trigger={
						<Button
							size={'1'}
							className="flex items-center gap-2 outline-none rounded-lg"
							color={'red'}>
							<SlashFill className="size-5" /> Revoke access
						</Button>
					}
					callback={suspendUser}
				/>
			)}
			{row.original.status.toLowerCase() === 'inactive' && (
				<UserActionsAlertDialog
					title="Re-enable account"
					color={'green'}
					actionLabel="Re-enable account"
					description="This team member will immediately gain access to the CX Mappers platform. Are you sure you want to re-enable access?"
					isLoading={enableAccountMutation.isPending}
					trigger={
						<Button
							size={'1'}
							variant="solid"
							className="flex items-center gap-2 outline-none rounded-lg"
							color={'green'}>
							<CheckFill className="size-5" /> Enable account
						</Button>
					}
					callback={enableAccount}
				/>
			)}
		</Flex>
	);
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
		cell: ({row}) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label="Select row"
			/>
		),
		enableSorting: false,
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
		id: 'lastLogin',
		accessorKey: 'lastLogin',
		header: 'Last Login',
	},
	{
		id: 'status',
		accessorKey: 'status',
		header: 'Status',
		cell: ({row}) => (
			<Pill
				css={{paddingLeft: 4}}
				colorScheme={
					row.original.status.toLowerCase() === 'active' ? 'surface' : 'danger'
				}>
				{row.original.status.toLowerCase() === 'active' ? (
					<CheckFill className="size-5" />
				) : (
					<XFill className="size-5" />
				)}
				{row.original.status.toLowerCase() === 'active'
					? 'Active'
					: 'Suspended'}
			</Pill>
		),
	},
	{
		id: 'createdAt',
		accessorKey: 'createdAt',
		header: 'Created At',
	},
	{
		id: 'actions',
		header: '',
		cell: ({row}) => <UserActions {...row} />,
	},
];

export default function Users() {
	const currentTab = useGetCurrentTabFromQuery(tabs);

	const getUsers = async (page = 0) => {
		const res = await axiosInstance.get<PaginatedResponse<Participant>>(
			`/auth/users/admin?page=${page}&select=${currentTab}`,
		);
		if (!res.docs) throw new Error('No users found');
		const users = res.docs.map((profile: any) => ({
			_id: profile.user._id,
			fullName: profile.firstname
				? `${profile.firstname} ${profile.surname}`
				: 'Admin User',
			email: profile.user.email,
			status: profile.user.status,
			lastLogin: formatDate(profile.user.lastLogin),
			createdAt: formatDate(profile.user.createdAt),
		}));
		return {
			...res,
			docs: users,
		};
	};

	const {data, isLoading} = useQuery({
		queryKey: ['users'],
		queryFn: () => getUsers(),
	});

	if (isLoading) return <div>Loading...</div>;
	if (!data) return <div>No data</div>;

	const PageActions = () => (
		<>
			<AddUser />
		</>
	);

	return (
		<GeneralLayout>
			<PageWithTableShell
				actions={<PageActions />}
				title="Administrators"
				activeTab={currentTab}
				tabs={tabs}
				total={data.totalDocs}
				currentPage={data.page}
				pageSize={data.limit}
				fetchSurveys={() => Promise.resolve()}>
				<DataTable
					columns={clientsColumns}
					data={data.docs || []}
				/>
			</PageWithTableShell>
		</GeneralLayout>
	);
}
