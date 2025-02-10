import SearchBox from '../search/Search';
import Flex from '../design-sytem/flex';
import {FilterColumnConfig, GigShellProps} from '.';
import {useRouter} from 'next/router';
import {useCallback} from 'react';
import Box from '../design-sytem/box';
import {useSearch} from '../search/use-search';
import {NavTab, NavTabList} from '../ui/nav-tab';
import Spinner from '../ui/spinner';
import {TABLE_ACTIONS_HEIGHT} from '@/layout/constants';

export {TABLE_ACTIONS_HEIGHT};

const DEFAULT_COLUMNS: FilterColumnConfig[] = [
	{label: 'Company', type: 'string', enabled: true},
	{label: 'Tag', type: 'string', enabled: true},
	{label: 'People', type: 'string', enabled: true},
	{label: 'Stage', type: 'string', enabled: true},
	{label: 'Close date', type: 'date', enabled: true},
	{label: 'Location', type: 'string', enabled: true},
];

export default function TablePageHeader({
	tabs,
	activeTab,
	actions,
	isLoading,

	title,
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
		<Box
			className="flex-col w-full"
			style={{minHeight: TABLE_ACTIONS_HEIGHT}}>
			<NavTabList className="flex-1 p-2 border-b border-zinc-400/10">
				<Flex>
					{tabs.map((tab) => (
						<NavTab
							isActive={activeTab === tab.toLowerCase().replaceAll(' ', '-')}
							onClick={() => handleTabChange(tab)}>
							{tab}
						</NavTab>
					))}
				</Flex>
			</NavTabList>
			<div className="flex flex-1 items-center justify-between py-2 px-4">
				<h1 className="font-medium text-lg">
					{title} - {activeTab[0]?.toUpperCase()}
					{activeTab?.slice(1, activeTab.length)}
				</h1>
				<Flex className="flex-1 justify-end h-full items-center px-4 space-x-2">
					<SearchBox
						value={value}
						onChange={setSearchQuery}
					/>
					{actions}
				</Flex>
			</div>

			{isLoading && (
				<Flex>
					<Spinner />
				</Flex>
			)}
		</Box>
	);
}
