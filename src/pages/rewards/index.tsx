import {useGetCurrentTabFromQuery} from '@/components/shells';
import PageWithTableShell from '@/components/shells/table-shell';
import {DataTable} from '@/components/ui/datatable';
import GeneralLayout from '@/layout/GeneralLayout';
import {Badge, Checkbox, Flex, Spinner} from '@radix-ui/themes';
import {ColumnDef} from '@tanstack/react-table';
import axiosInstance from '@/hooks/useApiFetcher';
import {useQuery} from '@tanstack/react-query';
import AddRewardPolicy from '@/components/modals/create-reward-policy';
import {useSetPageTitle} from '@/layout/context';
import {Paragraph} from '@/components/design-sytem/typography';
import {useSearch} from '@/components/search/use-search';
import {usePagination} from '@/hooks/use-pagination';
import {buildApiUrlWithParams} from '@/utils/apiUrl';
import {useEffect} from 'react';

const tabs = ['All', 'Connected', 'Archived'];

type RewardPolicy = {
	_id: string;
	name: string;
	numberOfRedemptions: number;
	amount: number;
	voucher: boolean;
	points: number;
	dollarValue: number;
	extraRewardType: string;
	createdAt: string;
	updatedAt: string;
};

const clientsColumns: ColumnDef<RewardPolicy>[] = [
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
		size: 32,
	},
	{
		id: 'name',
		accessorKey: 'name',
		header: 'Name',
	},
	{
		id: 'points',
		accessorKey: 'pointsValue',
		header: 'Points',
		enableColumnFilter: true,
	},

	{
		id: 'dollarValue',
		accessorKey: 'dollarValue',
		header: 'Amount',
		cell: ({row}) => <Paragraph>${row.original.dollarValue}</Paragraph>,
	},
	{
		id: 'hasVoucher',
		accessorKey: 'voucher',
		header: 'Voucher',
		cell: ({row}) => (
			<Badge color={row.original.voucher ? 'green' : 'gray'}>
				{row.original.voucher ? 'Yes' : 'No'}
			</Badge>
		),
	},
	{
		id: 'createdAt',
		accessorKey: 'createdAt',
		header: 'Created at',
	},
];

export default function Rewards() {
	useSetPageTitle('Reward Policies');
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

	const {data, isLoading, isError, refetch} = useQuery({
		queryKey: ['reward-policies', searchQuery.value, page, pageSize],
		queryFn: async () => {
			const url = buildApiUrlWithParams('/gamification/reward-policy', {
				page,
				pageSize,
				search: searchQuery.value,
			});
			const response = await axiosInstance.get(url);
			if (!response.docs) throw new Error('No reward policies found');
			const reward_policies = response.docs.map((reward_policy: any) => ({
				_id: reward_policy._id,
				name: reward_policy.name,
				description: reward_policy.description,
				dollarValue: reward_policy.dollarValue,
				pointsValue: reward_policy.pointsValue,
				voucher: !!reward_policy.voucher,
				createdAt: new Date(reward_policy.createdAt).toLocaleDateString(),
			}));

			return {
				...response,
				docs: reward_policies,
			};
		},
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
			{isLoading && (
				<Flex
					justify="center"
					align="center"
					style={{height: '100vh'}}>
					<Spinner />
				</Flex>
			)}
			{!isLoading && !isError && (
				<PageWithTableShell
					actions={
						<>
							<AddRewardPolicy />
						</>
					}
					title="Reward policies"
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
					fetch={() => Promise.resolve()}>
					{data && (
						<DataTable
							columns={clientsColumns}
							data={data.docs}
						/>
					)}
				</PageWithTableShell>
			)}
		</GeneralLayout>
	);
}
