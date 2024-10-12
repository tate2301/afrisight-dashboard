import { Caption, Paragraph } from '../design-sytem/typography';
import SearchBox from '../search/Search';
import Flex from '../design-sytem/flex';
import { Button, Spinner, TabNav } from '@radix-ui/themes';
import { ChevronRight } from '../icons/chevron.right';
import { ChevronLeft } from '../icons/chevron.left';
import { FilterColumnConfig, GigShellProps } from '.';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';
import Box from '../design-sytem/box';
import { useSearch } from '../search/use-search';
import { ColumnVisibilityToggle } from './ColumnToggle';
import { FilterBuilder } from './FilterBuilder';




export const TABLE_ACTIONS_HEIGHT = 48 * 2;
const DEFAULT_COLUMNS: FilterColumnConfig[] = [
	{ label: "Company", type: "string", enabled: true },
	{ label: "Tag", type: "string", enabled: true },
	{ label: "People", type: "string", enabled: true },
	{ label: "Stage", type: "string", enabled: true },
	{ label: "Close date", type: "date", enabled: true },
	{ label: "Location", type: "string", enabled: true },
]

export default function TablePageHeader({
	tabs,
	activeTab,
	actions,
	isLoading,
	currentPage,
	hasNextPage,
	hasPreviousPage,
	nextPage,
	pageSize,
	previousPage,
	total,
}: GigShellProps) {
	const router = useRouter();
	const { value, setSearchQuery } = useSearch();
	const [columns, setColumns] = useState<FilterColumnConfig[]>(DEFAULT_COLUMNS);

	const handleColumnToggle = (label: string, enabled: boolean) => {
		// Update column visibility in your state management solution
		console.log(`Column ${label} toggled to ${enabled}`)
	}

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
		<Box
			className="flex-col w-full"
			style={{ height: TABLE_ACTIONS_HEIGHT }}>
			<TabNav.Root className="flex-1 h-[48px] items-end px-2">
				{tabs.map((tab) => (
					<TabNav.Link
						active={activeTab === tab.toLowerCase().replaceAll(' ', '-')}
						onClick={() => handleTabChange(tab)}>
						{tab}
					</TabNav.Link>
				))}
				<Flex className="flex-1 justify-end h-full items-center px-4 space-x-2">
					{actions}
				</Flex>
			</TabNav.Root>
			<Flex
				css={{ gap: 8 }}
				alignItems={'center'}
				className="px-4 pl-0 py-1 justify-between w-full h-[48px]">
				<Flex className='space-x-8'>
					<SearchBox
						value={value}
						onChange={setSearchQuery}
					/>
					<div className='w-px h-full bg-zinc-400/20' />
					<Flex className='space-x-2'>
						<ColumnVisibilityToggle
							columns={columns}
							onToggle={(label, enabled) => {
								setColumns(columns.map((c) => c.label === label ? { ...c, enabled } : c));
							}}
						/>
						<FilterBuilder columns={columns} />
					</Flex>
				</Flex>

				<Flex className="flex-1 justify-end items-center space-x-8">
					<Caption
						className="inline-flex gap-1 mr-4 font-medium"
						color={'tertiary'}>
						{(currentPage - 1) * pageSize + 1} -{' '}
						{(currentPage - 1) * pageSize + pageSize} of {total}
					</Caption>
					<Flex style={{ gap: 8 }}>
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
			</Flex>
			{isLoading && (
				<Flex>
					<Spinner />
				</Flex>
			)}
		</Box>
	);
}
