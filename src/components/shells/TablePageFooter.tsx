import {Caption} from '../design-sytem/typography';
import SearchBox from '../search/Search';
import Flex from '../design-sytem/flex';
import {Button, TabNav} from '@radix-ui/themes';
import {ChevronRight} from '../icons/chevron.right';
import {ChevronLeft} from '../icons/chevron.left';
import {FilterColumnConfig, GigShellProps} from '.';
import {useRouter} from 'next/router';
import {useCallback, useState} from 'react';
import {useSearch} from '../search/use-search';

export const TABLE_ACTIONS_HEIGHT = 48 * 2;
const DEFAULT_COLUMNS: FilterColumnConfig[] = [
	{label: 'Company', type: 'string', enabled: true},
	{label: 'Tag', type: 'string', enabled: true},
	{label: 'People', type: 'string', enabled: true},
	{label: 'Stage', type: 'string', enabled: true},
	{label: 'Close date', type: 'date', enabled: true},
	{label: 'Location', type: 'string', enabled: true},
];

const TablePageFooter = ({
	tabs,
	activeTab,
	currentPage,
	hasNextPage,
	hasPreviousPage,
	nextPage,
	pageSize,
	previousPage,
	total,
}: GigShellProps) => {
	const router = useRouter();
	const {value, setSearchQuery} = useSearch();
	const [columns, setColumns] = useState<FilterColumnConfig[]>(DEFAULT_COLUMNS);

	const handleColumnToggle = (label: string, enabled: boolean) => {
		// Update column visibility in your state management solution
		console.log(`Column ${label} toggled to ${enabled}`);
	};

	const handleTabChange = useCallback(
		(tab: string) => {
			const currentQuery = new URLSearchParams(window.location.search);
			currentQuery.set('tab', tab.toLowerCase().replaceAll(' ', '-'));

			router.push({
				query: {
					...router.query,
					tab: currentQuery.get('tab'),
				},
			});
		},
		[router],
	);

	return (
		<Flex className="justify-end items-center space-x-8 py-2 px-4 sticky bottom-0 left-0 w-full bg-white border-t border-zinc-400/30">
			<Caption
				className="inline-flex gap-1 mr-4 font-medium"
				color={'tertiary'}>
				{(currentPage - 1) * pageSize + 1} -{' '}
				{(currentPage - 1) * pageSize + pageSize} of {total}
			</Caption>
			<Flex style={{gap: 8}}>
				<Button
					onClick={previousPage}
					disabled={!hasPreviousPage}
					color={'gray'}
					radius="full"
					variant={'soft'}>
					<ChevronLeft />
					Previous
				</Button>
				<Button
					onClick={nextPage}
					disabled={!hasNextPage}
					className="items-center flex"
					color={'gray'}
					radius="full"
					variant={'soft'}>
					Next
					<ChevronRight />
				</Button>
			</Flex>
		</Flex>
	);
};

export default TablePageFooter;
