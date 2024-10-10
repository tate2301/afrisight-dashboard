import GeneralLayout from '../../layout/GeneralLayout';
import axiosInstance from '@/hooks/useApiFetcher';
import {SURVEY_ROUTES} from '@/lib/api-routes';
import Link from 'next/link';
import {PlusIcon} from '@heroicons/react/24/outline';
import Box from '@/components/design-sytem/box';
import {Button} from '@radix-ui/themes';
import GigCard from '@/components/gig/card';
import PageWithTableShell from '@/components/shells/table-shell';
import {useSearchParams} from 'next/navigation';
import {keepPreviousData, useQuery} from '@tanstack/react-query';
import {useSetPageTitle} from '@/layout/context';
import {buildApiUrlWithParams} from '@/utils/apiUrl';
import {useEffect} from 'react';
import {useSearch} from '@/components/search/use-search';
import {usePagination} from '@/hooks/use-pagination';
import {FilterConfig, FilterConfigMap, useFilter} from '@/hooks/use-filter';

const tabs = ['All', 'Pending', 'Running', 'Paused', 'Archived'];
const tabToGigStatus = (status: string) => {
	switch (status) {
		case 'all':
			return null;
		case 'pending':
			return 'DRAFT';
		case 'running':
			return 'ACTIVE';
		case 'paused':
			return 'PAUSED';
		case 'archived':
			return 'CLOSED';
		default:
			return null;
	}
};

export type RewardPolicy = {
	_id: string;
	name: string;
	description: string;
	dollarValue: number;
	pointsValue: number;
	voucher: string | null;
};

export type SurveyGig = {
	_id: string;
	category: string;
	status: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'CLOSED';
	name: string;
	description: string;
	questions: string[];
	responses: string[];
	views: number;
	rewardPolicy: RewardPolicy;
	createdAt: string;
	coverImage: string;
};

const filterConfig: FilterConfigMap = {
	status: {
		type: 'select',
		label: 'Status',
		options: [
			{label: 'Active', value: 'active'},
			{label: 'Inactive', value: 'inactive'},
		],
	},
	amount: {
		type: 'number',
		label: 'Amount',
	},
};

function Gig() {
	useSetPageTitle('Gigs');
	const query = useSearchParams();
	const {filters, FilterButton, getFilterQuery} = useFilter(filterConfig);

	const activeTab =
		query.get('tab') || tabs[0].toLowerCase().replaceAll(' ', '-');
	const searchQuery = useSearch();
	const {
		page,
		pageSize,
		next,
		previous,
		paginationNavParams,
		onPaginationNavParamsChange,
	} = usePagination();

	const {
		data: surveys,
		isLoading,
		error,
		refetch,
	} = useQuery({
		queryKey: [
			'surveys',
			activeTab,
			page,
			pageSize,
			searchQuery.value,
			filters,
		],
		queryFn: async () => {
			const url = buildApiUrlWithParams(SURVEY_ROUTES.GET_SURVEYS, {
				status: tabToGigStatus(activeTab),
				pageSize: pageSize,
				page: page,
				s: searchQuery.value,
			});
			const response = await axiosInstance.get(url);

			return response;
		},
		placeholderData: keepPreviousData,
	});

	useEffect(() => {
		if (surveys) {
			onPaginationNavParamsChange({
				...paginationNavParams,
				hasNextPage: surveys.hasNextPage,
				hasPreviousPage: surveys.hasPreviousPage,
			});
		}
	}, [surveys]);

	return (
		<GeneralLayout>
			{!isLoading && !error && (
				<PageWithTableShell
					actions={
						<Link href={'/gigs/create_gig'}>
							<Button>
								<PlusIcon className="size-4" /> Create gig
							</Button>
						</Link>
					}
					title="Gigs"
					activeTab={activeTab}
					tabs={tabs}
					total={surveys.total}
					currentPage={+page}
					pageSize={10}
					hasNextPage={paginationNavParams.hasNextPage}
					hasPreviousPage={paginationNavParams.hasPreviousPage}
					nextPage={next}
					previousPage={previous}
					fetch={refetch}>
					<Box
						css={{padding: '20px 0'}}
						className="py-2 space-y-[20px]">
						{surveys.docs.map((gig: SurveyGig) => (
							<GigCard
								key={gig._id}
								_id={gig._id}
								createdDate={gig.createdAt}
								status={gig.status as unknown as any}
								title={gig.name}
								questions={gig.questions?.length ?? 0}
								responses={gig.responses?.length ?? 0}
								views={gig.views}
								coverImage={gig.coverImage}
							/>
						))}
					</Box>
				</PageWithTableShell>
			)}
		</GeneralLayout>
	);
}

export default Gig;
