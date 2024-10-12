import { CheckFill } from '@/components/icons/check.fill';
import { EnvelopeBadge } from '@/components/icons/envelope.badge';
import AddClient, { Client } from '@/components/modals/create-client';
import { useSearch } from '@/components/search/use-search';
import { useGetCurrentTabFromQuery } from '@/components/shells';
import TablePageHeader from '@/components/shells/TablePageHeader';
import { DataTable } from '@/components/ui/datatable';
import TableLink from '@/components/ui/datatable/Link';
import { usePagination } from '@/hooks/use-pagination';
import axiosInstance from '@/hooks/useApiFetcher';
import { useSetPageTitle } from '@/layout/context';
import GeneralLayout from '@/layout/GeneralLayout';
import { USER_ROUTES } from '@/lib/api-routes';
import { buildApiUrlWithParams } from '@/utils/apiUrl';
import { formatDate } from '@/utils/strings';
import { Checkbox, Flex, Text, Avatar, Badge } from '@radix-ui/themes';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { useEffect } from 'react';

const tabs = ['All'];

const clientsColumns: ColumnDef<Client>[] = [
	{
		id: 'select',
		header: ({ table }) => (
			<Checkbox
				checked={
					table.getIsAllPageRowsSelected() ||
					(table.getIsSomePageRowsSelected() && 'indeterminate')
				}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				aria-label="Select all"
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label="Select row"
				className="mx-auto"
			/>
		),
		enableSorting: false,
	},
	{
		id: 'client',
		accessorKey: 'profilePic',
		header: 'Client',
		cell: ({ row }) => {
			return (
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
						<Text>{row.original.fullName}</Text>
					</TableLink>
				</Flex>
			);
		},
	},
	{
		id: 'email',
		accessorKey: 'email',
		header: 'Email',
		size: 280,
		cell: ({ row }) => (
			<TableLink href={`mailto:${row.original.email}`}>
				{row.original.email.toLocaleLowerCase()}
			</TableLink>
		),
	},

	{
		id: 'isEmailVerified',
		accessorKey: 'isEmailVerified',
		header: 'Email Verified',
		cell: ({ row, column }) => (
			<Badge color={row.original.isEmailVerified ? 'blue' : 'gray'}>
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
			</Badge>
		),
		size: 280,
	},
	{
		id: 'createdAt',
		accessorKey: 'createdAt',
		header: 'Joined',
		size: 280,
	},
];

export default function Clients() {
	useSetPageTitle('Clients');
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

	const { data, isLoading, isError } = useQuery({
		queryKey: ['clients', searchQuery.value, page, pageSize],
		queryFn: async () => {
			const url = buildApiUrlWithParams(USER_ROUTES.GET_CLIENTS, {
				pageSize: pageSize,
				page: page,
				s: searchQuery.value,
				profileType: 'CLIENT',
			});
			const response = await axiosInstance.get(url);
			if (!response.docs) throw new Error('No clients found');

			const clients = response.docs.map((doc: any) => ({
				_id: doc._id,
				fullName: `${doc.firstname} ${doc.lastName ?? ''}`,
				email: doc.user.email,
				createdAt: formatDate(doc.createdAt),
				gigs: doc.gigs,
				profilePic: doc.profilePic,
				isEmailVerified: doc.user.isEmailVerified,
				lastLogin: doc.user.lastLogin,
			}));
			return {
				...response,
				docs: clients,
			};
		},
		placeholderData: keepPreviousData,
	});

	useEffect(() => {
		if (data) {
			onPaginationNavParamsChange({
				...paginationNavParams,
				hasNextPage: data.hasNextPage,
				hasPreviousPage: data.hasPreviousPage,
			});
		}
	}, [data]);

	return (
		<GeneralLayout>
			{!isLoading && !isError && (

				<DataTable
					selectedItems={[]}
					tableActions={<></>}
					columns={clientsColumns}
					data={data?.docs}
					header={
						<TablePageHeader
							actions={<AddClient />}
							title="Clients"
							activeTab={currentTab}
							tabs={tabs}
							total={data.total}
							currentPage={data.page}
							hasNextPage={paginationNavParams.hasNextPage}
							hasPreviousPage={paginationNavParams.hasPreviousPage}
							nextPage={next}
							previousPage={previous}
							pageSize={data.limit}
							isLoading={isLoading}
							fetch={() => Promise.resolve()} />}
				/>
			)}
		</GeneralLayout>
	);
}
