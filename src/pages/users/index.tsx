import {CheckFill} from '@/components/icons/check.fill';
import {LockFill} from '@/components/icons/lock.fill';
import {SlashFill} from '@/components/icons/slash.fill';
import {XFill} from '@/components/icons/x.fill';
import AddUser from '@/components/modals/create-user';
import Pill from '@/components/pill';
import {useGetCurrentTabFromQuery} from '@/components/shells';
import PageWithTableShell from '@/components/shells/table-shell';
import {DataTable} from '@/components/ui/datatable';
import TableLink from '@/components/ui/datatable/Link';
import apiClient from '@/hooks/useApiFetcher';
import axiosInstance from '@/hooks/useApiFetcher';
import GeneralLayout from '@/layout/GeneralLayout';
import {formatDate} from '@/utils/strings';
import {PaginatedResponse} from '@/utils/types';
import {AlertDialog, Badge, Button, Checkbox, Flex} from '@radix-ui/themes';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {ColumnDef, Row} from '@tanstack/react-table';
import Link from 'next/link';
import {ReactNode, useCallback, useEffect, useMemo, useState} from 'react';

const tabs = ['All', 'Active', 'Suspended'];

export type TeamMember = {
	_id: string;
	fullName: string;
	email: string;
	lastLogin: string;
	status: 'active' | 'suspended';
	createdAt: string;
};

const teamMembersColumns: ColumnDef<TeamMember>[] = [
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
		cell: ({row}) => (
			<TableLink href={`/users/${row.original._id}`}>
				{row.getValue('fullName')}
			</TableLink>
		),
	},
	{
		id: 'email',
		accessorKey: 'email',
		header: 'Email',
	},
	{
		id: 'email',
		accessorKey: 'email',
		header: 'Email',
		cell: () => <Badge color="gray">Administrator</Badge>,
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
			<Badge
				color={
					row.original.status.toLowerCase() === 'active' ? 'green' : 'red'
				}>
				{row.original.status.toLowerCase() === 'active' ? (
					<CheckFill className="size-4" />
				) : (
					<XFill className="size-4" />
				)}
				{row.original.status.toLowerCase() === 'active'
					? 'Active'
					: 'Suspended'}
			</Badge>
		),
	},
	{
		id: 'createdAt',
		accessorKey: 'createdAt',
		header: 'Created At',
	},
];

export default function Users() {
	const currentTab = useGetCurrentTabFromQuery(tabs);

	const getUsers = async (page = 0) => {
		const res = await axiosInstance.get<PaginatedResponse<TeamMember>>(
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
					columns={teamMembersColumns}
					data={data.docs || []}
				/>
			</PageWithTableShell>
		</GeneralLayout>
	);
}
