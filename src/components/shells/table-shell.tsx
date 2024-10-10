import {Paragraph} from '../design-sytem/typography';
import Separator from '../design-sytem/separator';
import SearchBox from '../search/Search';
import Flex from '../design-sytem/flex';
import {Button, Spinner, TabNav} from '@radix-ui/themes';
import SelectWithOptions from '../filter-button';
import {ChevronRight} from '../icons/chevron.right';
import {ChevronLeft} from '../icons/chevron.left';
import {GigShellProps} from '.';
import {useRouter} from 'next/router';
import {useCallback} from 'react';
import Box from '../design-sytem/box';
import {useSearch} from '../search/use-search';
import {CloudDownload} from 'lucide-react';

export default function PageWithTableShell({
	children,
	fetch: fetchSurveys,
	total,
	currentPage,
	pageSize,
	tabs,
	activeTab,
	title,
	actions,
	hasNextPage,
	hasPreviousPage,
	isLoading,
	nextPage,
	previousPage,
}: GigShellProps) {
	const router = useRouter();
	const {value, setSearchQuery} = useSearch();
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
		<>
			<Box
				style={{height: `calc(100vh - ${49}px)`}}
				className="overflow-y-auto relative">
				<Flex className="flex-col w-full sticky top-0 z-50 bg-white border-b border-zinc-400/20">
					<TabNav.Root className="flex-1 h-[49px] items-end">
						{tabs.map((tab) => (
							<TabNav.Link
								active={activeTab === tab.toLowerCase().replaceAll(' ', '-')}
								onClick={() => handleTabChange(tab)}>
								{tab}
							</TabNav.Link>
						))}
					</TabNav.Root>
					<Flex
						css={{gap: 8}}
						alignItems={'center'}
						className="px-4 py-1 justify-between w-full">
						<Flex>
							<SearchBox
								value={value}
								onChange={setSearchQuery}
							/>
							{false && (
								<SelectWithOptions
									options={['Date created', 'Questions', 'Responses']}
									label="Sort by"
								/>
							)}
						</Flex>

						<Flex className="flex-1 justify-end">{actions}</Flex>
					</Flex>
				</Flex>
				{isLoading && (
					<Flex>
						<Spinner />
					</Flex>
				)}
				{!isLoading && children}
			</Box>
			<Separator />
			<Flex className="h-[48px] justify-between items-center bg-white px-4">
				<Paragraph
					className="inline-flex gap-1"
					color={'secondary'}>
					Showing{' '}
					<Paragraph
						color={'primary'}
						weight={'medium'}>
						{(currentPage - 1) * pageSize + 1}
					</Paragraph>{' '}
					to{' '}
					<Paragraph
						color={'primary'}
						weight={'medium'}>
						{(currentPage - 1) * pageSize + pageSize}
					</Paragraph>{' '}
					of{' '}
					<Paragraph
						color={'primary'}
						weight={'medium'}>
						{total}
					</Paragraph>{' '}
					results
				</Paragraph>
				<Flex css={{gap: 8}}>
					<Button
						onClick={previousPage}
						disabled={!hasPreviousPage}
						color={'gray'}
						variant={'outline'}>
						<ChevronLeft />
						Previous
					</Button>
					<Button
						onClick={nextPage}
						disabled={!hasNextPage}
						className="items-center flex"
						color={'gray'}
						variant={'outline'}>
						Next
						<ChevronRight />
					</Button>
				</Flex>
			</Flex>
		</>
	);
}
