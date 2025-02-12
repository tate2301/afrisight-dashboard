import {CheckFill} from '@/components/icons/check.fill';
import {XFill} from '@/components/icons/x.fill';
import AddUser from '@/components/modals/create-user';
import {useSearch} from '@/components/search/use-search';
import {useGetCurrentTabFromQuery} from '@/components/shells';
import TablePageHeader from '@/components/shells/TablePageHeader';
import {DataTable} from '@/components/ui/datatable';
import TableLink from '@/components/ui/datatable/Link';
import {Separator} from '@/components/ui/separator';
import {usePagination} from '@/hooks/use-pagination';
import axiosInstance from '@/hooks/useApiFetcher';
import {useSetPageTitle} from '@/layout/context';
import GeneralLayout from '@/layout/GeneralLayout';
import {USER_ROUTES} from '@/lib/api-routes';
import {buildApiUrlWithParams} from '@/utils/apiUrl';
import {formatDate} from '@/utils/strings';
import {
	ArchiveBoxIcon,
	CloudArrowDownIcon,
	TrashIcon,
} from '@heroicons/react/24/solid';
import {Avatar, Badge, Button, Checkbox, Flex, Text} from '@radix-ui/themes';
import {keepPreviousData, useQuery} from '@tanstack/react-query';
import {ColumnDef} from '@tanstack/react-table';
import {LucideCloudDownload, MoreHorizontal} from 'lucide-react';
import {useEffect, useState, useMemo, useCallback} from 'react';

const tabs = ['All'];
const tabToAccountStatus = (status: string) => {
	switch (status) {
		case 'all':
			return null;
		case 'active':
			return 'ACTIVE';
		case 'suspended':
			return 'INACTIVE';
		default:
			return null;
	}
};

export type TeamMember = {
	_id: string;
	fullName: string;
	email: string;
	lastLogin: string;
	status: 'active' | 'suspended';
	createdAt: string;
	profilePic: string;
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
			<Flex
				align={'center'}
				gap={'4'}>
				<Avatar
					size={'1'}
					radius="full"
					fallback={row.original.email.substring(0, 1)}
					src={row.original.profilePic}
					alt={'client profile'}
				/>
				<TableLink href={`/clients/${row.original._id}`}>
					<Text className="truncate ellipsis line-clamp-1">
						{row.original.fullName}
					</Text>
				</TableLink>
			</Flex>
		),
		size: 320,
	},
	{
		id: 'email',
		accessorKey: 'email',
		header: 'Email',
		cell: ({row}) => (
			<TableLink href={`mailto:${row.original.email}`}>
				{row.original.email.toLocaleLowerCase()}
			</TableLink>
		),
		size: 320,
	},
	{
		id: 'role',
		accessorKey: 'role',
		header: 'Role',
		cell: () => (
			<Badge
				variant="outline"
				color="gray">
				Administrator
			</Badge>
		),
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
				color={row.original.status.toLowerCase() === 'active' ? 'green' : 'red'}
				variant="outline">
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
	useSetPageTitle('Administrators');
	const currentTab = useGetCurrentTabFromQuery(tabs);
	const searchQuery = useSearch();
	const {
		page,
		pageSize,
		next,
		previous,
		paginationNavParams,
		onPaginationNavParamsChange,
	} = usePagination();

	const getUsers = useCallback(
		async (page = '1') => {
			const url = buildApiUrlWithParams(USER_ROUTES.GET_ALL_USERS, {
				status: tabToAccountStatus(currentTab),
				pageSize: pageSize,
				page: page,
				s: searchQuery.value,
			});
			const response = await axiosInstance.get(url);

			if (!response.docs) throw new Error('No users found');
			const users = response.docs.map((profile: any) => ({
				_id: profile.user._id,
				fullName: profile.firstname
					? `${profile.firstname} ${profile.surname}`
					: 'Admin User',
				email: profile.user.email,
				status: profile.user.status,
				lastLogin: formatDate(profile.user.lastLogin),
				createdAt: formatDate(profile.user.createdAt),
				profilePic: profile.profilePic,
			}));

			return {
				...response,
				docs: users,
			};
		},
		[currentTab, pageSize, searchQuery.value],
	);

	const {data, isLoading, error, refetch} = useQuery({
		queryKey: ['users', searchQuery.value, page, pageSize, currentTab],
		queryFn: () => getUsers(page),
		placeholderData: keepPreviousData,
	});

	const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

	const handleSelectRows = useCallback((selected: TeamMember[]) => {
		setSelectedUsers(selected.map((user) => user._id));
	}, []);

	useEffect(() => {
		if (data) {
			onPaginationNavParamsChange({
				hasNextPage: data.hasNextPage,
				hasPreviousPage: data.hasPreviousPage,
			});
		}
	}, [data, onPaginationNavParamsChange]);

	const pageActionsContent = useMemo(
		() => (
			<>
				<Button
					color="gray"
					variant="soft"
					radius="full">
					<LucideCloudDownload className="size-5" /> Export
				</Button>
				<AddUser />
			</>
		),
		[],
	);

	const tableActionsContent = useMemo(
		() => (
			<>
				<Button
					className="bg-zinc-800 text-white"
					radius="full"
					variant="soft">
					<ArchiveBoxIcon className="size-4" />
					Archive
				</Button>
				<Button
					radius="full"
					className="bg-zinc-800 text-white"
					variant="soft">
					<CloudArrowDownIcon className="size-5" />
					Export
				</Button>
				<Button
					radius="full"
					className="bg-red-600 text-white">
					<TrashIcon className="size-4" />
					Delete
				</Button>
			</>
		),
		[],
	);

	return (
		<GeneralLayout>
			<div className="max-w-5xl border-r border-zinc-400/30 min-h-full">
				<div className="p-4 px-8 flex justify-between items-end">
					<h1 className="font-semibold tracking-tight text-lg">
						Administrators
					</h1>
					<div className="flex gap-4">
						<Button
							color="gray"
							variant="soft">
							<LucideCloudDownload className="size-5" /> Download team file
						</Button>
						<AddUser />
					</div>
				</div>
				<Separator />

				{!isLoading && !error && (
					// <DataTable
					// 	columns={teamMembersColumns}
					// 	data={data.docs || []}
					// 	selectedItems={selectedUsers}
					// 	onSelect={handleSelectRows}
					// 	tableActions={tableActionsContent}
					// />
					<div className="py-4 max-w-5xl  divide-y divide-zinc-400/10">
						{data.docs.map((user: TeamMember) => (
							<div className="p-4 key={user._id flex justify-between items-start hover:bg-zinc-400/10 transition-color duration-200 ease-out">
								<div className="flex gap-4">
									<Avatar
										size={'1'}
										radius="full"
										fallback={user.email.substring(0, 1)}
										src={user.profilePic}
										alt={'client profile'}
									/>
									<div>
										<h3 className="font-semibold mb-2">
											{user.fullName}{' '}
											<Badge
												color={
													user.status.toLowerCase() === 'active'
														? 'green'
														: 'red'
												}
												className="ml-2"
												variant="soft">
												{user.status.toLowerCase() === 'active' ? (
													<CheckFill className="size-4" />
												) : (
													<XFill className="size-4" />
												)}
												{user.status.toLowerCase() === 'active'
													? 'Active'
													: 'Suspended'}
											</Badge>
										</h3>
										<p className="text-gray-500">{user.email}</p>
									</div>
								</div>
								<div className="flex gap-8 items-center">
									<div>
										<p className="text-zinc-600">
											Last login: {user.lastLogin}
										</p>
									</div>
									<div className="flex gap-4 items-center">
										<Button
											variant={'soft'}
											color={'gray'}>
											<ArchiveBoxIcon className="size-4" />
											Archive
										</Button>
										<Button
											variant={'soft'}
											color={'gray'}>
											<MoreHorizontal />
										</Button>
									</div>
								</div>
							</div>
						))}
						<div className="flex justify-center p-4 text-zinc-400">
							<p>
								You have reached the end of the list. Showing {data.docs.length}{' '}
								Administrator(s)
							</p>
						</div>
					</div>
				)}
			</div>
		</GeneralLayout>
	);
}
